# projects.json
Thumbnails URLS are generated using Google Drive direct download links, which are created using the following website:
https://sites.google.com/site/gdocs2direct/

This site takes your sharing URL, which is a URL that looks something like this:
https://drive.google.com/file/d/1LDRlyZaZTF-bxHjBDEiL2obMxYHtf3YT/view?usp=sharing
And it extracts the file ID, the part between /d/ and /view, and puts it into a new URL which looks like this:
https://drive.google.com/uc?export=download&id=1LDRlyZaZTF-bxHjBDEiL2obMxYHtf3YT
And that's it! The new URL format causes Google Drive to serve the file directly as a download, instead of opening a preview. You can do this conversion yourself manually if you want to, this site just makes it a little bit easier. The conversion happens entirely in your browser, your sharing URL is never sent or stored anywhere.