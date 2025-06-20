
        // Tab Functionality
        function openTab(evt, tabName) {
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
            document.getElementById(tabName).classList.add('active');
            evt.currentTarget.classList.add('active');
        }

        // Audio Feedback
        function showFeedback(message, type) {
            const feedback = document.getElementById('audio-feedback');
            feedback.textContent = message;
            feedback.className = `alert alert-${type}`;
            feedback.style.display = 'block';
            setTimeout(() => feedback.style.display = 'none', 3000);
        }

        // Exercise 1: Fill in the Blank (Standard German)
        function checkExercise1() {
            const answers = ['mache', 'machst', 'macht', 'machen', 'machen'];
            let correct = 0;
            for (let i = 1; i <= 5; i++) {
                const input = document.getElementById(`ex1-${i}`).value.trim().toLowerCase();
                if (input === answers[i-1]) {
                    correct++;
                    document.getElementById(`ex1-${i}`).classList.add('is-valid');
                    document.getElementById(`ex1-${i}`).classList.remove('is-invalid');
                } else {
                    document.getElementById(`ex1-${i}`).classList.add('is-invalid');
                    document.getElementById(`ex1-${i}`).classList.remove('is-valid');
                }
            }
            document.getElementById('exercise1-feedback').innerHTML = `You got ${correct} out of 5 correct!`;
            showFeedback(`Exercise 1: ${correct}/5 correct!`, correct === 5 ? 'success' : 'warning');
        }

        // Exercise 2: Drag-and-Drop Matching
        let dragged;
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
                if (dragged.dataset.answer === e.target.dataset.id) {
                    e.target.appendChild(dragged);
                    dragged.classList.add('correct');
                }
            });
        });
        function checkExercise2() {
            let correct = 0;
            document.querySelectorAll('.droppable').forEach(item => {
                const child = item.querySelector('.draggable');
                if (child && child.dataset.answer === item.dataset.id) {
                    correct++;
                    item.classList.add('bg-success', 'text-white');
                } else {
                    item.classList.add('bg-danger', 'text-white');
                }
            });
            document.getElementById('exercise2-feedback').innerHTML = `You got ${correct} out of 4 correct!`;
            showFeedback(`Exercise 2: ${correct}/4 correct!`, correct === 4 ? 'success' : 'warning');
        }

        // Exercise 3: Sentence Ordering
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
                e.target.appendChild(dragged);
            });
        });
        function checkExercise3() {
            let correct = 0;
            document.querySelectorAll('.droppable-sentence').forEach(item => {
                const sentenceId = item.dataset.sentence;
                const correctOrder = document.querySelector(`.sentence-drag-list[data-sentence="${sentenceId}"]`).dataset.correct;
                const droppedWords = Array.from(item.children).map(word => word.textContent).join(' ');
                if (droppedWords === correctOrder) {
                    correct++;
                    item.classList.add('bg-success', 'text-white');
                } else {
                    item.classList.add('bg-danger', 'text-white');
                }
            });
            document.getElementById('exercise3-feedback').innerHTML = `You got ${correct} out of 3 correct!`;
            showFeedback(`Exercise 3: ${correct}/3 correct!`, correct === 3 ? 'success' : 'warning');
        }

        // Exercise 4: Multiple Choice Vocabulary
        function checkExercise4() {
            const answers = ['B', 'A', 'A', 'C'];
            let correct = 0;
            for (let i = 1; i <= 4; i++) {
                const selected = document.querySelector(`input[name="ex4-${i}"]:checked`);
                if (selected && selected.value === answers[i-1]) {
                    correct++;
                    selected.parentElement.classList.add('text-success');
                    selected.parentElement.classList.remove('text-danger');
                } else if (selected) {
                    selected.parentElement.classList.add('text-danger');
                    selected.parentElement.classList.remove('text-success');
                }
            }
            document.getElementById('exercise4-feedback').innerHTML = `You got ${correct} out of 4 correct!`;
            showFeedback(`Exercise 4: ${correct}/4 correct!`, correct === 4 ? 'success' : 'warning');
        }

        // Exercise 5: Fill in the Blank (Mixed Dialects)
        function checkExercise5() {
            const answers = ['komme', 'kommst', 'kimm', 'kommen', 'kommen', 'kommen', 'kimmt', 'kommst'];
            let correct = 0;
            for (let i = 1; i <= 8; i++) {
                const input = document.getElementById(`ex5-${i}`).value.trim().toLowerCase();
                if (input === answers[i-1]) {
                    correct++;
                    document.getElementById(`ex5-${i}`).classList.add('is-valid');
                    document.getElementById(`ex5-${i}`).classList.remove('is-invalid');
                } else {
                    document.getElementById(`ex5-${i}`).classList.add('is-invalid');
                    document.getElementById(`ex5-${i}`).classList.remove('is-valid');
                }
            }
            document.getElementById('exercise5-feedback').innerHTML = `You got ${correct} out of 8 correct!`;
            showFeedback(`Exercise 5: ${correct}/8 correct!`, correct === 8 ? 'success' : 'warning');
        }

        // Exercise 6: Translate and Transform
        function checkExercise6() {
            const answers = [
                'Hey, na, was machst’n?',
                'Ich komm aus München, Mann!',
                'Lass uns mal ’nen Plan machen!',
                'Cool, dich kennst’ lernen!'
            ];
            let correct = 0;
            for (let i = 1; i <= 4; i++) {
                const input = document.getElementById(`ex6-${i}`).value.trim().toLowerCase();
                if (input === answers[i-1].toLowerCase()) {
                    correct++;
                    document.getElementById(`ex6-${i}`).classList.add('is-valid');
                    document.getElementById(`ex6-${i}`).classList.remove('is-invalid');
                } else {
                    document.getElementById(`ex6-${i}`).classList.add('is-invalid');
                    document.getElementById(`ex6-${i}`).classList.remove('is-valid');
                }
            }
            document.getElementById('exercise6-feedback').innerHTML = `You got ${correct} out of 4 correct!`;
            showFeedback(`Exercise 6: ${correct}/4 correct!`, correct === 4 ? 'success' : 'warning');
        }

        // Exercise 7: Create Your Own Dialogue
        function checkExercise7() {
            const dialogue = document.getElementById('ex7-dialogue').value.trim();
            const hasVerb = dialogue.toLowerCase().includes('machen') || dialogue.toLowerCase().includes('kommen') ||
                            dialogue.toLowerCase().includes('mach') || dialogue.toLowerCase().includes('kimm') ||
                            dialogue.toLowerCase().includes('komm') || dialogue.toLowerCase().includes('kimmt');
            const hasGreeting = dialogue.toLowerCase().includes('guten morgen') || dialogue.toLowerCase().includes('hey') ||
                               dialogue.toLowerCase().includes('servus') || dialogue.toLowerCase().includes('grüß di');
            const lines = dialogue.split('\n').length;
            if (hasVerb && hasGreeting && lines >= 4 && lines <= 6) {
                document.getElementById('exercise7-feedback').innerHTML = 'Great job! Your dialogue includes a verb, a greeting, and is the right length!';
                showFeedback('Exercise 7: Well done!', 'success');
                document.getElementById('ex7-dialogue').classList.add('is-valid');
                document.getElementById('ex7-dialogue').classList.remove('is-invalid');
            } else {
                document.getElementById('exercise7-feedback').innerHTML = 'Check your dialogue. Ensure it has a form of "machen" or "kommen", a greeting, and 4-6 lines.';
                showFeedback('Exercise 7: Needs improvement.', 'warning');
                document.getElementById('ex7-dialogue').classList.add('is-invalid');
                document.getElementById('ex7-dialogue').classList.remove('is-valid');
            }
        }

        // Exercise 8: Multiple Choice (Dialect Identification)
        function checkExercise8() {
            const answers = ['C', 'A', 'B', 'D'];
            let correct = 0;
            for (let i = 1; i <= 4; i++) {
                const selected = document.querySelector(`input[name="ex8-${i}"]:checked`);
                if (selected && selected.value === answers[i-1]) {
                    correct++;
                    selected.parentElement.classList.add('text-success');
                    selected.parentElement.classList.remove('text-danger');
                } else if (selected) {
                    selected.parentElement.classList.add('text-danger');
                    selected.parentElement.classList.remove('text-success');
                }
            }
            document.getElementById('exercise8-feedback').innerHTML = `You got ${correct} out of 4 correct!`;
            showFeedback(`Exercise 8: ${correct}/4 correct!`, correct === 4 ? 'success' : 'warning');
        }

        // Exercise 9: Vocabulary Substitution
        function checkExercise9() {
            const answers = {
                'ex9-1-bav': 'servus! was machst’n?',
                'ex9-1-swa': 'grüß di! wie goht’s?',
                'ex9-2-bav': 'i mach mei arbeit.',
                'ex9-2-swa': 'i mach mei sach.',
                'ex9-3-bav': 'woher kimmt’n?',
                'ex9-3-swa': 'wo kommst’n her?',
                'ex9-4-bav': 'jo, des freut mi.',
                'ex9-4-swa': 'jo, des freut mi.'
            };
            let correct = 0;
            for (let i = 1; i <= 4; i++) {
                ['bav', 'swa'].forEach(dialect => {
                    const input = document.getElementById(`ex9-${i}-${dialect}`).value.trim().toLowerCase();
                    if (input === answers[`ex9-${i}-${dialect}`]) {
                        correct++;
                        document.getElementById(`ex9-${i}-${dialect}`).classList.add('is-valid');
                        document.getElementById(`ex9-${i}-${dialect}`).classList.remove('is-invalid');
                    } else {
                        document.getElementById(`ex9-${i}-${dialect}`).classList.add('is-invalid');
                        document.getElementById(`ex9-${i}-${dialect}`).classList.remove('is-valid');
                    }
                });
            }
            document.getElementById('exercise9-feedback').innerHTML = `You got ${correct} out of 8 correct!`;
            showFeedback(`Exercise 9: ${correct}/8 correct!`, correct === 8 ? 'success' : 'warning');
        }

        // Exercise 10: Comprehension and Writing
        function checkExercise10() {
            const answers = [
                'Text 1 ist in einem Café, Text 2 ist eine Hausparty.',
                'Text 1 ist höflich und formell, Text 2 ist locker und freundschaftlich.',
                'Die Leute reden und machen Pläne.'
            ];
            let correct = 0;
            for (let i = 1; i <= 3; i++) {
                const input = document.getElementById(`ex10-${i}`).value.trim().toLowerCase();
                if (input.includes(answers[i-1].toLowerCase())) {
                    correct++;
                    document.getElementById(`ex10-${i}`).classList.add('is-valid');
                    document.getElementById(`ex10-${i}`).classList.remove('is-invalid');
                } else {
                    document.getElementById(`ex10-${i}`).classList.add('is-invalid');
                    document.getElementById(`ex10-${i}`).classList.remove('is-valid');
                }
            }
            const paragraph = document.getElementById('ex10-paragraph').value.trim();
            const paragraphLines = paragraph.split('.').filter(line => line.trim()).length;
            const hasRelevantContent = paragraph.toLowerCase().includes('treffen') || paragraph.toLowerCase().includes('quatschen') || paragraph.toLowerCase().includes('pläne');
            if (paragraphLines >= 3 && paragraphLines <= 4 && hasRelevantContent) {
                correct++;
                document.getElementById('ex10-paragraph').classList.add('is-valid');
                document.getElementById('ex10-paragraph').classList.remove('is-invalid');
            } else {
                document.getElementById('ex10-paragraph').classList.add('is-invalid');
                document.getElementById('ex10-paragraph').classList.remove('is-valid');
            }
            document.getElementById('exercise10-feedback').innerHTML = `You got ${correct} out of 4 correct!`;
            showFeedback(`Exercise 10: ${correct}/4 correct!`, correct === 4 ? 'success' : 'warning');
        }
