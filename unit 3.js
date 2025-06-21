function openTab(evt, tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

function speak(text, lang) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.onerror = () => showAudioFeedback('Audio playback failed.', 'alert-danger');
        utterance.onend = () => showAudioFeedback('', '');
        speechSynthesis.speak(utterance);
        showAudioFeedback('Playing audio...', 'alert-info');
    } else {
        showAudioFeedback('Text-to-speech not supported in your browser.', 'alert-danger');
    }
}

function showAudioFeedback(message, alertType) {
    const feedback = document.getElementById('audio-feedback');
    if (feedback) {
        feedback.textContent = message;
        feedback.className = `alert ${alertType}`;
        feedback.style.display = message ? 'block' : 'none';
        if (message) setTimeout(() => feedback.style.display = 'none', 3000);
    }
}

function showExerciseFeedback(elementId, message, alertType) {
    const feedback = document.getElementById(elementId);
    feedback.innerHTML = message;
    feedback.className = `alert ${alertType || 'alert-danger'}`;
    feedback.style.display = 'block';
}

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

function checkExercise1() {
    const answers = {
        'ex1-1': 'zwei',
        'ex1-2': 'drei',
        'ex1-3': 'ein',
        'ex1-4': 'vier',
        'ex1-5': 'fünf'
    };
    let correct = 0;
    let feedback = '<h5>Results</h5><ul>';
    Object.keys(answers).forEach((id, index) => {
        const userAnswer = document.getElementById(id).value.trim().toLowerCase();
        if (userAnswer === answers[id]) {
            correct++;
            feedback += `<li>Question ${index + 1}: Correct!</li>`;
        } else {
            feedback += `<li>Question ${index + 1}: Incorrect. Correct answer is "${answers[id]}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise1-feedback', `${correct}/5 correct. ${feedback}`, correct === 5 ? 'alert-success' : 'alert-danger');
}

function checkExercise2() {
    const correctAnswers = {
        'A': 'Wie viel kostet das?',
        'B': 'Was kostet’n das?',
        'C': 'Was kost’ des?',
        'D': 'Was koscht des?'
    };
    let correct = 0;
    let feedback = '<h5>Results</h5><ul>';
    document.querySelectorAll('.droppable').forEach(zone => {
        const dialectId = zone.getAttribute('data-id');
        const greeting = zone.querySelector('.draggable')?.textContent.trim();
        if (greeting && greeting === correctAnswers[dialectId]) {
            correct++;
            feedback += `<li>${zone.textContent.trim()}: Correct!</li>`;
        } else {
            feedback += `<li>${zone.textContent.trim()}: Incorrect. Correct answer is "${correctAnswers[dialectId]}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise2-feedback', `${correct}/4 correct. ${feedback}`, correct === 4 ? 'alert-success' : 'alert-danger');
}

function checkExercise3() {
    const correctSentences = {
        '1': 'Was kostet’n das?',
        '2': 'Gib mir ’n Kilo Karotten!',
        '3': 'Ziemlich teuer, oder?'
    };
    let correct = 0;
    let feedback = '<h5>Results</h5><ul>';
    document.querySelectorAll('.droppable-sentence').forEach(dropZone => {
        const sentenceId = dropZone.getAttribute('data-sentence');
        const userSentence = dropZone.textContent.trim();
        if (userSentence === correctSentences[sentenceId]) {
            correct++;
            feedback += `<li>Sentence ${sentenceId}: Correct!</li>`;
        } else {
            feedback += `<li>Sentence ${sentenceId}: Incorrect. Correct answer is "${correctSentences[sentenceId]}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise3-feedback', `${correct}/3 correct. ${feedback}`, correct === 3 ? 'alert-success' : 'alert-danger');
}

function checkExercise4() {
    const answers = {
        'ex4-1': 'A',
        'ex4-2': 'A',
        'ex4-3': 'A',
        'ex4-4': 'B'
    };
    let correct = 0;
    let feedback = '<h5>Results</h5><ul>';
    Object.keys(answers).forEach((name, index) => {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        if (selected && selected.value === answers[name]) {
            correct++;
            feedback += `<li>Question ${index + 1}: Correct!</li>`;
        } else {
            feedback += `<li>Question ${index + 1}: Incorrect. Correct answer is "${answers[name]}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise4-feedback', `${correct}/4 correct. ${feedback}`, correct === 4 ? 'alert-success' : 'alert-danger');
}

function checkExercise5() {
    const answers = {
        'ex5-1': 'zwei',
        'ex5-2': 'zwei',
        'ex5-3': 'zwoa',
        'ex5-4': 'ois',
        'ex5-5': 'fünf',
        'ex5-6': '’n',
        'ex5-7': 'drei',
        'ex5-8': 'zwoi'
    };
    let correct = 0;
    let feedback = '<h5>Results</h5><ul>';
    Object.keys(answers).forEach((id, index) => {
        const userAnswer = document.getElementById(id).value.trim().toLowerCase();
        if (userAnswer === answers[id]) {
            correct++;
            feedback += `<li>Question ${index + 1}: Correct!</li>`;
        } else {
            feedback += `<li>Question ${index + 1}: Incorrect. Correct answer is "${answers[id]}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise5-feedback', `${correct}/8 correct. ${feedback}`, correct === 8 ? 'alert-success' : 'alert-danger');
}

function checkExercise6() {
    const answers = {
        'ex6-1': 'Was kostet’n das Brot?',
        'ex6-2': 'Gib mir ’n Kilo Äpfel!',
        'ex6-3': 'Hast’n frische Tomaten?',
        'ex6-4': 'Ziemlich teuer, oder?'
    };
    let correct = 0;
    let feedback = '<h5>Results</h5><ul>';
    Object.keys(answers).forEach((id, index) => {
        const userAnswer = document.getElementById(id).value.trim().toLowerCase();
        const correctAnswer = answers[id].toLowerCase();
        if (userAnswer === correctAnswer) {
            correct++;
            feedback += `<li>Question ${index + 1}: Correct!</li>`;
        } else {
            feedback += `<li>Question ${index + 1}: Incorrect. Correct answer is "${answers[id]}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise6-feedback', `${correct}/4 correct. ${feedback}`, correct === 4 ? 'alert-success' : 'alert-danger');
}

function checkExercise7() {
    const dialogue = document.getElementById('ex7-dialogue').value.trim();
    if (!dialogue) {
        showExerciseFeedback('exercise7-feedback', 'Please enter a dialogue.', 'alert-danger');
        return;
    }
    const lines = dialogue.split('\n').filter(line => line.trim() !== '');
    const hasNumber = /eins|zwei|drei|vier|fünf|ein|’n|zwoa|ois|zwoi|kilo|stück/i.test(dialogue);
    const hasVocab = /kostet|möchte|will|möcht|haben|hast|hosch|teuer|danke/i.test(dialogue.toLowerCase());
    let feedback = '<h5>Feedback</h5><ul>';
    if (lines.length < 4 || lines.length > 6) {
        feedback += `<li>Dialogue should have 4–6 lines (found ${lines.length}).</li>`;
    } else {
        feedback += `<li>Correct number of lines: ${lines.length}.</li>`;
    }
    if (!hasNumber) {
        feedback += '<li>Dialogue must include a number or quantity (e.g., zwei, Kilo).</li>';
    } else {
        feedback += '<li>Number or quantity included: Correct!</li>';
    }
    if (!hasVocab) {
        feedback += '<li>Dialogue must include at least one vocabulary phrase (e.g., kostet, danke).</li>';
    } else {
        feedback += '<li>Vocabulary phrase included: Correct!</li>';
    }
    feedback += '</ul>';
    const isCorrect = (lines.length >= 4 && lines.length <= 6 && hasNumber && hasVocab);
    showExerciseFeedback('exercise7-feedback', isCorrect ? 'Dialogue meets all requirements!' : feedback, isCorrect ? 'alert-success' : 'alert-danger');
}

function checkExercise8() {
    const answers = {
        'ex8-1': 'C',
        'ex8-2': 'A',
        'ex8-3': 'B',
        'ex8-4': 'D'
    };
    let correct = 0;
    let feedback = '<h5>Results</h5><ul>';
    Object.keys(answers).forEach((name, index) => {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        if (selected && selected.value === answers[name]) {
            correct++;
            feedback += `<li>Question ${index + 1}: Correct!</li>`;
        } else {
            feedback += `<li>Question ${index + 1}: Incorrect. Correct answer is "${answers[name]}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise8-feedback', `${correct}/4 correct. ${feedback}`, correct === 4 ? 'alert-success' : 'alert-danger');
}

function checkExercise9() {
    const answers = {
        'ex9-1-bav': 'Was kost’ des?',
        'ex9-1-swa': 'Was koscht des?',
        'ex9-2-bav': 'I möcht a Kilo Kartoffeln.',
        'ex9-2-swa': 'I will a Kilo Kartoffeln.',
        'ex9-3-bav': 'Hast a frische Äpfel?',
        'ex9-3-swa': 'Hosch frische Äpfel?',
        'ex9-4-bav': 'Jo, danke!',
        'ex9-4-swa': 'Jo, gudd, danke!'
    };
    let correct = 0;
    let feedback = '<h5>Results</h5><ul>';
    Object.keys(answers).forEach((id, index) => {
        const userAnswer = document.getElementById(id).value.trim().toLowerCase();
        const correctAnswer = answers[id].toLowerCase();
        if (userAnswer === correctAnswer) {
            correct++;
            feedback += `<li>Question ${Math.floor(index / 2) + 1} (${id.includes('bav') ? 'Bavarian' : 'Swabian'}): Correct!</li>`;
        } else {
            feedback += `<li>Question ${Math.floor(index / 2) + 1} (${id.includes('bav') ? 'Bavarian' : 'Swabian'}): Incorrect. Correct answer is "${answers[id]}".</li>`;
        }
    });
    feedback += '</ul>';
    showExerciseFeedback('exercise9-feedback', `${correct}/8 correct. ${feedback}`, correct === 8 ? 'alert-success' : 'alert-danger');
}

function checkExercise10() {
    const answers = {
        'ex10-1': 'Text 1: Markt, Text 2: Bauernmarkt.',
        'ex10-2': 'Text 1: Äpfel, Brot, Käse; Text 2: Tomaten, Brot, Käse, Gemüse.',
        'ex10-3': 'Äpfel, Tomaten, Brot.'
    };
    let correct = 0;
    let feedback = '<h5>Results</h5><ul>';
    Object.keys(answers).forEach((id, index) => {
        const userAnswer = document.getElementById(id).value.trim().toLowerCase();
        const correctAnswer = answers[id].toLowerCase();
        if (userAnswer.includes(correctAnswer.split('.')[0])) {
            correct++;
            feedback += `<li>Question ${index + 1}: Correct!</li>`;
        } else {
            feedback += `<li>Question ${index + 1}: Incorrect. Correct answer is "${answers[id]}".</li>`;
        }
    });
    const paragraph = document.getElementById('ex10-paragraph').value.trim();
    const sentences = paragraph.split('.').filter(s => s.trim()).length;
    if (sentences < 3 || sentences > 4) {
        feedback += `<li>Paragraph: Incorrect. Paragraph should have 3–4 sentences (found ${sentences}).</li>`;
    } else if (!/ist|sind|kaufen|kostet|frische/i.test(paragraph.toLowerCase())) {
        feedback += '<li>Paragraph: Incorrect. Paragraph should include market-related vocabulary (e.g., ist, kaufen, frische).</li>';
    } else {
        correct++;
        feedback += `<li>Paragraph: Correct!</li>`;
    }
    feedback += '</ul>';
    showExerciseFeedback('exercise10-feedback', `${correct}/4 correct. ${feedback}`, correct === 4 ? 'alert-success' : 'alert-danger');
}