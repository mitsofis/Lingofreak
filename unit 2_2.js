
    // Tab switching
    function openTab(evt, tabName) {
        const tabContents = document.getElementsByClassName("tab-content");
        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].className = tabContents[i].className.replace(" active", "");
        }
        const tabLinks = document.getElementsByClassName("tab-link");
        for (let i = 0; i < tabLinks.length; i++) {
            tabLinks[i].className = tabLinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).className += " active";
        evt.currentTarget.className += " active";
    }

    // Audio playback with feedback
    function speak(text, lang) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.onstart = () => {
            document.getElementById("audio-feedback").innerHTML = '<div class="alert alert-info">Playing audio...</div>';
        };
        utterance.onend = () => {
            document.getElementById("audio-feedback").innerHTML = '<div class="alert alert-success">Audio finished.</div>';
            setTimeout(() => {
                document.getElementById("audio-feedback").innerHTML = "";
            }, 2000);
        };
        utterance.onerror = () => {
            document.getElementById("audio-feedback").innerHTML = '<div class="alert alert-danger">Error playing audio.</div>';
        };
        speechSynthesis.speak(utterance);
    }

    // Utility: Shuffle array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Exercise 1: Fill in the Blank (Standard German)
    function checkExercise1() {
        const answers = ["mache", "machst", "macht", "machen", "machen"];
        let correctCount = 0;
        for (let i = 0; i < answers.length; i++) {
            const input = document.getElementById(`ex1-${i + 1}`).value.trim().toLowerCase();
            if (input === answers[i]) {
                correctCount++;
            }
        }
        document.getElementById("exercise1-feedback").innerHTML = correctCount === answers.length
            ? '<div class="alert alert-success">All correct! Well done!</div>'
            : `<div class="alert alert-warning">Got ${correctCount}/${answers.length} correct. Try again or check solutions.</div>`;
    }

    // Exercise 2: Matching Phrases to Dialects
    function checkExercise2() {
        const droppables = document.querySelectorAll(".droppable");
        let correctCount = 0;
        droppables.forEach((drop) => {
            const droppedItem = drop.querySelector(".draggable");
            if (droppedItem && droppedItem.dataset.answer === drop.dataset.id) {
                correctCount++;
            }
        });
        document.getElementById("exercise2-feedback").innerHTML = correctCount === droppables.length
            ? '<div class="alert alert-success">All matches correct!</div>'
            : `<div class="alert alert-warning">Got ${correctCount}/${droppables.length} correct. Try again or check solutions.</div>`;
    }

    // Exercise 3: Sentence Ordering (Colloquial German)
    function checkExercise3() {
        const dragLists = document.querySelectorAll(".sentence-drag-list");
        const sentences = document.querySelectorAll(".droppable-sentence");
        let correctCount = 0;
        let feedbackDetails = [];

        sentences.forEach((sentence, index) => {
            // Get dropped words
            const words = Array.from(sentence.querySelectorAll(".draggable-word"))
                .map((word) => word.textContent.trim())
                .filter((word) => word.length > 0)
                .join(" ");

            // Get expected sentence
            const correctSentence = dragLists[index].dataset.correct.trim();

            // Normalize strings
            const normalize = (str) => str
                .replace(/\s+/g, " ") // Single spaces
                .replace(/’/g, "'") // Standardize apostrophes
                .replace(/[\u200B-\u200F\uFEFF]/g, "") // Remove zero-width characters
                .toLowerCase()
                .trim();

            const normalizedWords = normalize(words);
            const normalizedCorrect = normalize(correctSentence);

            // Compare
            let isCorrect = normalizedWords === normalizedCorrect;

            if (isCorrect) {
                correctCount++;
            } else {
                feedbackDetails.push({
                    sentence: index + 1,
                    expected: correctSentence,
                    got: words || "(empty)",
                    normalizedExpected: normalizedCorrect,
                    normalizedGot: normalizedWords,
                    charCodesExpected: correctSentence.split("").map(c => c.charCodeAt(0)),
                    charCodesGot: (words || "").split("").map(c => c.charCodeAt(0))
                });
            }
        });

        // Output feedback
        if (correctCount === sentences.length) {
            document.getElementById("exercise3-feedback").innerHTML = 
                '<div class="alert alert-success">All sentences correct!</div>';
        } else {
            document.getElementById("exercise3-feedback").innerHTML = 
                `<div class="alert alert-warning">Got ${correctCount}/${sentences.length} correct. Try again or check solutions.</div>`;
            console.log("Exercise 3 Validation Errors:", feedbackDetails);
            feedbackDetails.forEach(detail => {
                console.log(
                    `Sentence ${detail.sentence}: ` +
                    `Expected "${detail.expected}" (Normalized: "${detail.normalizedExpected}", CharCodes: [${detail.charCodesExpected}]), ` +
                    `Got "${detail.got}" (Normalized: "${detail.normalizedGot}", CharCodes: [${detail.charCodesGot}])`
                );
            });
        }
    }

    // Exercise 3: Reset Function
    function resetExercise3() {
        const dragLists = document.querySelectorAll(".sentence-drag-list");
        const sentences = document.querySelectorAll(".droppable-sentence");

        // Move words back to their respective drag lists
        sentences.forEach((sentence, index) => {
            const words = Array.from(sentence.querySelectorAll(".draggable-word"));
            const dragList = dragLists[index];
            words.forEach((word) => {
                dragList.appendChild(word);
                // Re-enable draggability
                word.draggable = true;
                word.style.display = "inline-block";
                word.style.marginRight = "8px";
                // Reattach drag event listeners
                word.addEventListener("dragstart", (e) => {
                    e.dataTransfer.setData("text/plain", word.id);
                    word.classList.add("dragging");
                });
                word.addEventListener("dragend", () => {
                    word.classList.remove("dragging");
                });
            });
        });

        // Randomize words in each drag list
        randomizeWords();

        // Clear feedback
        document.getElementById("exercise3-feedback").innerHTML = "";
    }

    // Exercise 4: Multiple Choice Vocabulary
    function checkExercise4() {
        const answers = ["Was", "Woher", "Freut", "gudd"];
        let correctCount = 0;
        let unanswered = 0;
        for (let i = 0; i < answers.length; i++) {
            const selected = document.querySelector(`input[name="ex4-${i + 1}"]:checked`);
            if (selected) {
                if (selected.value.toLowerCase() === answers[i].toLowerCase()) {
                    correctCount++;
                }
            } else {
                unanswered++;
            }
        }
        document.getElementById("exercise4-feedback").innerHTML = correctCount === answers.length && unanswered === 0
            ? '<div class="alert alert-success">All correct!</div>'
            : `<div class="alert alert-warning">Got ${correctCount}/${answers.length} correct. ${unanswered > 0 ? `${unanswered} unanswered. ` : ''}Try again or check solutions.</div>`;
    }

    // Exercise 5: Fill in the Blank (Mixed Dialects)
    function checkExercise5() {
        const answers = ["komme", "kommst", "kimm", "kommen", "kommen", "kommen", "kimmt", "gudd"];
        let correctCount = 0;
        for (let i = 0; i < answers.length; i++) {
            const input = document.getElementById(`ex5-${i + 1}`).value.trim().toLowerCase();
            if (input === answers[i]) {
                correctCount++;
            }
        }
        document.getElementById("exercise5-feedback").innerHTML = correctCount === answers.length
            ? '<div class="alert alert-success">All correct! Well done!</div>'
            : `<div class="alert alert-warning">Got ${correctCount}/${answers.length} correct. Try again or check solutions.</div>`;
    }

    // Exercise 6: Translate and Transform (Standard to Colloquial)
    function checkExercise6() {
        const answers = [
            "hey na what machst'n",
            "ich komm aus münchen mann",
            "lass uns mal nen plan machen",
            "cool dich kennenzulernen"
        ];
        let correctCount = 0;
        for (let i = 0; i < answers.length; i++) {
            const input = document.getElementById(`ex6-${i + 1}`).value.trim().toLowerCase().replace(/[!?,]/g, "");
            if (input.includes(answers[i].replace(/[!?,]/g, ""))) {
                correctCount++;
            }
        }
        document.getElementById("exercise6-feedback").innerHTML = correctCount === answers.length
            ? '<div class="alert alert-success">All translations correct!</div>'
            : `<div class="alert alert-warning">Got ${correctCount}/${answers.length} correct. Try again or check solutions.</div>`;
    }

    // Exercise 7: Create Your Own Dialogue (Mixed Dialects)
    function checkExercise7() {
        const dialogue = document.getElementById("ex7-dialogue").value.trim().toLowerCase();
        const hasGreeting = ["guten morgen", "hey", "servus", "grüß di"].some(g => dialogue.includes(g));
        const hasVerb = dialogue.includes("machen") || dialogue.includes("kommen") || dialogue.includes("kimm") || dialogue.includes("kommst");
        if (dialogue.length > 50 && hasGreeting && hasVerb) {
            document.getElementById("exercise7-feedback").innerHTML =
                '<div class="alert alert-success">Great job! Your dialogue looks good!</div>';
        } else {
            document.getElementById("exercise7-feedback").innerHTML =
                '<div class="alert alert-warning">Please include a greeting (e.g., Guten Morgen, Hey, Servus, Grüß di) and a form of “machen” or “kommen”. Try again!</div>';
        }
    }

    // Exercise 8: Multiple Choice (Dialect Identification)
    function checkExercise8() {
        const answers = ["Bavarian", "Standard German", "Colloquial German", "Swabian"];
        let correctCount = 0;
        let unanswered = 0;
        for (let i = 0; i < answers.length; i++) {
            const selected = document.querySelector(`input[name="ex8-${i + 1}"]:checked`);
            if (selected) {
                if (selected.value.toLowerCase() === answers[i].toLowerCase()) {
                    correctCount++;
                }
            } else {
                unanswered++;
            }
        }
        document.getElementById("exercise8-feedback").innerHTML = correctCount === answers.length && unanswered === 0
            ? '<div class="alert alert-success">All correct!</div>'
            : `<div class="alert alert-warning">Got ${correctCount}/${answers.length} correct. ${unanswered > 0 ? `${unanswered} unanswered. ` : ''}Try again or check solutions.</div>`;
    }

    // Exercise 9: Vocabulary Substitution (Regional Dialects)
    function checkExercise9() {
        const answers = [
            "servus was machst'n",
            "grüß di wie goht's",
            "i mach mei arbeit",
            "i mach mei sach",
            "woher kimmt'n",
            "wo kommst'n her",
            "jo des freut mi",
            "jo des freut mi"
        ];
        let correctCount = 0;
        const inputs = [
            "ex9-1-bav", "ex9-1-swa",
            "ex9-2-bav", "ex9-2-swa",
            "ex9-3-bav", "ex9-3-swa",
            "ex9-4-bav", "ex9-4-swa"
        ];
        for (let i = 0; i < answers.length; i++) {
            const input = document.getElementById(inputs[i]).value.trim().toLowerCase().replace(/[!?,]/g, "");
            if (input.includes(answers[i].replace(/[!?,]/g, ""))) {
                correctCount++;
            }
        }
        document.getElementById("exercise9-feedback").innerHTML = correctCount === answers.length
            ? '<div class="alert alert-success">All correct!</div>'
            : `<div class="alert alert-warning">Got ${correctCount}/${answers.length} correct. Try again or check solutions.</div>`;
    }

    // Exercise 10: Comprehension and Writing (Reading-Based)
    function checkExercise10() {
        const answers = [
            document.getElementById("ex10-1").value.trim(),
            document.getElementById("ex10-2").value.trim(),
            document.getElementById("ex10-3").value.trim(),
            document.getElementById("ex10-paragraph").value.trim()
        ];
        const valid = answers.every((answer) => answer.length > 10);
        document.getElementById("exercise10-feedback").innerHTML = valid
            ? '<div class="alert alert-success">Responses look good! Check the example for comparison.</div>'
            : '<div class="alert alert-warning">Please provide complete answers (at least 10 characters each) for all questions and the paragraph.</div>';
    }

    // Drag and Drop for Exercise 2 (Matching Phrases)
    const draggables = document.querySelectorAll(".draggable");
    const droppables = document.querySelectorAll(".droppable");

    draggables.forEach((draggable) => {
        draggable.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", draggable.dataset.answer);
            draggable.classList.add("dragging");
        });
        draggable.addEventListener("dragend", () => {
            draggable.classList.remove("dragging");
        });
    });

    droppables.forEach((droppable) => {
        droppable.addEventListener("dragover", (e) => {
            e.preventDefault();
        });
        droppable.addEventListener("drop", (e) => {
            e.preventDefault();
            const answer = e.dataTransfer.getData("text/plain");
            const draggable = document.querySelector(`.draggable[data-answer="${answer}"]`);
            if (droppable.children.length === 0 && draggable) {
                droppable.appendChild(draggable);
            }
        });
    });

    // Drag and Drop for Exercise 3 (Sentence Ordering)
    function setupDragAndDrop() {
        const draggableWords = document.querySelectorAll(".draggable-word");
        const droppableSentences = document.querySelectorAll(".droppable-sentence");
        const dragLists = document.querySelectorAll(".sentence-drag-list");

        function attachDragEvents(word) {
            word.draggable = true;
            word.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", word.id);
                word.classList.add("dragging");
            });
            word.addEventListener("dragend", () => {
                word.classList.remove("dragging");
            });
        }

        draggableWords.forEach((word) => {
            attachDragEvents(word);
        });

        droppableSentences.forEach((droppable) => {
            droppable.addEventListener("dragover", (e) => {
                e.preventDefault();
            });
            droppable.addEventListener("drop", (e) => {
                e.preventDefault();
                const wordId = e.dataTransfer.getData("text/plain");
                const word = document.querySelector(`.draggable-word[id="${wordId}"]`);
                if (word && !droppable.contains(word)) {
                    droppable.appendChild(word);
                    // Lock word: disable dragging
                    word.draggable = false;
                    word.style.display = "inline-block";
                    word.style.margin = "0 5px";
                    // Remove drag event listeners
                    word.replaceWith(word.cloneNode(true)); // Clone to remove listeners
                    const newWord = droppable.querySelector(`[id="${wordId}"]`);
                    newWord.draggable = false;
                }
            });
        });

        dragLists.forEach((droppable) => {
            droppable.addEventListener("dragover", (e) => {
                e.preventDefault();
            });
            droppable.addEventListener("drop", (e) => {
                e.preventDefault();
                const wordId = e.dataTransfer.getData("text/plain");
                const word = document.querySelector(`.draggable-word[id="${wordId}"]`);
                if (word && !droppable.contains(word)) {
                    droppable.appendChild(word);
                    // Re-enable dragging
                    word.draggable = true;
                    word.style.display = "inline-block";
                    word.style.marginRight = "8px";
                    attachDragEvents(word);
                }
            });
        });
    }

    // Randomize words in each sentence-drag-list
    function randomizeWords() {
        const dragLists = document.querySelectorAll(".sentence-drag-list");
        dragLists.forEach((list) => {
            const words = Array.from(list.querySelectorAll(".draggable-word"));
            const shuffledWords = shuffleArray(words);
            list.innerHTML = "";
            shuffledWords.forEach((word) => {
                list.appendChild(word);
                word.style.display = "inline-block";
                word.style.marginRight = "8px";
                word.draggable = true;
                // Ensure drag events are attached
                word.addEventListener("dragstart", (e) => {
                    e.dataTransfer.setData("text/plain", word.id);
                    word.classList.add("dragging");
                });
                word.addEventListener("dragend", () => {
                    word.classList.remove("dragging");
                });
            });
            console.log(`Randomized words for list: ${shuffledWords.map(w => w.textContent.trim()).join(" ")}`);
        });
    }

    // Initialize unique IDs for draggable words, setup drag-and-drop, and randomize words
    document.querySelectorAll(".draggable-word").forEach((word, index) => {
        if (!word.id) {
            word.id = `word-${index}`;
        }
    });
    setupDragAndDrop();
    randomizeWords();
