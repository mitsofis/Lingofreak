// Tab Navigation
function openTab(evt, tabName) {
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
    console.log(`Opened tab: ${tabName}`);
}

document.querySelectorAll('.tab-link').forEach(button => {
    button.addEventListener('click', (evt) => openTab(evt, button.dataset.tab));
});

// Initialize first tab
document.getElementById('dialogues').classList.add('active');

// Speech Synthesis
function speak(text, lang) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.onerror = () => showAudioFeedback('Error playing audio.', 'alert-danger');
        utterance.onend = () => showAudioFeedback('Audio playback completed.', 'alert-success');
        window.speechSynthesis.speak(utterance);
        showAudioFeedback('Playing audio...', 'alert-info');
    } else {
        showAudioFeedback('Your browser does not support audio playback.', 'alert-danger');
    }
}

// Audio Feedback
function showAudioFeedback(message, alertType) {
    const feedback = document.getElementById('audio-feedback');
    if (feedback) {
        feedback.textContent = message;
        feedback.className = `alert ${alertType}`;
        feedback.style.display = 'block';
        setTimeout(() => feedback.style.display = 'none', 3000);
    } else {
        console.error('Audio feedback element not found.');
    }
}

document.querySelectorAll('.audio-btn').forEach(button => {
    button.addEventListener('click', () => speak(button.dataset.text, button.dataset.lang));
});

// Exercise Feedback
function showExerciseFeedback(elementId, message, alertType) {
    const feedback = document.getElementById(elementId);
    if (feedback) {
        feedback.innerHTML = message;
        feedback.className = `exercise-feedback ${alertType}`;
        feedback.style.display = 'block';
    } else {
        console.error(`Feedback element with ID ${elementId} not found.`);
    }
}

