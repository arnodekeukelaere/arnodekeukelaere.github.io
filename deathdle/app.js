import { DiscordSDK } from "https://esm.sh/@discord/embedded-app-sdk";

// ---------------------------------------------------------
// CONFIG
// ---------------------------------------------------------

const CLIENT_ID =
  window.DEATHDLE_CLIENT_ID ||
  new URLSearchParams(window.location.search).get("client_id") ||
  "__CLIENT_ID__";

// ---------------------------------------------------------
// ENVIRONMENT
// ---------------------------------------------------------

const params = new URLSearchParams(window.location.search);

// Discord adds frame_id when running as an Activity.
const IS_DISCORD_ACTIVITY = params.has("frame_id");

// ---------------------------------------------------------
// DISCORD SDK
// ---------------------------------------------------------

let discordSdk = null;

if (IS_DISCORD_ACTIVITY) {
  discordSdk = new DiscordSDK(CLIENT_ID);
}

// ---------------------------------------------------------
// AUTH
// ---------------------------------------------------------

let auth = null;

// ---------------------------------------------------------
// GAME STATE
// ---------------------------------------------------------

let game = null;

let currentQuestion = 0;

let currentGuess = null;

let scores = [];

let submitting = false;

// ---------------------------------------------------------
// DOM
// ---------------------------------------------------------

const app = document.querySelector("#app");

// ---------------------------------------------------------
// START
// ---------------------------------------------------------

start().catch((error) => {
  console.error("[Deathdle] Fatal error:", error);

  renderError(error?.message || "Something went wrong starting Deathdle.");
});

// ---------------------------------------------------------
// START GAME
// ---------------------------------------------------------

async function start() {
  if (IS_DISCORD_ACTIVITY) {
    renderLoading("Connecting to Discord...");
  } else {
    renderLoading("Loading today's Deathdle...");
  }

  await setupDiscord();

  renderLoading("Loading today's Deathdle...");

  game = await api("/api/game");

  if (!game || !Array.isArray(game.questions) || game.questions.length !== 5) {
    throw new Error("Today's Deathdle is unavailable.");
  }

  currentQuestion = 0;
  currentGuess = null;
  scores = [];

  renderQuestion();
}

// ---------------------------------------------------------
// DISCORD SETUP
// ---------------------------------------------------------

async function setupDiscord() {
  // -------------------------------------------------------
  // LOCAL DEVELOPMENT
  // -------------------------------------------------------

  if (!IS_DISCORD_ACTIVITY) {
    console.log("[Deathdle] Running in local development mode.");

    return;
  }

  // -------------------------------------------------------
  // REAL DISCORD ACTIVITY
  // -------------------------------------------------------

  await discordSdk.ready();

  console.log("[Deathdle] Discord SDK ready.");
  console.log("[Deathdle] Activity instance:", discordSdk.instanceId);

  /*
   * Ask Discord to authorize this Activity.
   */

  const { code } = await discordSdk.commands.authorize({
    client_id: CLIENT_ID,

    response_type: "code",

    state: "",

    prompt: "none",

    scope: ["identify"],
  });

  if (!code) {
    throw new Error("Discord did not provide an authorization code.");
  }

  /*
   * Exchange the temporary OAuth code for an access token
   * through our backend.
   */

  const response = await fetch("/api/token", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      code,
    }),
  });

  if (!response.ok) {
    let data = null;

    try {
      data = await response.json();
    } catch {
      // Ignore invalid JSON.
    }

    throw new Error(data?.error || "Could not authenticate with Deathdle.");
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new Error("Deathdle authentication did not return an access token.");
  }

  /*
   * Authenticate the Discord Embedded App SDK.
   */

  auth = await discordSdk.commands.authenticate({
    access_token: data.access_token,
  });

  if (!auth) {
    throw new Error("Discord authentication failed.");
  }

  console.log("[Deathdle] Discord authentication successful.");
}

// ---------------------------------------------------------
// API
// ---------------------------------------------------------

async function api(endpoint, options = {}) {
  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
  };

  /*
   * Only send Discord authentication headers when we're
   * actually running inside Discord.
   */

  if (IS_DISCORD_ACTIVITY) {
    if (!auth?.access_token) {
      throw new Error("Deathdle is not authenticated.");
    }

    headers.Authorization = `Bearer ${auth.access_token}`;

    headers["X-Discord-Instance-Id"] = discordSdk.instanceId;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    // No JSON body.
  }

  if (!response.ok) {
    throw new Error(
      data?.error || `Deathdle server error (${response.status}).`,
    );
  }

  return data;
}

// ---------------------------------------------------------
// RENDER QUESTION
// ---------------------------------------------------------

function renderQuestion() {
  const question = game.questions[currentQuestion];

  const startingYear = Math.floor((question.minYear + question.maxYear) / 2);

  currentGuess = startingYear;

  app.innerHTML = `
    <div class="game">

      <div class="header">

        <div class="logo">
          ☠️ DEATHDLE
        </div>

        <div class="progress">
          ${currentQuestion + 1} / ${game.questions.length}
        </div>

      </div>

      <div class="message-card">

        <div class="message-author">
          ${escapeHtml(question.authorName)}
        </div>

        <div class="message-content">
          ${formatMessage(question.content)}
        </div>

        ${
          question.messageUrl
            ? `
              <a
                class="message-link"
                href="${escapeAttribute(question.messageUrl)}"
                target="_blank"
                rel="noopener noreferrer"
              >
                View original message
              </a>
            `
            : ""
        }

      </div>

      <div class="slider-section">

        <div class="slider-wrapper">

          <input
            id="year-slider"
            class="slider"
            type="range"
            min="${question.minYear}"
            max="${question.maxYear}"
            step="1"
            value="${startingYear}"
          />

          <div class="slider-labels">
            <span>${question.minYear}</span>
            <span>${question.maxYear}</span>
          </div>

        </div>

        <div
          id="guess-year"
          class="guess-year"
        >
          ${startingYear}
        </div>

      </div>

      <button
        id="guess-button"
        class="primary-button"
      >
        GUESS ${startingYear}
      </button>

    </div>
  `;

  const slider = document.querySelector("#year-slider");

  const yearDisplay = document.querySelector("#guess-year");

  const guessButton = document.querySelector("#guess-button");

  slider.addEventListener("input", () => {
    currentGuess = Number(slider.value);

    yearDisplay.textContent = currentGuess;

    guessButton.textContent = `GUESS ${currentGuess}`;
  });

  guessButton.addEventListener("click", submitGuess);
}

