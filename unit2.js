// START TAB NAVIGATION //
function openTab(evt, tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
    console.log(`Opened tab: ${tabName}`);
}
// END TAB NAVIGATION //

// START SPEECH SYNTHESIS //
function speak(text, lang) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.onerror = () => showAudioFeedback('Error playing audio.', 'alert-danger');
        utterance.onend = () => showAudioFeedback('Audio playback completed.', 'alert-success');
        speechSynthesis.speak(utterance);
        showAudioFeedback('Playing audio...', 'alert-info');
    } else {
        showAudioFeedback('Your browser does not support audio playback.', 'alert-danger');
    }
}
// END SPEECH SYNTHESIS //

// START AUDIO FEEDBACK //
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
// END AUDIO FEEDBACK //

// START EXERCISE FEEDBACK //
function showExerciseFeedback(elementId, message, alertType) {
    const feedback = document.getElementById(elementId);
    if (feedback) {
        feedback.innerHTML = message;
        feedback.className = `alert ${alertType}`;
        feedback.style.display = 'block';
    } else {
        console.error(`Feedback element with ID ${elementId} not found.`);
    }
}
// END EXERCISE FEEDBACK //

// START DRAG-AND-DROP EXERCISE 2 //
let draggedItem = null;

document.querySelectorAll('.draggable').forEach(item => {
    item.addEventListener('dragstart', () => {
        draggedItem = item;
        item.classList.add('dragging');
        console.log('Dragging (Ex2):', item.textContent);
    });
    item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        draggedItem = null;
        console.log('Drag ended (Ex2)');
    });
});

document.querySelectorAll('.droppable').forEach(dropZone => {
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem) {
            const existingItem = dropZone.querySelector('.draggable');
            if (existingItem) {
                const greetingsList = document.getElementById('greetings-list');
                if (greetingsList) {
                    greetingsList.appendChild(existingItem);
                } else {
                    console.error('Greetings list not found.');
                }
            }
            dropZone.appendChild(draggedItem);
            console.log('Dropped (Ex2):', draggedItem.textContent, 'into', dropZone);
        }
    });
});
// END DRAG-AND-DROP EXERCISE 2 //

// START DRAG-AND-DROP EXERCISE 3 //
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

document.querySelectorAll('.draggable-word').forEach(makeWordDraggable);

document.querySelectorAll('.droppable-sentence').forEach(dropZone => {
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem) {
            const wordSpan = document.createElement('span');
            wordSpan.textContent = e.dataTransfer.getData('text/plain');
            wordSpan.classList.add('draggable-word');
            makeWordDraggable(wordSpan);
            dropZone.appendChild(wordSpan);
            dropZone.appendChild(document.createTextNode(' '));
            console.log('Dropped (Ex3):', wordSpan.textContent, 'into sentence', dropZone.getAttribute('data-sentence'));
        }
    });
});
// END DRAG-AND-DROP EXERCISE 3 //

// START EXERCISE CHECKERS //
// START EXERCISE 1 CHECKER //
function checkExercise1() {
    const answers = {
        'ex1-1': 'mache',
        'ex1-2': 'machst',
        'ex1-3': 'macht',
        'ex1-4': 'machen',
        'ex1-5': 'machen'
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
// END EXERCISE 1 CHECKER //

// START EXERCISE 2 CHECKER //
function checkExercise2() {
    const correctAnswers = {
        'A': 'Guten Morgen',
        'B': 'Na, wie läuft’s',
        'C': 'Servus',
        'D': 'Grüß di'
    };
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    document.querySelectorAll('.droppable').forEach(zone => {
        const dialectId = zone.getAttribute('data-id');
        if (!dialectId) {
            console.error('Missing data-id on droppable zone:', zone);
            return;
        }
        const greeting = zone.querySelector('.draggable')?.textContent.trim();
        if (greeting && greeting === correctAnswers[dialectId]) {
            correct++;
            feedback += `<li>${zone.textContent.trim().split(':')[0]}: Correct!</li>`;
        } else {
            feedback += `<li>${zone.textContent.trim().split(':')[0]}: Incorrect. Correct greeting: "${correctAnswers[dialectId]}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise2-feedback', `You got ${correct}/4 correct! ${feedback}`, correct === 4 ? 'alert-success' : 'alert-warning');
}
// END EXERCISE 2 CHECKER //

// START EXERCISE 3 CHECKER //
function checkExercise3() {
    const correctSentences = {
        '1': 'Was machst’n Kumpel ?',
        '2': 'Ich komm gleich Mann !',
        '3': 'Wir machen Party !'
    };
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    document.querySelectorAll('.droppable-sentence').forEach(dropZone => {
        const sentenceId = dropZone.getAttribute('data-sentence');
        if (!sentenceId) {
            console.error('Missing data-sentence attribute on:', dropZone);
            feedback += `<li>Sentence ${sentenceId || 'unknown'}: Error - missing sentence ID.</li>`;
            return;
        }
        const userSentence = Array.from(dropZone.querySelectorAll('.draggable-word'))
            .map(word => word.textContent.trim())
            .join(' ')
            .trim();
        console.log(`Sentence ${sentenceId} - User: "${userSentence}", Expected: "${correctSentences[sentenceId]}"`);
        if (userSentence === correctSentences[sentenceId]) {
            correct++;
            feedback += `<li>Sentence ${sentenceId}: Correct!</li>`;
        } else {
            feedback += `<li>Sentence ${sentenceId}: Incorrect. Correct sentence: "${correctSentences[sentenceId].replace(' ?', '?').replace(' !', '!')}". Your answer: "${userSentence}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise3-feedback', `You got ${correct}/3 correct! ${feedback}`, correct === 3 ? 'alert-success' : 'alert-warning');
    console.log('Exercise 3 checked. Correct answers:', correct);
}
// END EXERCISE 3 CHECKER //

// START EXERCISE 4 CHECKER //
function checkExercise4() {
    const answers = {
        'ex4-1': 'B', // Was
        'ex4-2': 'A', // Woher
        'ex4-3': 'A', // Freut
        'ex4-4': 'C'  // Gudd
    };
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    Object.keys(answers).forEach((name, index) => {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        const correctLabel = document.querySelector(`label[for="${name}${answers[name]}"]`);
        if (!selected) {
            console.warn(`No selection for question ${name}`);
            feedback += `<li>${index + 1}. Incorrect. No answer selected. Correct answer: "${correctLabel ? correctLabel.textContent : answers[name]}".</li>`;
        } else if (selected.value === answers[name]) {
            correct++;
            feedback += `<li>${index + 1}. Correct!</li>`;
        } else {
            feedback += `<li>${index + 1}. Incorrect. Correct answer: "${correctLabel ? correctLabel.textContent : answers[name]}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise4-feedback', `You got ${correct}/4 correct! ${feedback}`, correct === 4 ? 'alert-success' : 'alert-warning');
    console.log('Exercise 4 checked. Correct answers:', correct);
}
// END EXERCISE 4 CHECKER //
// END EXERCISE CHECKERS //
