// Ensure script runs after DOM is fully loaded

let dragged;

// Utility: Normalize input for checking function normalizeInput(input) { return input.trim().toLowerCase().replace(/\s+/g, ' ').replace(/’/g, "'"); }

// Audio feedback display function showFeedback(message, type) { const feedback = document.getElementById('feedback'); if (feedback) { feedback.textContent = message; feedback.className = alert alert-${type}; feedback.style.display = 'inline-block'; setTimeout(() => feedback.style.display = 'none', 3000); } }

// Tab functionality function openTab(evt, tabName) { try { document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active')); document.querySelectorAll('.tab-item').forEach(item => item.classList.remove('active'));

const tabContent = document.getElementById(tabName);
    if (tabContent) {
        tabContent.classList.add('active');
    } else {
        console.error(`Content with ID "${tabName}" not found`);
        showFeedback('Error switching tabs. Please try again.', 'danger');
        return;
    }

    if (evt.currentTarget) {
        evt.currentTarget.classList.add('active');
    }
} catch (error) {
    console.error('Error in openTab:', error);
    showFeedback('Error switching tabs. Please try again.', 'danger');
}

}

// Setup tabs on DOM ready

document.addEventListener('DOMContentLoaded', () => { // Initialize first tab const firstTabContent = document.getElementById('dialogues'); const firstTabLink = document.querySelector('.tab-item[data-tab="dialogues"]'); if (firstTabContent && firstTabLink) { firstTabContent.classList.add('active'); firstTabLink.classList.add('active'); }

// Attach click listeners based on data-tab
document.querySelectorAll('.tab-item').forEach(item => {
    const tabName = item.dataset.tab;
    if (tabName) {
        item.addEventListener('click', (evt) => openTab(evt, tabName));
    }
});

// Drag-and-drop initialization for Exercise 2
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

// Drag-and-drop for sentence ordering
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

});

