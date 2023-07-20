// ==UserScript==
// @name         Twitter Video Downloader
// @namespace    https://example.com
// @version      1.0
// @description  Adds a download button to Twitter videos for easy downloading.
// @author       Your Name
// @match        https://twitter.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Mutation observer to detect dynamically loaded media
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Check if the mutation added any new video elements
            if (mutation.type === 'childList') {
                var mediaElements = mutation.target.querySelectorAll('video[src$=".mp4"]');
                addDownloadButtons(mediaElements);
            }
        });
    });

    // Attach the observer to the body element
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial check for existing video elements
    var initialMediaElements = document.querySelectorAll('video[src$=".mp4"]');
    addDownloadButtons(initialMediaElements);

    // Function to add download buttons to the media elements
    function addDownloadButtons(mediaElements) {
        mediaElements.forEach(function(mediaElement) {
            // Check if a download button is already present
            if (mediaElement.parentNode.querySelector('.dl-button')) {
                return; // Skip if download button already exists
            }

            var downloadButton = document.createElement('a');
            downloadButton.className = 'button dl-button';
            downloadButton.innerHTML = 'DL';
            downloadButton.style.position = 'absolute';
            downloadButton.style.bottom = '10px';
            downloadButton.style.right = '10px';
            downloadButton.style.zIndex = '9999';
            downloadButton.style.cursor = 'pointer';
            downloadButton.addEventListener('click', function(event) {
                event.preventDefault();
                var videoUrl = mediaElement.src;
                var fileName = videoUrl.substring(videoUrl.lastIndexOf('/') + 1);
                downloadFile(videoUrl, fileName);
            });

            mediaElement.parentNode.appendChild(downloadButton);
        });
    }

    // Function to download the file
    function downloadFile(url, fileName) {
        fetch(url, {
            headers: new Headers({
                Origin: window.location.origin
            }),
            mode: 'cors'
        })
            .then(response => response.blob())
            .then(blob => {
                const blobURL = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobURL;
                a.download = fileName;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(blobURL);
            });
    }
})();