// ---------------------------------------------------------
// SUBMIT GUESS
// ---------------------------------------------------------

async function submitGuess() {
  if (submitting) return;

  submitting = true;

  const question = game.questions[currentQuestion];

  const button = document.querySelector("#guess-button");

  if (button) {
    button.disabled = true;
    button.textContent = "CHECKING...";
  }

  try {
    const result = await api("/api/guess", {
      method: "POST",

      body: JSON.stringify({
        messageId: question.messageId,

        guessYear: currentGuess,
      }),
    });

    scores.push({
      messageId: question.messageId,

      guessYear: result.guessYear,

      correctYear: result.correctYear,

      difference: result.difference,

      score: result.score,
    });

    renderAnswer(result);
  } catch (error) {
    console.error("[Deathdle] Guess failed:", error);

    submitting = false;

    if (button) {
      button.disabled = false;
      button.textContent = `GUESS ${currentGuess}`;
    }

    renderError(error.message);
  }
}

// ---------------------------------------------------------
// ANSWER SCREEN
// ---------------------------------------------------------

function renderAnswer(result) {
  app.innerHTML = `
    <div class="screen">

      <div class="answer-card">

        <div class="final-icon">
          ${result.difference === 0 ? "🎯" : "☠️"}
        </div>

        <div class="answer-year">
          ${result.correctYear}
        </div>

        <div class="answer-difference">
          ${
            result.difference === 0
              ? "Exactly right!"
              : `${result.difference} year${
                  result.difference === 1 ? "" : "s"
                } off`
          }
        </div>

        <div class="answer-score">
          +${result.score.toLocaleString("en-GB")}
        </div>

      </div>

      <div style="height: 16px;"></div>

      <button
        id="next-button"
        class="primary-button"
      >
        ${
          currentQuestion === game.questions.length - 1
            ? "SEE RESULTS"
            : "NEXT ☠️"
        }
      </button>

    </div>
  `;

  document
    .querySelector("#next-button")
    .addEventListener("click", nextQuestion);
}

// ---------------------------------------------------------
// NEXT
// ---------------------------------------------------------

async function nextQuestion() {
  currentQuestion++;

  submitting = false;

  if (currentQuestion >= game.questions.length) {
    await finishGame();
    return;
  }

  renderQuestion();
}

// ---------------------------------------------------------
// FINISH
// ---------------------------------------------------------

async function finishGame() {
  renderLoading("Calculating your final score...");

  try {
    const result = await api("/api/complete", {
      method: "POST",

      body: JSON.stringify({
        scores,
      }),
    });

    renderFinal(result.result);
  } catch (error) {
    console.error("[Deathdle] Completion failed:", error);

    renderError(error.message);
  }
}

// ---------------------------------------------------------
// FINAL SCREEN
// ---------------------------------------------------------

function renderFinal(result) {
  app.innerHTML = `
    <div class="final-screen">

      <div class="final-icon">
        ☠️
      </div>

      <div class="final-title">
        DEATHDLE #${result.gameNumber}
      </div>

      <div class="final-score">
        ${result.total.toLocaleString("en-GB")}
        /
        ${result.maxTotal.toLocaleString("en-GB")}
      </div>

      <div class="final-subtitle">
        ${
          IS_DISCORD_ACTIVITY
            ? "Your result has been posted publicly."
            : "Local development mode — result was not posted to Discord."
        }
      </div>

      <div class="result-list">

        ${result.lines
          .map(
            (line) => `
              <div class="result-row">
                ${renderResultEmoji(line)}
              </div>
            `,
          )
          .join("")}

      </div>

    </div>
  `;
}

// ---------------------------------------------------------
// EMOJI RENDERING
// ---------------------------------------------------------

function renderResultEmoji(result) {
  return escapeHtml(result);
}

// ---------------------------------------------------------
// LOADING
// ---------------------------------------------------------

function renderLoading(text) {
  app.innerHTML = `
    <div class="screen">

      <div class="loading-icon">
        ☠️
      </div>

      <h1>
        DEATHDLE
      </h1>

      <p>
        ${escapeHtml(text)}
      </p>

    </div>
  `;
}

// ---------------------------------------------------------
// ERROR
// ---------------------------------------------------------

function renderError(message) {
  app.innerHTML = `
    <div class="screen">

      <div class="loading-icon">
        💀
      </div>

      <h1>
        DEATHDLE
      </h1>

      <p class="error">
        ${escapeHtml(message)}
      </p>

      <p class="small">
        Check the bot console for more information.
      </p>

    </div>
  `;
}

// ---------------------------------------------------------
// MESSAGE FORMATTING
// ---------------------------------------------------------

function formatMessage(text) {
  if (!text) {
    return "";
  }

  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

// ---------------------------------------------------------
// ESCAPING
// ---------------------------------------------------------

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
