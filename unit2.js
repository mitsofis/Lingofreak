document.addEventListener('DOMContentLoaded', () => {
    // Normalize Input
    function normalizeInput(input) {
        return input.trim().toLowerCase().replace(/[\s.,!?]+/g, ' ').replace(/’/g, "'");
    }

    // General Feedback
    function showFeedback(message, type) {
        const feedback = document.getElementById('feedback');
        if (feedback) {
            feedback.textContent = message;
            feedback.className = `alert alert-${type}`;
            feedback.style.display = 'inline-block';
            setTimeout(() => feedback.style.display = 'none', 3000);
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

    // Speech Synthesis
    let currentUtterance = null;
    let isSpeaking = false;
    let lastSpokenText = '';
    let lastLang = '';

    function stopSpeaking() {
        if ('speechSynthesis' in window && (speechSynthesis.speaking || speechSynthesis.pending)) {
            speechSynthesis.cancel();
            isSpeaking = false;
            lastSpokenText = '';
        }
    }

    function speak(text, lang) {
        if (!('speechSynthesis' in window)) {
            showAudioFeedback('Your browser does not support audio playback.', 'alert-danger');
            return;
        }

        if (isSpeaking && text === lastSpokenText && lang === lastLang) {
            stopSpeaking();
            showAudioFeedback('Audio stopped.', 'alert-warning');
            return;
        }

        stopSpeaking();
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

    // Tab Navigation
    function openTab(evt, tabName) {
        stopSpeaking();
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');
        evt.currentTarget.classList.add('active');
    }

    // === Exercises ===

    function checkExercise1() {
        const answers = ['mache', 'machst', 'macht', 'machen', 'machen'];
        let correct = 0;
        for (let i = 1; i <= 5; i++) {
            const input = document.getElementById(`ex1-${i}`);
            const value = normalizeInput(input.value);
            if (value === answers[i - 1]) {
                correct++;
                input.classList.add('is-valid');
                input.classList.remove('is-invalid');
            } else {
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');
            }
        }
        document.getElementById('exercise1-feedback').innerHTML = `You got ${correct} out of 5 correct!`;
        showFeedback(`Exercise 1: ${correct}/5 correct!`, correct === 5 ? 'success' : 'warning');
    }

    // Drag and Drop Exercises
    let dragged;

    function initializeDragAndDrop() {
        document.querySelectorAll('.draggable').forEach(item => {
            item.addEventListener('dragstart', e => {
                dragged = e.target;
                e.target.classList.add('dragging');
            });
            item.addEventListener('dragend', e => {
                e.target.classList.remove('dragging');
            });
        });

        document.querySelectorAll('.droppable').forEach(item => {
            item.addEventListener('dragover', e => e.preventDefault());
            item.addEventListener('drop', e => {
                e.preventDefault();
                while (item.firstChild) {
                    document.getElementById('phrases-list').appendChild(item.firstChild);
                }
                item.appendChild(dragged);
            });
        });
    }

    function checkExercise2() {
        let correct = 0;
        document.querySelectorAll('.droppable').forEach(item => {
            item.classList.remove('bg-success', 'bg-danger', 'text-white');
            const child = item.querySelector('.draggable');
            if (child && child.dataset.answer === item.dataset.id) {
                correct++;
                item.classList.add('bg-success', 'text-white');
                child.classList.add('correct');
            } else if (child) {
                item.classList.add('bg-danger', 'text-white');
                child.classList.remove('correct');
            }
        });
        document.getElementById('exercise2-feedback').innerHTML = `You got ${correct} out of 4 correct!`;
        showFeedback(`Exercise 2: ${correct}/4 correct!`, correct === 4 ? 'success' : 'warning');
    }

    function resetExercise2() {
        document.querySelectorAll('.droppable').forEach(item => {
            while (item.firstChild) {
                document.getElementById('phrases-list').appendChild(item.firstChild);
            }
            item.classList.remove('bg-success', 'bg-danger', 'text-white');
        });
        document.querySelectorAll('.draggable').forEach(item => item.classList.remove('correct'));
        document.getElementById('exercise2-feedback').innerHTML = '';
    }

    function initializeSentenceDragAndDrop() {
        document.querySelectorAll('.draggable-word').forEach(item => {
            item.addEventListener('dragstart', e => {
                dragged = e.target;
                e.target.classList.add('dragging');
            });
            item.addEventListener('dragend', e => {
                e.target.classList.remove('dragging');
            });
        });

        document.querySelectorAll('.droppable-sentence').forEach(item => {
            item.addEventListener('dragover', e => e.preventDefault());
            item.addEventListener('drop', e => {
                e.preventDefault();
                const sentenceId = item.dataset.sentence;
                const sourceList = document.querySelector(`.sentence-drag-list[data-sentence="${sentenceId}"]`);
                item.appendChild(dragged);
                if (!item.contains(dragged)) {
                    sourceList.appendChild(dragged);
                }
            });
        });
    }

    function checkExercise3() {
        let correct = 0;
        document.querySelectorAll('.droppable-sentence').forEach(item => {
            item.classList.remove('bg-success', 'bg-danger', 'text-white');
            const sentenceId = item.dataset.sentence;
            const correctOrder = document.querySelector(`.sentence-drag-list[data-sentence="${sentenceId}"]`).dataset.correct;
            const droppedWords = Array.from(item.children).map(word => word.textContent.trim()).join(' ');
            if (normalizeInput(droppedWords) === normalizeInput(correctOrder)) {
                correct++;
                item.classList.add('bg-success', 'text-white');
            } else {
                item.classList.add('bg-danger', 'text-white');
            }
        });
        document.getElementById('exercise3-feedback').innerHTML = `You got ${correct} out of 3 correct!`;
        showFeedback(`Exercise 3: ${correct}/3 correct!`, correct === 3 ? 'success' : 'warning');
    }

    function resetExercise3() {
        document.querySelectorAll('.droppable-sentence').forEach(item => {
            const sentenceId = item.dataset.sentence;
            const sourceList = document.querySelector(`.sentence-drag-list[data-sentence="${sentenceId}"]`);
            while (item.firstChild) {
                sourceList.appendChild(item.firstChild);
            }
            item.classList.remove('bg-success', 'bg-danger', 'text-white');
        });
        document.getElementById('exercise3-feedback').innerHTML = '';
    }

    function checkExercise4() {
        const answers = ['B', 'A', 'A', 'C'];
        let correct = 0;
        for (let i = 1; i <= 4; i++) {
            const selected = document.querySelector(`input[name="ex4-${i}"]:checked`);
            const parent = selected ? selected.parentElement : null;
            if (parent) {
                parent.classList.remove('text-success', 'text-danger');
                if (selected.value === answers[i - 1]) {
                    correct++;
                    parent.classList.add('text-success');
                } else {
                    parent.classList.add('text-danger');
                }
            }
        }
        document.getElementById('exercise4-feedback').innerHTML = `You got ${correct} out of 4 correct!`;
        showFeedback(`Exercise 4: ${correct}/4 correct!`, correct === 4 ? 'success' : 'warning');
    }

    function checkExercise5() {
        const answers = ['komme', 'kommst', 'kimm', 'kommen', 'kommen', 'kommen', 'kimmt', 'kommst'];
        let correct = 0;
        for (let i = 1; i <= 8; i++) {
            const input = document.getElementById(`ex5-${i}`);
            const value = normalizeInput(input.value);
            if (value === answers[i - 1]) {
                correct++;
                input.classList.add('is-valid');
                input.classList.remove('is-invalid');
            } else {
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');
            }
        }
        document.getElementById('exercise5-feedback').innerHTML = `You got ${correct} out of 8 correct!`;
        showFeedback(`Exercise 5: ${correct}/8 correct!`, correct === 8 ? 'success' : 'warning');
    }

    // Add checkExercise6 through checkExercise10 here similarly if needed...

    // Initialize Drag-and-Drop
    initializeDragAndDrop();
    initializeSentenceDragAndDrop();
});