// Exercise 1: Fill in the Blank (Standard German)
function checkExercise1() {
    const answers = {
        'ex1-1': 'zwei',
        'ex1-2': 'drei',
        'ex1-3': 'ein',
        'ex1-4': 'vier',
        'ex1-5': 'fünf'
    };
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    Object.keys(answers).forEach((id, index) => {
        const input = document.getElementById(id);
        if (!input) {
            console.error(`Input with ID ${id} not found.`);
            return;
        }
        const userAnswer = input.value.trim().toLowerCase();
        if (userAnswer === answers[id]) {
            correct++;
            feedback += `<li>${index + 1}. Correct!</li>`;
        } else {
            feedback += `<li>${index + 1}. Incorrect. Correct answer: "${answers[id]}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise1-feedback', `You got ${correct}/5 correct! ${feedback}`, correct === 5 ? 'alert-success' : 'alert-warning');
}

document.querySelectorAll('.check-btn[data-exercise="1"]').forEach(button => {
    button.addEventListener('click', checkExercise1);
});

// Exercise 2: Matching Phrases to Dialects
function checkExercise2() {
    const answers = {
        '1': 'A', // Wie viel kostet das? -> Standard German
        '2': 'B', // Was kostet’n das? -> Colloquial German
        '3': 'C', // Was kost’ des? -> Bavarian
        '4': 'D'  // Was koscht des? -> Swabian
    };
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    document.querySelectorAll('.matching-option').forEach(option => {
        if (option.classList.contains('selected')) {
            const question = option.dataset.question;
            const selectedDialect = option.dataset.option;
            const dialectText = option.textContent.trim();
            if (selectedDialect === answers[question]) {
                correct++;
                feedback += `<li>${question}. Correct! "${dialectText}"</li>`;
            } else {
                const correctOption = document.querySelector(`.matching-option[data-exercise="2"][data-question="${question}"][data-option="${answers[question]}"]`).textContent.trim();
                feedback += `<li>${question}. Incorrect. Correct answer: "${correctOption}".</li>`;
            }
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise2-feedback', `You got ${correct}/4 correct! ${feedback}`, correct === 4 ? 'alert-success' : 'alert-warning');
}

document.querySelectorAll('.matching-option').forEach(option => {
    option.addEventListener('click', () => {
        const question = option.dataset.question;
        document.querySelectorAll(`.matching-option[data-question="${question}"]`).forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        console.log(`Selected (Ex2): ${option.textContent} for question ${question}`);
    });
});

document.querySelectorAll('.check-btn[data-exercise="2"]').forEach(button => {
    button.addEventListener('click', checkExercise2);
});

// Exercise 3: Sentence Ordering (Colloquial German)
const answers3 = {
    '1': 'Was kostet’n Tomaten ?',
    '2': 'Gib mir ’n Kilo Karotten !',
    '3': 'Das ist ziemlich teuer , oder ?'
};

let draggedItem = null;

function makeWordDraggable(word) {
    word.setAttribute('draggable', 'true');
    word.addEventListener('dragstart', (e) => {
        draggedItem = word;
        word.classList.add('dragging');
        e.dataTransfer.setData('text/plain', word.textContent);
        console.log('Dragging (Ex3):', word.textContent);
    });
    word.addEventListener('dragend', () => {
        word.classList.remove('dragging');
        draggedItem = null;
        console.log('Drag ended (Ex3)');
    });
}

document.querySelectorAll('.sentence-part').forEach(makeWordDraggable);

document.querySelectorAll('.sentence-drop').forEach(dropZone => {
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem && draggedItem.dataset.exercise === '3' && draggedItem.dataset.question === dropZone.id.split('-')[2]) {
            const wordSpan = document.createElement('span');
            wordSpan.textContent = e.dataTransfer.getData('text/plain');
            wordSpan.classList.add('sentence-part');
            wordSpan.dataset.exercise = draggedItem.dataset.exercise;
            wordSpan.dataset.question = draggedItem.dataset.question;
            makeWordDraggable(wordSpan);
            dropZone.appendChild(wordSpan);
            dropZone.appendChild(document.createTextNode(' '));
            console.log('Dropped (Ex3):', wordSpan.textContent, 'into sentence', dropZone.id);
        }
    });
});

function checkExercise3() {
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    document.querySelectorAll('.sentence-drop').forEach(dropZone => {
        const sentenceId = dropZone.id.split('-')[2];
        const userSentence = Array.from(dropZone.children)
            .map(part => part.textContent.trim())
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
        console.log(`Sentence ${sentenceId} - User: "${userSentence}", Expected: "${answers3[sentenceId]}"`);
        if (userSentence === answers3[sentenceId]) {
            correct++;
            feedback += `<li>Sentence ${sentenceId}: Correct!</li>`;
        } else {
            feedback += `<li>Sentence ${sentenceId}: Incorrect. Correct sentence: "${answers3[sentenceId]}". Your answer: "${userSentence}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise3-feedback', `You got ${correct}/3 correct! ${feedback}`, correct === 3 ? 'alert-success' : 'alert-warning');
}

document.querySelectorAll('.check-btn[data-exercise="3"]').forEach(button => {
    button.addEventListener('click', checkExercise3);
});

// Exercise 4: Multiple Choice Vocabulary
function checkExercise4() {
    const answers = {
        'ex4-1': 'A', // Was
        'ex4-2': 'A', // Was
        'ex4-3': 'A', // Jo
        'ex4-4': 'B'  // Jo
    };
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    Object.keys(answers).forEach((name, index) => {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        const answerSpan = document.getElementById(`${name}-answer`);
        if (!selected) {
            console.warn(`No selection for question ${name}`);
            feedback += `<li>${index + 1}. Incorrect. No answer selected.</li>`;
            if (answerSpan) answerSpan.textContent = '____';
        } else {
            const correctLabel = document.querySelector(`input[name="${name}"][value="${answers[name]}"]`).parentElement.textContent.trim().split('. ')[1];
            if (selected.value === answers[name]) {
                correct++;
                feedback += `<li>${index + 1}. Correct!</li>`;
                if (answerSpan) answerSpan.textContent = correctLabel;
            } else {
                feedback += `<li>${index + 1}. Incorrect. Correct answer: "${correctLabel}".</li>`;
                if (answerSpan) answerSpan.textContent = '____';
            }
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise4-feedback', `You got ${correct}/4 correct! ${feedback}`, correct === 4 ? 'alert-success' : 'alert-warning');
}

document.querySelectorAll('.check-btn[data-exercise="4"]').forEach(button => {
    button.addEventListener('click', checkExercise4);
});
