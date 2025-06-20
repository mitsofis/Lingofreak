// Track the current utterance globally
let currentUtterance = null;

// Tab Navigation
function openTab(evt, tabName) {
    // Stop any playing audio when changing tabs
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }

    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// Speech Synthesis
function speak(text, lang) {
    if (!('speechSynthesis' in window)) {
        showAudioFeedback('Your browser does not support audio playback.', 'alert-danger');
        return;
    }

    // Stop previous audio
    speechSynthesis.cancel();

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = lang;

    currentUtterance.onerror = () => showAudioFeedback('Error playing audio.', 'alert-danger');
    currentUtterance.onend = () => showAudioFeedback('Audio playback completed.', 'alert-success');

    speechSynthesis.speak(currentUtterance);
    showAudioFeedback('Playing audio...', 'alert-info');
}

// Audio Feedback
function showAudioFeedback(message, alertType) {
    const feedback = document.getElementById('audio-feedback');
    feedback.textContent = message;
    feedback.className = `alert ${alertType}`;
    feedback.style.display = 'block';
    setTimeout(() => feedback.style.display = 'none', 3000);
}

// Exercise Feedback
function showExerciseFeedback(elementId, message, alertType) {
    const feedback = document.getElementById(elementId);
    feedback.innerHTML = message;
    feedback.className = `alert ${alertType}`;
}

// Drag-and-Drop Functionality
let draggedItem = null;

document.querySelectorAll('.draggable').forEach(item => {
    item.addEventListener('dragstart', () => {
        draggedItem = item;
        item.classList.add('dragging');
    });
    item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        draggedItem = null;
    });
});

document.querySelectorAll('.droppable').forEach(dropZone => {
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem) {
            const existingItem = dropZone.querySelector('.draggable');
            if (existingItem) {
                document.getElementById('greetings-list').appendChild(existingItem);
            }
            dropZone.appendChild(draggedItem);
        }
    });
});

document.querySelectorAll('.draggable-word').forEach(word => {
    word.addEventListener('dragstart', () => {
        draggedItem = word;
        word.classList.add('dragging');
    });
    word.addEventListener('dragend', () => {
        word.classList.remove('dragging');
        draggedItem = null;
    });
});

document.querySelectorAll('.droppable-sentence').forEach(dropZone => {
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem) {
            dropZone.appendChild(draggedItem);
        }
    });
});

// Exercise 1
function checkExercise1() {
    const answers = {
        'ex1-1': 'bin',
        'ex1-2': 'bist',
        'ex1-3': 'ist',
        'ex1-4': 'sind',
        'ex1-5': 'sind'
    };
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    Object.keys(answers).forEach((id, index) => {
        const userAnswer = document.getElementById(id).value.trim().toLowerCase();
        if (userAnswer === answers[id]) {
            correct++;
            feedback += `<li>${index + 1}. Correct!</li>`;
        } else {
            feedback += `<li>${index + 1}. Incorrect. Check the form of "sein" for this pronoun.</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise1-feedback', `You got ${correct}/5 correct! ${feedback}`, correct === 5 ? 'alert-success' : 'alert-warning');
}

// Exercise 2
function checkExercise2() {
    const correctAnswers = {
        'A': 'Hallo',
        'B': 'Hey',
        'C': 'Servus',
        'D': 'Grüß di'
    };
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    document.querySelectorAll('.droppable').forEach(zone => {
        const dialect = zone.dataset.id;
        const greeting = zone.querySelector('.draggable');
        if (greeting && greeting.textContent.trim() === correctAnswers[dialect]) {
            correct++;
            feedback += `<li>${zone.textContent}: Correct!</li>`;
        } else {
            feedback += `<li>${zone.textContent}: Incorrect. Check the greeting for this dialect.</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise2-feedback', `You got ${correct}/4 correct! ${feedback}`, correct === 4 ? 'alert-success' : 'alert-warning');
}

// Exercise 3
function checkExercise3() {
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    document.querySelectorAll('.sentence-drag-list').forEach((list, index) => {
        const sentenceId = index + 1;
        const correctSentence = list.dataset.correct.trim().toLowerCase();
        const dropZone = document.querySelector(`.droppable-sentence[data-sentence="${sentenceId}"]`);
        const userWords = Array.from(dropZone.children).map(item => item.textContent.trim());
        const userSentence = userWords.join(' ').toLowerCase().replace(/[.,!?]/g, '');
        const normalizedCorrect = correctSentence.toLowerCase().replace(/[.,!?]/g, '');
        if (userSentence === normalizedCorrect) {
            correct++;
            feedback += `<li>Sentence ${sentenceId}: Correct!</li>`;
        } else {
            feedback += `<li>Sentence ${sentenceId}: Incorrect. Check the word order.</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise3-feedback', `You got ${correct}/3 correct! ${feedback}`, correct === 3 ? 'alert-success' : 'alert-warning');
}
