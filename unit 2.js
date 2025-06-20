// Ensure script runs after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Normalize Input for Comparison
    function normalizeInput(input) {
        return input.trim().toLowerCase().replace(/[\s.,!?]+/g, ' ').replace(/’/g, "'");
    }

    // Audio Feedback
    function showFeedback(message, type) {
        const feedback = document.getElementById('audio-feedback');
        if (feedback) {
            feedback.textContent = message;
            feedback.className = `alert alert-${type}`;
            feedback.style.display = 'block';
            setTimeout(() => feedback.style.display = 'none', 3000);
        } else {
            console.error('Audio feedback element not found');
        }
    }

    // Tab Functionality
    function openTab(evt, tabName) {
        try {
            // Remove active class from all tabs and links
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));

            // Add active class to selected tab content
            const tabContent = document.getElementById(tabName);
            if (tabContent) {
                tabContent.classList.add('active');
            } else {
                console.error(`Tab content with ID "${tabName}" not found`);
                showFeedback('Error switching tabs. Please try again.', 'danger');
                return;
            }

            // Add active class to clicked tab link
            if (evt.currentTarget) {
                evt.currentTarget.classList.add('active');
            } else {
                console.error('Event target is not valid');
            }
        } catch (error) {
            console.error('Error in openTab:', error);
            showFeedback('Error switching tabs. Please try again.', 'danger');
        }
    }

    // Initialize first tab as active
    const firstTabContent = document.getElementById('dialogues');
    const firstTabLink = document.querySelector('.tab-link[onclick*="dialogues"]');
    if (firstTabContent && firstTabLink) {
        firstTabContent.classList.add('active');
        firstTabLink.classList.add('active');
    }

    // Attach event listeners to tab buttons programmatically
    document.querySelectorAll('.tab-link').forEach(link => {
        const onclick = link.getAttribute('onclick');
        if (onclick && onclick.includes('openTab')) {
            const tabName = onclick.match(/'([^']+)'/)[1];
            link.addEventListener('click', (evt) => openTab(evt, tabName));
        }
    });

    // Exercise 1: Fill in the Blank (Standard German)
    function checkExercise1() {
        const answers = ['mache', 'machst', 'macht', 'machen', 'machen'];
        let correct = 0;
        for (let i = 1; i <= 5; i++) {
            const input = document.getElementById(`ex1-${i}`);
            if (!input) {
                console.error(`Input ex1-${i} not found`);
                continue;
            }
            const value = normalizeInput(input.value);
            if (value === answers[i-1]) {
                correct++;
                input.classList.add('is-valid');
                input.classList.remove('is-invalid');
            } else {
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');
                console.log(`Exercise 1-${i}: Expected "${answers[i-1]}", got "${value}"`);
            }
        }
        document.getElementById('exercise1-feedback').innerHTML = `You got ${correct} out of 5 correct!`;
        showFeedback(`Exercise 1: ${correct}/5 correct!`, correct === 5 ? 'success' : 'warning');
    }

    // Exercise 2: Drag-and-Drop Matching
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
                // Clear previous content in droppable
                while (item.firstChild) {
                    document.getElementById('phrases-list').appendChild(item.firstChild);
                }
                item.appendChild(dragged);
            });
        });
    }
    initializeDragAndDrop();

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

    // Exercise 3: Sentence Ordering
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
                // Ensure word returns to source if dropped elsewhere
                if (!item.contains(dragged)) {
                    sourceList.appendChild(dragged);
                }
            });
        });
    }
    initializeSentenceDragAndDrop();

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
                console.log(`Exercise 3-${sentenceId}: Expected "${correctOrder}", got "${droppedWords}"`);
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

    // Exercise 4: Multiple Choice Vocabulary
    function checkExercise4() {
        const answers = ['B', 'A', 'A', 'C'];
        let correct = 0;
        for (let i = 1; i <= 4; i++) {
            const selected = document.querySelector(`input[name="ex4-${i}"]:checked`);
            const parent = selected ? selected.parentElement : null;
            if (parent) {
                parent.classList.remove('text-success', 'text-danger');
                if (selected.value === answers[i-1]) {
                    correct++;
                    parent.classList.add('text-success');
                } else {
                    parent.classList.add('text-danger');
                    console.log(`Exercise 4-${i}: Expected "${answers[i-1]}", got "${selected.value}"`);
                }
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
            const input = document.getElementById(`ex5-${i}`);
            if (!input) {
                console.error(`Input ex5-${i} not found`);
                continue;
            }
            const value = normalizeInput(input.value);
            if (value === answers[i-1]) {
                correct++;
                input.classList.add('is-valid');
                input.classList.remove('is-invalid');
            } else {
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');
                console.log(`Exercise 5-${i}: Expected "${answers[i-1]}", got "${value}"`);
            }
        }
        document.getElementById('exercise5-feedback').innerHTML = `You got ${correct} out of 8 correct!`;
        showFeedback(`Exercise 5: ${correct}/8 correct!`, correct === 8 ? 'success' : 'warning');
    }

    // Exercise 6: Translate and Transform
    function checkExercise6() {
        const answers = [
            'hey na was machstn',
            'ich komm aus münchen mann',
            'lass uns mal nen plan machen',
            'cool dich kennst lernen'
        ];
        let correct = 0;
        for (let i = 1; i <= 4; i++) {
            const input = document.getElementById(`ex6-${i}`);
            if (!input) {
                console.error(`Input ex6-${i} not found`);
                continue;
            }
            const value = normalizeInput(input.value);
            if (value === answers[i-1]) {
                correct++;
                input.classList.add('is-valid');
                input.classList.remove('is-invalid');
            } else {
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');
                console.log(`Exercise 6-${i}: Expected "${answers[i-1]}", got "${value}"`);
            }
        }
        document.getElementById('exercise6-feedback').innerHTML = `You got ${correct} out of 4 correct!`;
        showFeedback(`Exercise 6: ${correct}/4 correct!`, correct === 4 ? 'success' : 'warning');
    }

    // Exercise 7: Create Your Own Dialogue
    function checkExercise7() {
        const dialogue = document.getElementById('ex7-dialogue');
        if (!dialogue) {
            console.error('Dialogue textarea ex7-dialogue not found');
            return;
        }
        const text = normalizeInput(dialogue.value);
        const hasVerb = text.includes('machen') || text.includes('kommen') || text.includes('mach') ||
                        text.includes('kimm') || text.includes('komm') || text.includes('kimmt');
        const hasGreeting = text.includes('guten morgen') || text.includes('hey') ||
                            text.includes('servus') || text.includes('grüß di');
        const lines = dialogue.value.split('\n').filter(line => line.trim()).length;
        if (hasVerb && hasGreeting && lines >= 4 && lines <= 6) {
            document.getElementById('exercise7-feedback').innerHTML = 'Great job! Your dialogue includes a verb, a greeting, and is the right length!';
            showFeedback('Exercise 7: Well done!', 'success');
            dialogue.classList.add('is-valid');
            dialogue.classList.remove('is-invalid');
        } else {
            let feedback = 'Check your dialogue: ';
            if (!hasVerb) feedback += 'Missing "machen" or "kommen". ';
            if (!hasGreeting) feedback += 'Missing a greeting. ';
            if (lines < 4 || lines > 6) feedback += `Has ${lines} lines, needs 4-6.`;
            document.getElementById('exercise7-feedback').innerHTML = feedback;
            showFeedback('Exercise 7: Needs improvement.', 'warning');
            dialogue.classList.add('is-invalid');
            dialogue.classList.remove('is-valid');
        }
    }

    // Exercise 8: Multiple Choice (Dialect Identification)
    function checkExercise8() {
        const answers = ['C', 'A', 'B', 'D'];
        let correct = 0;
        for (let i = 1; i <= 4; i++) {
            const selected = document.querySelector(`input[name="ex8-${i}"]:checked`);
            const parent = selected ? selected.parentElement : null;
            if (parent) {
                parent.classList.remove('text-success', 'text-danger');
                if (selected.value === answers[i-1]) {
                    correct++;
                    parent.classList.add('text-success');
                } else {
                    parent.classList.add('text-danger');
                    console.log(`Exercise 8-${i}: Expected "${answers[i-1]}", got "${selected.value}"`);
                }
            }
        }
        document.getElementById('exercise8-feedback').innerHTML = `You got ${correct} out of 4 correct!`;
        showFeedback(`Exercise 8: ${correct}/4 correct!`, correct === 4 ? 'success' : 'warning');
    }

    // Exercise 9: Vocabulary Substitution
    function checkExercise9() {
        const answers = {
            'ex9-1-bav': 'servus was machstn',
            'ex9-1-swa': 'grüß di wie gohts',
            'ex9-2-bav': 'i mach mei arbeit',
            'ex9-2-swa': 'i mach mei sach',
            'ex9-3-bav': 'woher kimmt n',
            'ex9-3-swa': 'wo kommst n her',
            'ex9-4-bav': 'jo des freut mi',
            'ex9-4-swa': 'jo des freut mi'
        };
        let correct = 0;
        for (let i = 1; i <= 4; i++) {
            ['bav', 'swa'].forEach(dialect => {
                const input = document.getElementById(`ex9-${i}-${dialect}`);
                if (!input) {
                    console.error(`Input ex9-${i}-${dialect} not found`);
                    return;
                }
                const value = normalizeInput(input.value);
                if (value === answers[`ex9-${i}-${dialect}`]) {
                    correct++;
                    input.classList.add('is-valid');
                    input.classList.remove('is-invalid');
                } else {
                    input.classList.add('is-invalid');
                    input.classList.remove('is-valid');
                    console.log(`Exercise 9-${i}-${dialect}: Expected "${answers[`ex9-${i}-${dialect}`]}", got "${value}"`);
                }
            });
        }
        document.getElementById('exercise9-feedback').innerHTML = `You got ${correct} out of 8 correct!`;
        showFeedback(`Exercise 9: ${correct}/8 correct!`, correct === 8 ? 'success' : 'warning');
    }

    // Exercise 10: Comprehension and Writing
    function checkExercise10() {
        const answers = [
            'text 1 ist in einem café text 2 ist eine hausparty',
            'text 1 ist höflich und formell text 2 ist locker und freundschaftlich',
            'die leute reden und machen pläne'
        ];
        let correct = 0;
        for (let i = 1; i <= 3; i++) {
            const input = document.getElementById(`ex10-${i}`);
            if (!input) {
                console.error(`Input ex10-${i} not found`);
                continue;
            }
            const value = normalizeInput(input.value);
            if (value.includes(answers[i-1])) {
                correct++;
                input.classList.add('is-valid');
                input.classList.remove('is-invalid');
            } else {
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');
                console.log(`Exercise 10-${i}: Expected to include "${answers[i-1]}", got "${value}"`);
            }
        }
        const paragraph = document.getElementById('ex10-paragraph');
        if (paragraph) {
            const text = normalizeInput(paragraph.value);
            const paragraphLines = paragraph.value.split('.').filter(line => line.trim()).length;
            const hasRelevantContent = text.includes('treffen') || text.includes('quatschen') || text.includes('pläne') ||
                                      text.includes('reden') || text.includes('planen') || text.includes('freunde');
            if (paragraphLines >= 3 && paragraphLines <= 4 && hasRelevantContent) {
                correct++;
                paragraph.classList.add('is-valid');
                paragraph.classList.remove('is-invalid');
            } else {
                paragraph.classList.add('is-invalid');
                paragraph.classList.remove('is-valid');
                console.log(`Exercise 10-paragraph: Expected 3-4 lines with relevant content, got ${paragraphLines} lines, content "${text}"`);
            }
        }
        document.getElementById('exercise10-feedback').innerHTML = `You got ${correct} out of 4 correct!`;
        showFeedback(`Exercise 10: ${correct}/4 correct!`, correct === 4 ? 'success' : 'warning');
    }
});
