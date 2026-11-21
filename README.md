# projects.json
Thumbnails URLS are generated using Google Drive direct download links, which are created using the following website:
https://sites.google.com/site/gdocs2direct/

This site takes your sharing URL, which is a URL that looks something like this:
https://drive.google.com/file/d/1LDRlyZaZTF-bxHjBDEiL2obMxYHtf3YT/view?usp=sharing
And it extracts the file ID, the part between /d/ and /view, and puts it into a new URL which looks like this:
https://drive.google.com/uc?export=download&id=1LDRlyZaZTF-bxHjBDEiL2obMxYHtf3YT
And that's it! The new URL format causes Google Drive to serve the file directly as a download, instead of opening a preview. You can do this conversion yourself manually if you want to, this site just makes it a little bit easier. The conversion happens entirely in your browser, your sharing URL is never sent or stored anywhere.





Google blocked the old [drive.google.com/uc?export=download](https://drive.google.com/uc?export=download) (and export=view) format for embedding images on external websites due to security and CORS restrictions. Additionally, your <img> tag is missing a closing bracket (>).

To make it display properly, switch to the /thumbnail endpoint or the lh3.googleusercontent.com direct link format, and ensure the file is publicly shared.   
Data Addict - Jady Nekena
1. Make the file public in Google Drive

    Right-click the image file in Google Drive and select Share > Share.

    Under General access, change "Restricted" to Anyone with the link (Viewer).

    Click Done.

        Verification: Opening the file's share link in an Incognito/Private browser window displays the image without asking you to sign in.

2. Replace your HTML <img> tag

Use either of the following updated formats with your file ID (1wdxRxAruFFHWv3JZPi40702IOtYZCxHg):

Option A: Thumbnail endpoint (Recommended)
HTML

<img src="https://drive.google.com/thumbnail?id=1wdxRxAruFFHWv3JZPi40702IOtYZCxHg&sz=w100" alt="LinkedIn" width="24">

(The &sz=w100 parameter sets the maximum width fetched from Google so the icon stays sharp; for larger photos, use &sz=w1000 or &sz=s4000.)