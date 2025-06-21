
// Tab Navigation
function openTab(evt, tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// Speech Synthesis
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

// Audio Feedback
function showAudioFeedback(message, alertType) {
    const feedback = document.getElementById('audio-feedback');
    if (feedback) {
        feedback.textContent = message;
        feedback.className = `alert ${alertType}`;
        feedback.style.display = 'block';
        setTimeout(() => feedback.style.display = 'none', 3000);
    }
}

// Exercise Feedback
function showExerciseFeedback(elementId, message, alertType) {
    const feedback = document.getElementById(elementId);
    feedback.innerHTML = message;
    feedback.className = `alert ${alertType}`;
    feedback.style.display = 'block';
}

// Drag-and-Drop Functionality for Exercise 2
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
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
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

// Drag-and-Drop Functionality for Exercise 3
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
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem) {
            dropZone.innerHTML += ` ${draggedItem.textContent}`;
            draggedItem.remove();
        }
    });
});

// Exercise 1: Check Answers
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
        const userAnswer = document.getElementById(id).value.trim().toLowerCase();
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

// Exercise 2: Check Answers
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

// Exercise 3: Check Answers
function checkExercise3() {
    const correctSentences = {
        '1': 'Was machst’n, Kumpel?',
        '2': 'Ich komm gleich, Mann!',
        '3': 'Wir machen Party!'
    };
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    document.querySelectorAll('.droppable-sentence').forEach(dropZone => {
        const sentenceId = dropZone.getAttribute('data-sentence');
        const userSentence = dropZone.textContent.trim();
        if (userSentence === correctSentences[sentenceId]) {
            correct++;
            feedback += `<li>Sentence ${sentenceId}: Correct!</li>`;
        } else {
            feedback += `<li>Sentence ${sentenceId}: Incorrect. Correct sentence: "${correctSentences[sentenceId]}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise3-feedback', `You got ${correct}/3 correct! ${feedback}`, correct === 3 ? 'alert-success' : 'alert-warning');
}

// Exercise 4: Check Answers
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
        if (selected && selected.value === answers[name]) {
            correct++;
            feedback += `<li>${index + 1}. Correct!</li>`;
        } else {
            feedback += `<li>${index + 1}. Incorrect. Correct answer: "${document.querySelector(`label[for="${name}${answers[name]}"]`).textContent}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise4-feedback', `You got ${correct}/4 correct! ${feedback}`, correct === 4 ? 'alert-success' : 'alert-warning');
}

// Exercise 5: Check Answers
function checkExercise5() {
    const answers = {
        'ex5-1': 'komme',
        'ex5-2': 'kommst',
        'ex5-3': 'kimm',
        'ex5-4': 'kommen',
        'ex5-5': 'kommen',
        'ex5-6': 'kommen',
        'ex5-7': 'kimmt',
        'ex5-8': 'kommst'
    };
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    Object.keys(answers).forEach((id, index) => {
        const userAnswer = document.getElementById(id).value.trim().toLowerCase();
        if (userAnswer === answers[id]) {
            correct++;
            feedback += `<li>${index + 1}. Correct!</li>`;
        } else {
            feedback += `<li>${index + 1}. Incorrect. Correct answer: "${answers[id]}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise5-feedback', `You got ${correct}/8 correct! ${feedback}`, correct === 8 ? 'alert-success' : 'alert-warning');
}

// Exercise 6: Check Answers
function checkExercise6() {
    const answers = {
        'ex6-1': 'Hey, na, was machst’n?',
        'ex6-2': 'Ich komm aus München, Mann!',
        'ex6-3': 'Lass uns mal ’nen Plan machen!',
        'ex6-4': 'Cool, dich kennenzulernen!'
    };
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    Object.keys(answers).forEach((id, index) => {
        const userAnswer = document.getElementById(id).value.trim().toLowerCase();
        const correctAnswer = answers[id].toLowerCase();
        if (userAnswer === correctAnswer) {
            correct++;
            feedback += `<li>${index + 1}. Correct!</li>`;
        } else {
            feedback += `<li>${index + 1}. Incorrect. Correct answer: "${answers[id]}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise6-feedback', `You got ${correct}/4 correct! ${feedback}`, correct === 4 ? 'alert-success' : 'alert-warning');
}

// Exercise 7: Check Dialogue
function checkExercise7() {
    const dialogue = document.getElementById('ex7-dialogue').value.trim();
    if (!dialogue) {
        showExerciseFeedback('exercise7-feedback', 'Please write a dialogue.', 'alert-danger');
        return;
    }
    const lines = dialogue.split('\n').filter(line => line.trim() !== '');
    const hasVerb = /mach(e|st|en|t)|komm(e|st|en|t)|kimm(t)?|kemma/i.test(dialogue);
    const hasGreeting = /guten morgen|hey|servus|grüß/i.test(dialogue.toLowerCase());
    let feedback = '';
    if (lines.length < 4 || lines.length > 6) {
        feedback += 'Dialogue should have 4-6 lines.<br>';
    }
    if (!hasVerb) {
        feedback += 'Dialogue must include a form of "machen" or "kommen".<br>';
    }
    if (!hasGreeting) {
        feedback += 'Dialogue must include a greeting (e.g., Guten Morgen, Hey, Servus, Grüß di).<br>';
    }
    if (feedback === '') {
        feedback = 'Great job! Your dialogue includes a form of “machen” or “kommen” and a greeting. Check the sample solution for comparison.';
        showExerciseFeedback('exercise7-feedback', feedback, 'alert-success');
    } else {
        showExerciseFeedback('exercise7-feedback', feedback, 'alert-warning');
    }
}

// Exercise 8: Check Answers
function checkExercise8() {
    const answers = {
        'ex8-1': 'C',
        'ex8-2': 'A',
        'ex8-3': 'B',
        'ex8-4': 'D'
    };
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    Object.keys(answers).forEach((name, index) => {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        if (selected && selected.value === answers[name]) {
            correct++;
            feedback += `<li>${index + 1}. Correct!</li>`;
        } else {
            feedback += `<li>${index + 1}. Incorrect. Correct answer: "${answers[name]}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise8-feedback', `You got ${correct}/4 correct! ${feedback}`, correct === 4 ? 'alert-success' : 'alert-warning');
}

// Exercise 9: Check Answers
function checkExercise9() {
    const answers = {
        'ex9-1-bav': 'Servus! Was machst’n?',
        'ex9-1-swa': 'Grüß di! Wie goht’s?',
        'ex9-2-bav': 'I mach mei Arbeit.',
        'ex9-2-swa': 'I mach mei Sach.',
        'ex9-3-bav': 'Woher kimmt’n?',
        'ex9-3-swa': 'Wo kommst’n her?',
        'ex9-4-bav': 'Jo, des freut mi.',
        'ex9-4-swa': 'Jo, des freut mi.'
    };
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    Object.keys(answers).forEach((id, index) => {
        const userAnswer = document.getElementById(id).value.trim().toLowerCase();
        const correctAnswer = answers[id].toLowerCase();
        if (userAnswer === correctAnswer) {
            correct++;
            feedback += `<li>${Math.floor(index / 2) + 1}. ${id.includes('bav') ? 'Bavarian' : 'Swabian'}: Correct!</li>`;
        } else {
            feedback += `<li>${Math.floor(index / 2) + 1}. ${id.includes('bav') ? 'Bavarian' : 'Swabian'}: Incorrect. Correct answer: "${answers[id]}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise9-feedback', `You got ${correct}/8 correct! ${feedback}`, correct === 8 ? 'alert-success' : 'alert-warning');
}

// Exercise 10: Check Answers
function checkExercise10() {
    const answers = {
        'ex10-1': 'Text 1 is in a café, Text 2 is at a house party.',
        'ex10-2': 'Text 1 is formal and polite, Text 2 is casual and relaxed.',
        'ex10-3': 'People talk, chat, and make plans to meet again in both passages.'
    };
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    Object.keys(answers).forEach((id, index) => {
        const userAnswer = document.getElementById(id).value.trim().toLowerCase();
        const correctAnswer = answers[id].toLowerCase();
        if (userAnswer.includes(correctAnswer.split('.')[0])) {
            correct++;
            feedback += `<li>${index + 1}. Correct!</li>`;
        } else {
            feedback += `<li>${index + 1}. Incorrect. Expected: "${answers[id]}".</li>`;
        }
    });
    const paragraph = document.getElementById('ex10-paragraph').value.trim();
    const sentences = paragraph.split('.').filter(s => s.trim()).length;
    if (sentences < 3 || sentences > 4) {
        feedback += '<li>Paragraph: Should have 3-4 sentences.</li>';
    } else if (!/mach(e|st|en|t)|komm(e|st|en|t)|kimm(t)?|kemma/i.test(paragraph)) {
        feedback += '<li>Paragraph: Must include a form of "machen" or "kommen".</li>';
    } else {
        correct++;
        feedback += '<li>Paragraph: Well done! Matches the requirements.</li>';
    }
    feedback += '</ul>';
    showExerciseFeedback('exercise10-feedback', `You got ${correct}/4 correct! ${feedback}`, correct === 4 ? 'alert-success' : 'alert-warning');
}
