let currentUtterance = null;
let isSpeaking = false;
let lastSpokenText = '';
let lastLang = '';

// Tab Navigation
function openTab(evt, tabName) {
    stopSpeaking();  // Stop audio when switching tabs

    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// Stop current speech
function stopSpeaking() {
    if ('speechSynthesis' in window && (speechSynthesis.speaking || speechSynthesis.pending)) {
        speechSynthesis.cancel();
        isSpeaking = false;
        lastSpokenText = '';
    }
}

// Speech Synthesis
function speak(text, lang) {
    if (!('speechSynthesis' in window)) {
        showAudioFeedback('Your browser does not support audio playback.', 'alert-danger');
        return;
    }

    // If same text and language is already speaking, stop instead of restarting
    if (isSpeaking && text === lastSpokenText && lang === lastLang) {
        stopSpeaking();
        showAudioFeedback('Audio stopped.', 'alert-warning');
        return;
    }

    stopSpeaking(); // Stop previous before starting new one

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = lang;
    lastSpokenText = text;
    lastLang = lang;

    currentUtterance.onerror = () => {
        showAudioFeedback('Error playing audio.', 'alert-danger');
        isSpeaking = false;
    };

    currentUtterance.onend = () => {
        showAudioFeedback('Audio playback completed.', 'alert-success');
        isSpeaking = false;
    };

    speechSynthesis.speak(currentUtterance);
    isSpeaking = true;
    showAudioFeedback('Playing audio...', 'alert-info');
}

// Audio Feedback
function showAudioFeedback(message, alertType) {
    const feedback = document.getElementById('audio-feedback');
    feedback.textContent = message;
    feedback.className = `alert ${alertType}`;
    feedback.style.display = 'block';
    setTimeout(() => {
        if (feedback) feedback.style.display = 'none';
    }, 3000);
}
