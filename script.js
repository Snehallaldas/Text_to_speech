document.addEventListener('DOMContentLoaded', function() {
    if ('speechSynthesis' in window) {
        // Elements
        const textInput = document.getElementById('text-input');
        const voiceSelect = document.getElementById('voice-select');
        const pitchInput = document.getElementById('pitch');
        const rateInput = document.getElementById('rate');
        const volumeInput = document.getElementById('volume');
        const pitchValue = document.getElementById('pitch-value');
        const rateValue = document.getElementById('rate-value');
        const volumeValue = document.getElementById('volume-value');
        const charCount = document.getElementById('char-count');
        const statusMessage = document.getElementById('status-message');
        const progressBar = document.getElementById('progress-bar');
        
        // Buttons
        const speakButton = document.getElementById('speak-button');
        const pauseButton = document.getElementById('pause-button');
        const resumeButton = document.getElementById('resume-button');
        const stopButton = document.getElementById('stop-button');
        const downloadButton = document.getElementById('download-button');
        
        // Global variables
        let currentUtterance = null;
        let isSpeaking = false;
        
        // Load voices
        function loadVoices() {
            voiceSelect.innerHTML = '';
            const voices = window.speechSynthesis.getVoices();
            
            // Group voices by language
            const voicesByLang = {};
            voices.forEach(voice => {
                if (!voicesByLang[voice.lang]) {
                    voicesByLang[voice.lang] = [];
                }
                voicesByLang[voice.lang].push(voice);
            });
            
            // Sort languages alphabetically
            const sortedLangs = Object.keys(voicesByLang).sort();
            
            // Create optgroups for each language
            sortedLangs.forEach(lang => {
                const langGroup = document.createElement('optgroup');
                langGroup.label = new Intl.DisplayNames(['en'], { type: 'language' }).of(lang.split('-')[0]) || lang;
                
                // Add voices to this language group
                voicesByLang[lang].forEach((voice, index) => {
                    const option = document.createElement('option');
                    option.value = voices.indexOf(voice);
                    option.innerHTML = voice.name;
                    option.selected = voice.default;
                    langGroup.appendChild(option);
                });
                
                voiceSelect.appendChild(langGroup);
            });
            
            // Set English voice as default if available
            const englishVoices = voices.filter(voice => voice.lang.includes('en-'));
            if (englishVoices.length > 0) {
                const defaultVoice = englishVoices.find(voice => voice.default) || englishVoices[0];
                voiceSelect.value = voices.indexOf(defaultVoice);
            }
        }
        
        // Initialize voices
        loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
        
        // Update character count
        textInput.addEventListener('input', function() {
            charCount.textContent = this.value.length;
            
            // Visual indicator for download limit
            if (this.value.length > 200) {
                charCount.style.color = '#dc3545';
            } else {
                charCount.style.color = '';
            }
        });
        
        // Update slider values
        pitchInput.addEventListener('input', function() {
            pitchValue.textContent = parseFloat(this.value).toFixed(1);
        });
        
        rateInput.addEventListener('input', function() {
            rateValue.textContent = parseFloat(this.value).toFixed(1);
        });
        
        volumeInput.addEventListener('input', function() {
            volumeValue.textContent = parseFloat(this.value).toFixed(1);
        });
        
        // Speak text
        speakButton.addEventListener('click', function() {
            const text = textInput.value.trim();
            
            if (text === '') {
                showStatus('Please enter some text to speak', 'error');
                return;
            }
            
            // Cancel previous utterance if any
            if (isSpeaking) {
                window.speechSynthesis.cancel();
            }
            
            currentUtterance = new SpeechSynthesisUtterance(text);
            
            // Set voice
            const voices = window.speechSynthesis.getVoices();
            const selectedVoiceIndex = parseInt(voiceSelect.value);
            if (!isNaN(selectedVoiceIndex)) {
                currentUtterance.voice = voices[selectedVoiceIndex];
            }
            
            // Set parameters
            currentUtterance.pitch = parseFloat(pitchInput.value);
            currentUtterance.rate = parseFloat(rateInput.value);
            currentUtterance.volume = parseFloat(volumeInput.value);
            
            // Add events
            currentUtterance.onstart = function() {
                isSpeaking = true;
                showStatus('Speaking...', 'active');
                startProgressBar();
                updateButtonStates();
            };
            
            currentUtterance.onpause = function() {
                showStatus('Paused', 'paused');
                updateButtonStates();
            };
            
            currentUtterance.onresume = function() {
                showStatus('Speaking...', 'active');
                updateButtonStates();
            };
            
            currentUtterance.onend = function() {
                isSpeaking = false;
                showStatus('Finished speaking', 'success');
                resetProgressBar();
                updateButtonStates();
                setTimeout(() => {
                    statusMessage.textContent = '';
                }, 3000);
            };
            
            currentUtterance.onerror = function(event) {
                isSpeaking = false;
                showStatus('Error: ' + event.error, 'error');
                resetProgressBar();
                updateButtonStates();
            };
            
            // Start speaking
            window.speechSynthesis.speak(currentUtterance);
        });
        
        // Pause speech
        pauseButton.addEventListener('click', function() {
            if (isSpeaking) {
                window.speechSynthesis.pause();
                showStatus('Paused', 'paused');
            }
        });
        
        // Resume speech
        resumeButton.addEventListener('click', function() {
            if (speechSynthesis.paused) {
                window.speechSynthesis.resume();
                showStatus('Resumed speaking', 'active');
            }
        });
        
        // Stop speech
        stopButton.addEventListener('click', function() {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            showStatus('Stopped', 'stopped');
            resetProgressBar();
            updateButtonStates();
        });
        
        // Download audio
        downloadButton.addEventListener('click', function() {
            const text = textInput.value.trim();
            
            if (text === '') {
                showStatus('Please enter some text to download', 'error');
                return;
            }
            
            if (text.length > 200) {
                showStatus('Text too long (max 200 characters)', 'error');
                return;
            }
            
            try {
                showStatus('Preparing download...', 'active');
                const encodedText = encodeURIComponent(text);
                const url = `https://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=${text.length}&client=tw-ob&q=${encodedText}&tl=en-US`;
                
                const a = document.createElement('a');
                a.href = url;
                a.download = 'speech.mp3';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                showStatus('Download started', 'success');
                setTimeout(() => {
                    statusMessage.textContent = '';
                }, 3000);
            } catch (error) {
                showStatus('Download error: ' + error.message, 'error');
            }
        });
        
        // Helper Functions
        function showStatus(message, type) {
            statusMessage.textContent = message;
            
            // Reset classes
            statusMessage.className = '';
            
            // Add class based on type
            if (type) {
                statusMessage.classList.add('status-' + type);
            }
        }
        
        function updateButtonStates() {
            speakButton.disabled = isSpeaking;
            pauseButton.disabled = !isSpeaking || speechSynthesis.paused;
            resumeButton.disabled = !speechSynthesis.paused;
            stopButton.disabled = !isSpeaking;
        }
        
        let progressInterval;
        
        function startProgressBar() {
            let startTime = Date.now();
            let duration = (textInput.value.length / (currentUtterance.rate * 5)) * 1000; // Rough estimate
            duration = Math.max(duration, 3000); // Minimum duration
            
            clearInterval(progressInterval);
            
            progressInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration * 100, 100);
                progressBar.style.width = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                }
            }, 100);
        }
        
        function resetProgressBar() {
            clearInterval(progressInterval);
            progressBar.style.width = '0%';
        }
        
        // Initial button states
        updateButtonStates();
        
    } else {
        // Browser doesn't support speech synthesis
        document.querySelector('.container').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Speech Synthesis Not Supported</h2>
                <p>Your browser doesn't support the Web Speech API. Please try using a different browser such as Chrome, Edge, or Safari.</p>
            </div>
        `;
    }
});