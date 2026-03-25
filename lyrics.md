Adding the "View Lyrics" functionality is the perfect next step. To keep that premium, modern feel, we won't just make the text instantly appear; we will use CSS to create a smooth, elegant slide-down animation.

Here is how we will build this feature step-by-step.

Step 1: Add the Lyrics Container to Your HTML (songs.html)
In our previous modernized HTML structure, we left out the actual lyrics text to keep the code short. We need to add a container for the lyrics inside each song card, right below the <div class="card-actions"> section.

Update your songs.html file by inserting the <div class="lyrics-content"> block for your songs. Here is an example for the first song:

HTML
<div class="card-actions">
                        <button class="text-btn lyrics-toggle">View Lyrics</button>
                        <a href="audio/upon-this-sacred-ground.mp3" download class="icon-btn download-btn" title="Download MP3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                        </a>
                    </div>
                </div> <div class="lyrics-content">
                    <p><strong>Verse 1</strong><br>
                    Beneath these stones the faithful lie,<br>
                    Who gave their lives beneath God's sky,<br>
                    No greater gift hath mortal known,<br>
                    Than seeds of freedom, blood-red, sown. [cite: 49-53]</p>
                    
                    <p><strong>Chorus</strong><br>
                    Upon this sacred ground we stand,<br>
                    Redeemed by sacrifice and hand,<br>
                    O God, receive the ones who gave,<br>
                    Their lives beyond this earthly grave. [cite: 54-58]</p>
                    </div>

            </div> </article>

(You will repeat this step for "The Fields They Gave" and all subsequent songs, pasting in their respective lyrics from your document .)

Step 2: Add the Slide-Down Animation to Your CSS (styles.css)
Next, open your styles.css file and scroll to the very bottom. We are going to hide the lyrics by default using max-height: 0, and then create a .show class that expands them smoothly.

Paste this at the bottom of your CSS file:

CSS
/* Lyrics Dropdown Styles */
.lyrics-content {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: all 0.5s ease-in-out;
    margin-top: 0;
    color: var(--text-secondary);
    font-size: 0.95rem;
    border-top: 1px solid transparent;
}

/* This class will be toggled on and off by our JavaScript */
.lyrics-content.show {
    max-height: 1500px; /* A large enough height to fit any song's lyrics */
    opacity: 1;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.lyrics-content p {
    margin-bottom: 1.5rem;
}

.lyrics-content strong {
    color: var(--text-primary);
    font-family: 'Cinzel', serif;
    letter-spacing: 1px;
}
Step 3: Wire It Up in JavaScript (script.js)
Finally, we need to tell the browser what to do when the "View Lyrics" button is clicked.

Open your script.js file. Scroll to the very bottom, just before the final }); that closes the document listener, and paste this new block of code:

JavaScript
        // --- ADD THIS TO THE BOTTOM OF YOUR EXISTING SCRIPT.JS ---
        
        // 5. Handle "View Lyrics" toggling
        const lyricsButtons = document.querySelectorAll('.lyrics-toggle');
        
        lyricsButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Find the closest song card to the button that was clicked
                const card = this.closest('.modern-song-card');
                
                // Find the lyrics container inside that specific card
                const lyricsContainer = card.querySelector('.lyrics-content');
                
                // Toggle the 'show' class to trigger the CSS animation
                lyricsContainer.classList.toggle('show');
                
                // Change the button text based on whether the lyrics are showing or hidden
                if (lyricsContainer.classList.contains('show')) {
                    this.textContent = 'Hide Lyrics';
                } else {
                    this.textContent = 'View Lyrics';
                }
            });
        });
How to test your work:
Save all three files (songs.html, styles.css, and script.js).

Refresh your webpage.

Click the "View Lyrics" button. The box should elegantly slide open, revealing the text, and the button should change to say "Hide Lyrics." Clicking it again will neatly tuck the lyrics back away.