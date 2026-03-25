/* ==========================================================================
   CAMP NELSON HYMNAL - Interactive JavaScript
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

    // =====================================================================
    // 1. PARTICLE BACKGROUND
    // =====================================================================
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.3;
                this.speedY = -(Math.random() * 0.15 + 0.03);
                this.speedX = (Math.random() - 0.5) * 0.08;
                this.opacity = Math.random() * 0.4 + 0.05;
                this.fadeDirection = Math.random() > 0.5 ? 0.002 : -0.002;
            }
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.opacity += this.fadeDirection;
                if (this.opacity > 0.5 || this.opacity < 0.02) this.fadeDirection *= -1;
                if (this.y < -10) {
                    this.y = canvas.height + 10;
                    this.x = Math.random() * canvas.width;
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(197, 163, 85, ${this.opacity})`;
                ctx.fill();
            }
        }

        const particleCount = Math.min(Math.floor(window.innerWidth * 0.06), 80);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationId = requestAnimationFrame(animateParticles);
        }
        animateParticles();

        // Pause particles when tab is hidden
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animateParticles();
            }
        });
    }

    // =====================================================================
    // 2. SCROLL-TRIGGERED ANIMATIONS
    // =====================================================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger the animations slightly
                    const delay = Math.min(index * 80, 400);
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        animatedElements.forEach(el => observer.observe(el));

        // Fallback: make elements visible after a short delay if observer hasn't fired
        // (handles cases where elements are already in viewport on load)
        setTimeout(() => {
            animatedElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && !el.classList.contains('visible')) {
                    el.classList.add('visible');
                }
            });
        }, 200);
    }

    // =====================================================================
    // 3. HEADER SCROLL EFFECT
    // =====================================================================
    const header = document.getElementById('site-header');
    if (header) {
        let lastScroll = 0;
        window.addEventListener('scroll', function () {
            const currentScroll = window.scrollY;
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // =====================================================================
    // 4. MOBILE MENU
    // =====================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function () {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('open');
        });
        // Close menu when a link is clicked
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('open');
            });
        });
    }

    // =====================================================================
    // 5. AUDIO PLAYER SYSTEM
    // =====================================================================
    const songCards = document.querySelectorAll('.modern-song-card');
    const nowPlayingBar = document.getElementById('now-playing-bar');
    const npTitle = document.getElementById('now-playing-title');
    const npPlayBtn = document.getElementById('np-play-btn');
    const npProgress = document.getElementById('np-progress');
    const npProgressWrap = document.getElementById('np-progress-wrap');
    const npTime = document.getElementById('np-time');

    let currentAudio = null;
    let currentCard = null;
    let currentBtn = null;

    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    function setPlaying(audio, card, btn) {
        // Stop previous
        if (currentAudio && currentAudio !== audio) {
            currentAudio.pause();
            if (currentBtn) currentBtn.classList.remove('is-playing');
            if (currentCard) currentCard.classList.remove('playing');
        }

        currentAudio = audio;
        currentCard = card;
        currentBtn = btn;

        audio.play();
        btn.classList.add('is-playing');
        card.classList.add('playing');

        // Show now playing bar
        if (nowPlayingBar) {
            nowPlayingBar.classList.add('active');
            const title = audio.getAttribute('data-song-title') || 'Unknown';
            if (npTitle) npTitle.textContent = title;
            if (npPlayBtn) {
                npPlayBtn.querySelector('.play-svg').style.display = 'none';
                npPlayBtn.querySelector('.pause-svg').style.display = 'block';
            }
        }
    }

    function setPaused() {
        if (currentAudio) currentAudio.pause();
        if (currentBtn) currentBtn.classList.remove('is-playing');
        if (currentCard) currentCard.classList.remove('playing');
        if (npPlayBtn) {
            npPlayBtn.querySelector('.play-svg').style.display = 'block';
            npPlayBtn.querySelector('.pause-svg').style.display = 'none';
        }
    }

    function resetPlayer() {
        setPaused();
        if (nowPlayingBar) nowPlayingBar.classList.remove('active');
        currentAudio = null;
        currentCard = null;
        currentBtn = null;
    }

    // Set up each song card
    songCards.forEach(card => {
        const audio = card.querySelector('audio');
        const playBtn = card.querySelector('.play-btn');
        const progressBar = card.querySelector('.progress-bar');
        const progressContainer = card.querySelector('.progress-container');
        const timeDisplay = card.querySelector('.time-display');

        if (!audio || !playBtn) return;

        playBtn.addEventListener('click', function () {
            if (currentAudio === audio && !audio.paused) {
                setPaused();
            } else {
                setPlaying(audio, card, playBtn);
            }
        });

        audio.addEventListener('timeupdate', function () {
            const percent = (audio.currentTime / audio.duration) * 100;
            if (progressBar) progressBar.style.width = `${percent}%`;
            if (timeDisplay) timeDisplay.textContent = formatTime(audio.currentTime);
            // Update now-playing bar
            if (currentAudio === audio) {
                if (npProgress) npProgress.style.width = `${percent}%`;
                if (npTime) npTime.textContent = formatTime(audio.currentTime);
            }
        });

        if (progressContainer) {
            progressContainer.addEventListener('click', function (e) {
                const rect = progressContainer.getBoundingClientRect();
                const clickPercent = (e.clientX - rect.left) / rect.width;
                if (audio.duration) {
                    audio.currentTime = clickPercent * audio.duration;
                }
            });
        }

        audio.addEventListener('ended', function () {
            if (progressBar) progressBar.style.width = '0%';
            if (timeDisplay) timeDisplay.textContent = '0:00';
            resetPlayer();
        });
    });

    // Set up individual song page players (.song-player-section)
    const songPlayerSections = document.querySelectorAll('.song-player-section');
    songPlayerSections.forEach(section => {
        const audio = section.querySelector('audio');
        const playBtn = section.querySelector('.play-btn');
        const progressBar = section.querySelector('.progress-bar');
        const progressContainer = section.querySelector('.progress-container');
        const timeDisplay = section.querySelector('.time-display');

        if (!audio || !playBtn) return;

        playBtn.addEventListener('click', function () {
            if (currentAudio === audio && !audio.paused) {
                setPaused();
            } else {
                setPlaying(audio, section, playBtn);
            }
        });

        audio.addEventListener('timeupdate', function () {
            const percent = (audio.currentTime / audio.duration) * 100;
            if (progressBar) progressBar.style.width = `${percent}%`;
            if (timeDisplay) timeDisplay.textContent = formatTime(audio.currentTime);
        });

        if (progressContainer) {
            progressContainer.addEventListener('click', function (e) {
                const rect = progressContainer.getBoundingClientRect();
                const clickPercent = (e.clientX - rect.left) / rect.width;
                if (audio.duration) {
                    audio.currentTime = clickPercent * audio.duration;
                }
            });
        }

        audio.addEventListener('ended', function () {
            if (progressBar) progressBar.style.width = '0%';
            if (timeDisplay) timeDisplay.textContent = '0:00';
            resetPlayer();
        });
    });

    // Now-playing bar controls
    if (npPlayBtn) {
        npPlayBtn.addEventListener('click', function () {
            if (!currentAudio) return;
            if (currentAudio.paused) {
                currentAudio.play();
                if (currentBtn) currentBtn.classList.add('is-playing');
                if (currentCard) currentCard.classList.add('playing');
                npPlayBtn.querySelector('.play-svg').style.display = 'none';
                npPlayBtn.querySelector('.pause-svg').style.display = 'block';
            } else {
                setPaused();
            }
        });
    }

    if (npProgressWrap) {
        npProgressWrap.addEventListener('click', function (e) {
            if (!currentAudio || !currentAudio.duration) return;
            const rect = npProgressWrap.getBoundingClientRect();
            const clickPercent = (e.clientX - rect.left) / rect.width;
            currentAudio.currentTime = clickPercent * currentAudio.duration;
        });
    }

    // =====================================================================
    // 6. LYRICS TOGGLE
    // =====================================================================
    const lyricsButtons = document.querySelectorAll('.lyrics-toggle');
    lyricsButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.modern-song-card');
            const lyricsContainer = card.querySelector('.lyrics-content');

            lyricsContainer.classList.toggle('show');
            const isOpen = lyricsContainer.classList.contains('show');

            this.textContent = isOpen ? 'Hide Lyrics' : 'View Lyrics';
            this.setAttribute('aria-expanded', isOpen);
            lyricsContainer.setAttribute('aria-hidden', !isOpen);
        });
    });

    // =====================================================================
    // 7. TRIBUTE PAGE - FLOATING STARS EFFECT
    // =====================================================================
    const tributeStars = document.getElementById('tribute-stars');
    if (tributeStars) {
        for (let i = 0; i < 30; i++) {
            const star = document.createElement('div');
            star.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: rgba(197, 163, 85, ${Math.random() * 0.3 + 0.05});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: tributeStarFloat ${Math.random() * 6 + 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 4}s;
            `;
            tributeStars.appendChild(star);
        }

        // Add the keyframes dynamically
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes tributeStarFloat {
                0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
                50% { transform: translateY(-20px) scale(1.5); opacity: 0.6; }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    // =====================================================================
    // 8. CONTENT TABS (Lyrics / Prayer)
    // =====================================================================
    const contentTabs = document.querySelectorAll('.content-tab');
    if (contentTabs.length > 0) {
        contentTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                const tabId = this.getAttribute('data-tab');
                // Deactivate all tabs and content
                contentTabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                // Activate clicked tab and its content
                this.classList.add('active');
                const target = document.getElementById('tab-' + tabId);
                if (target) target.classList.add('active');
            });
        });
    }

    // =====================================================================
    // 9. SMOOTH SCROLL TO SONG FROM HOME PAGE
    // =====================================================================
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                // Highlight the card briefly
                target.style.transition = 'box-shadow 0.5s ease';
                target.style.boxShadow = '0 0 40px rgba(197, 163, 85, 0.2)';
                setTimeout(() => {
                    target.style.boxShadow = '';
                }, 2000);
            }, 300);
        }
    }

});
