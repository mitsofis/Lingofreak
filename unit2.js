// Tab Navigation
function openTab(evt, tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
    console.log(`Opened tab: ${tabName}`);
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
    } else {
        console.error('Audio feedback element not found.');
    }
}

// Exercise Feedback
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

// Drag-and-Drop Functionality for Exercise 2
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

// Drag-and-Drop Functionality for Exercise 3
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
        if (!sentenceId) {
            console.error('Missing data-sentence attribute on:', dropZone);
            feedback += `<li>Sentence ${sentenceId || 'unknown'}: Error - missing sentence ID.</li>`;
            return;
        }
        const userSentence = dropZone.textContent
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/ ,/g, ',')
            .replace(/ \?/g, '?')
            .replace(/ !/g, '!');
        console.log(`Sentence ${sentenceId} - User: "${userSentence}", Expected: "${correctSentences[sentenceId]}"`);
        if (userSentence === correctSentences[sentenceId]) {
            correct++;
            feedback += `<li>Sentence ${sentenceId}: Correct!</li>`;
        } else {
            feedback += `<li>Sentence ${sentenceId}: Incorrect. Correct sentence: "${correctSentences[sentenceId]}". Your answer: "${userSentence}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise3-feedback', `You got ${correct}/3 correct! ${feedback}`, correct === 3 ? 'alert-success' : 'alert-warning');
    console.log('Exercise 3 checked. Correct answers:', correct);
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
        const input = document.getElementById(id);
        if (!input) {
            console.error(`Input with ID ${id} not found.`);
            return;
        }
        const userAnswer = input.value.trim().toLowerCase();
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
    const dialogueInput = document.getElementById('ex7-dialogue');
    if (!dialogueInput) {
        console.error('Dialogue input with ID ex7-dialogue not found.');
        showExerciseFeedback('exercise7-feedback', 'Error: Dialogue input not found.', 'alert-danger');
        return;
    }
    const dialogue = dialogueInput.value.trim();
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
        if (!selected) {
            console.warn(`No selection for question ${name}`);
            feedback += `<li>${index + 1}. Incorrect. No answer selected. Correct answer: "${answers[name]}".</li>`;
        } else if (selected.value === answers[name]) {
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
        const input = document.getElementById(id);
        if (!input) {
            console.error(`Input with ID ${id} not found.`);
            return;
        }
        const userAnswer = input.value.trim().toLowerCase();
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
        const input = document.getElementById(id);
        if (!input) {
            console.error(`Input with ID ${id} not found.`);
            return;
        }
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = answers[id].toLowerCase();
        if (userAnswer.includes(correctAnswer.split('.')[0])) {
            correct++;
            feedback += `<li>${index + 1}. Correct!</li>`;
        } else {
            feedback += `<li>${index + 1}. Incorrect. Expected: "${answers[id]}".</li>`;
        }
    });
    const paragraphInput = document.getElementById('ex10-paragraph');
    if (!paragraphInput) {
        console.error('Paragraph input with ID ex10-paragraph not found.');
        return;
    }
    const paragraph = paragraphInput.value.trim();
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
