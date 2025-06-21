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
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem) {
            // If the drop zone already has an item, swap it back to the greetings list
            const existingItem = dropZone.querySelector('.draggable');
            if (existingItem) {
                document.getElementById('greetings-list').appendChild(existingItem);
            }
            // Append the dragged item to the drop zone
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

// Exercise 1: Check Answers
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

// Exercise 2: Check Answers
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

// Exercise 3: Check Answers
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

// Exercise 4: Check Answers
function checkExercise4() {
    const answers = {
        'ex4-1': 'Tag',
        'ex4-2': 'Wie',
        'ex4-3': 'Servus',
        'ex4-4': 'Grüß'
    };
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    Object.keys(answers).forEach((name, index) => {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        if (selected && selected.value === answers[name]) {
            correct++;
            feedback += `<li>${index + 1}. Correct!</li>`;
        } else {
            feedback += `<li>${index + 1}. Incorrect. Check the vocabulary for this dialect.</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise4-feedback', `You got ${correct}/4 correct! ${feedback}`, correct === 4 ? 'alert-success' : 'alert-warning');
}

// Exercise 5: Check Answers
function checkExercise5() {
    const answers = {
        'ex5-1': 'sind',
        'ex5-2': 'bist',
        'ex5-3': 'bin',
        'ex5-4': 'sind',
        'ex5-5': 'sind',
        'ex5-6': 'sind',
        'ex5-7': 'ist',
        'ex5-8': 'bist'
    };
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    Object.keys(answers).forEach((id, index) => {
        const userAnswer = document.getElementById(id).value.trim().toLowerCase();
        if (userAnswer === answers[id]) {
            correct++;
            feedback += `<li>${index + 1}. Correct!</li>`;
        } else {
            feedback += `<li>${index + 1}. Incorrect. Check the form of "sein" for this dialect.</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise5-feedback', `You got ${correct}/8 correct! ${feedback}`, correct === 8 ? 'alert-success' : 'alert-warning');
}

// Exercise 6: Check Answers
function checkExercise6() {
    const answers = {
        'ex6-1': ['Hey, na, wie geht’s, Kumpel?', 'Hey, wie geht’s, Kumpel?', 'Na, wie geht’s, Mann?', 'Hey, na, wie geht’s?', 'Hey, wie geht’s dir, Mann?'],
        'ex6-2': ['Mann, ich bin total kaputt!', 'Ich bin voll kaputt, Mann!', 'Total kaputt, Mann!', 'Ich bin total fertig!', 'Voll fertig, Mann!'],
        'ex6-3': ['Wo kommst’n her?', 'Woher kommst’n?', 'Was, wo kommst’n her?', 'Wo kommst du her, Mann?', 'Woher bist’n?'],
        'ex6-4': ['Komm, lass uns ’nen Kaffee trinken!', 'Lass uns ’nen Kaffee trinken, Mann!', 'Komm, ’nen Kaffee trinken!', 'Lass uns ins Café, Mann!', 'Komm, Kaffee trinken!']
    };
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    Object.keys(answers).forEach((id, index) => {
        const userAnswer = document.getElementById(id).value.trim().toLowerCase();
        const isCorrect = answers[id].some(ans => ans.toLowerCase() === userAnswer);
        if (isCorrect) {
            correct++;
            feedback += `<li>${index + 1}. Correct!</li>`;
        } else {
            feedback += `<li>${index + 1}. Incorrect. Try using more colloquial expressions.</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise6-feedback', `You got ${correct}/4 correct! ${feedback}`, correct === 4 ? 'alert-success' : 'alert-warning');
}

// Exercise 7: Check Dialogue
function checkExercise7() {
    const dialogue = document.getElementById('ex7-dialogue').value.trim();
    let feedback = '';
    if (dialogue.length < 20) {
        feedback = 'Please write a dialogue with 4-6 lines.';
        showExerciseFeedback('exercise7-feedback', feedback, 'alert-danger');
        return;
    }
    const hasSein = dialogue.toLowerCase().includes('bin') || dialogue.toLowerCase().includes('bist') || dialogue.toLowerCase().includes('ist') || dialogue.toLowerCase().includes('sind') || dialogue.toLowerCase().includes('seid');
    const hasGreeting = dialogue.toLowerCase().includes('hallo') || dialogue.toLowerCase().includes('hey') || dialogue.toLowerCase().includes('servus') || dialogue.toLowerCase().includes('grüß');
    if (hasSein && hasGreeting) {
        feedback = 'Great job! Your dialogue includes a form of “sein” and a greeting. Check the sample solution for comparison.';
        showExerciseFeedback('exercise7-feedback', feedback, 'alert-success');
    } else {
        feedback = 'Incomplete. Ensure your dialogue includes one form of “sein” and one greeting (e.g., Hallo, Hey, Servus, or Grüß di).';
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
            feedback += `<li>${index + 1}. Incorrect. Check the dialect characteristics.</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise8-feedback', `You got ${correct}/4 correct! ${feedback}`, correct === 4 ? 'alert-success' : 'alert-warning');
}

// Exercise 9: Check Answers
function checkExercise9() {
    const answers = {
        'ex9-1-bav': ['Servus! Was machst’n?', 'Servus! Was machst’n, gell?', 'Servus! Was machst du?'],
        'ex9-1-swa': ['Grüß di! Wie goht’s?', 'Grüß di! Wie goht’s dir?', 'Grüß di! Wie goht’s dir, ma?'],
        'ex9-2-bav': ['Passt scho, i bin guat.', 'Passt scho, i bin guat, gell.', 'Passt scho! I bin guat.'],
        'ex9-2-swa': ['Gudd, i bin gudd.', 'Danke, i bin gudd.', 'Gudd! I bin gudd.'],
        'ex9-3-bav': ['Geh, mia schwätzen!', 'Geh, mia schwätzen a bisserl!', 'Geh, mia schwätzen, gell!'],
        'ex9-3-swa': ['Geh, mir schwätzen!', 'Geh, mir schwätzen en babbel!', 'Geh, mir schwätzen, ma!'],
        'ex9-4-bav': ['Jo, des is mei schee.', 'Jo, des is schee, gell.', 'Jo! Des is mei schee.'],
        'ex9-4-swa': ['Jo, des is richtig schee.', 'Jo, des is schee.', 'Jo! Des is richtig schee.']
    };
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    Object.keys(answers).forEach((id, index) => {
        const userAnswer = document.getElementById(id).value.trim().toLowerCase().replace(/[.,!?;]/g, '');
        const isCorrect = answers[id].some(ans => ans.toLowerCase().replace(/[.,!?;]/g, '') === userAnswer);
        if (isCorrect) {
            correct++;
            feedback += `<li>${Math.floor(index / 2) + 1}. ${id.includes('bav') ? 'Bavarian' : 'Swabian'}: Correct!</li>`;
        } else {
            feedback += `<li>${Math.floor(index / 2) + 1}. ${id.includes('bav') ? 'Bavarian' : 'Swabian'}: Incorrect. Check the dialect-specific vocabulary.</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise9-feedback', `You got ${correct}/8 correct! ${feedback}`, correct === 8 ? 'alert-success' : 'alert-warning');
}

// Exercise 10: Check Answers
function checkExercise10() {
    const answers = {
        'ex10-1': ['Text 1 is in a café, Text 2 is at a house party.', 'Text 1 takes place in a café, Text 2 at a party.', 'Text 1: café, Text 2: house party.'],
        'ex10-2': ['Text 1 is formal and polite, Text 2 is casual and relaxed.', 'Text 1 is polite, Text 2 is informal.', 'Text 1 is formal, Text 2 is relaxed.'],
        'ex10-3': ['People talk, chat, and make plans to meet again in both passages.', 'Both texts involve conversations and plans to meet.', 'In both, people chat and plan to meet again.']
    };
    let correct = 0;
    let feedback = '<h5>Feedback:</h5><ul>';
    Object.keys(answers).forEach((id, index) => {
        const userAnswer = document.getElementById(id).value.trim().toLowerCase();
        const isCorrect = answers[id].some(ans => ans.toLowerCase().includes(userAnswer) || userAnswer.includes(ans.toLowerCase()));
        if (isCorrect) {
            correct++;
            feedback += `<li>${index + 1}. Correct!</li>`;
        } else {
            feedback += `<li>${index + 1}. Incorrect. Review the passages for the correct details.</li>`;
        }
    });
    const paragraph = document.getElementById('ex10-paragraph').value.trim();
    if (paragraph.split('.').length >= 3 && paragraph.toLowerCase().includes('sonnig') && paragraph.toLowerCase().includes('leute')) {
        correct++;
        feedback += `<li>Paragraph: Well done! Your paragraph describes a similar scene.</li>`;
    } else {
        feedback += `<li>Paragraph: Ensure your paragraph has 3-4 sentences and describes a sunny day with people interacting.</li>`;
    }
    feedback += '</ul>';
    showExerciseFeedback('exercise10-feedback', `You got ${correct}/4 correct! ${feedback}`, correct === 4 ? 'alert-success' : 'alert-warning');
}
