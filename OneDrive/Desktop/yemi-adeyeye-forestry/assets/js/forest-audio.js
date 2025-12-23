// Forest Ambient Audio Player
document.addEventListener('DOMContentLoaded', function() {
    initForestAudio();
});

function initForestAudio() {
    // Create audio element (lazy loaded - not loaded until user clicks)
    let audio = null;
    let audioLoaded = false;

    function createAudioElement() {
        if (!audio) {
            audio = document.createElement('audio');
            audio.id = 'forestAudio';
            audio.loop = true;
            audio.volume = 0.3; // Start at 30% volume for subtle ambience
            audio.preload = 'none'; // Don't preload audio

            // Add audio source - only MP3 to reduce size
            const audioSources = [
                {
                    src: 'assets/audio/forest-ambience.mp3',
                    type: 'audio/mpeg'
                }
            ];

            audioSources.forEach(source => {
                const sourceElement = document.createElement('source');
                sourceElement.src = source.src;
                sourceElement.type = source.type;
                audio.appendChild(sourceElement);
            });

            document.body.appendChild(audio);
            audioLoaded = true;
        }
        return audio;
    }

    // Create audio control button
    const audioControl = createAudioControl();
    document.body.appendChild(audioControl);

    // Handle audio control
    const toggleBtn = document.getElementById('audioToggle');
    const volumeSlider = document.getElementById('volumeSlider');
    let isPlaying = false; // Changed: Don't auto-play on page load

    toggleBtn.addEventListener('click', function() {
        if (!audioLoaded) {
            // Load audio only when user clicks for the first time
            audio = createAudioElement();

            // Load saved volume
            const savedVolume = localStorage.getItem('forestAudioVolume');
            if (savedVolume) {
                audio.volume = parseFloat(savedVolume);
            }
        }

        if (isPlaying) {
            audio.pause();
            toggleBtn.classList.remove('playing');
            toggleBtn.innerHTML = '<span class="audio-icon">🔇</span><span class="audio-text">Forest Sounds</span>';
            localStorage.setItem('forestAudioEnabled', 'false');
        } else {
            // Play audio with user interaction
            audio.play().then(() => {
                toggleBtn.classList.add('playing');
                toggleBtn.innerHTML = '<span class="audio-icon">🔊</span><span class="audio-text">Forest Sounds</span>';
                localStorage.setItem('forestAudioEnabled', 'true');
            }).catch(error => {
                console.log('Audio play failed:', error);
            });
        }
        isPlaying = !isPlaying;
    });

    // Volume control
    if (volumeSlider) {
        // Load saved volume for slider display
        const savedVolume = localStorage.getItem('forestAudioVolume');
        if (savedVolume) {
            volumeSlider.value = parseFloat(savedVolume) * 100;
        }

        volumeSlider.addEventListener('input', function() {
            if (audio) {
                audio.volume = this.value / 100;
                localStorage.setItem('forestAudioVolume', this.value / 100);
            }
        });
    }

    // Pause audio when page is not visible
    document.addEventListener('visibilitychange', function() {
        if (audio && document.hidden && isPlaying) {
            audio.pause();
        } else if (audio && !document.hidden && isPlaying) {
            audio.play();
        }
    });
}

function createAudioControl() {
    const control = document.createElement('div');
    control.className = 'forest-audio-control';
    control.innerHTML = `
        <button id="audioToggle" class="audio-toggle-btn" aria-label="Toggle forest sounds">
            <span class="audio-icon">🔇</span>
            <span class="audio-text">Forest Sounds</span>
        </button>
        <div class="volume-control">
            <span class="volume-icon">🔉</span>
            <input type="range" id="volumeSlider" min="0" max="100" value="30" class="volume-slider" aria-label="Volume control">
        </div>
    `;
    return control;
}

// Export for global access
window.ForestAudio = {
    init: initForestAudio
};
