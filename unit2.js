// Ensure script runs after DOM is fully loaded

// ✅ FIXED CODE

document.addEventListener('DOMContentLoaded', () => { // Normalize Input for Comparison function normalizeInput(input) { return input.trim().toLowerCase().replace(/[\s.,!?]+/g, ' ').replace(/’/g, "'"); }

// Audio Feedback
function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    if (feedback) {
        feedback.textContent = message;
        feedback.className = `alert alert-${type}`;
        feedback.style.display = 'inline-block';
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
        document.querySelectorAll('.tab-item').forEach(item => item.classList.remove('active'));

        // Add active class to selected tab content
        const tabContent = document.getElementById(tabName);
        if (tabContent) {
            tabContent.classList.add('active');
        } else {
            console.error(`Content with ID "${tabName}" not found`);
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
const firstTabLink = document.querySelector('.tab-item[data-tab="dialogues"]');
if (firstTabContent && firstTabLink) {
    firstTabContent.classList.add('active');
    firstTabLink.classList.add('active');
}

// Attach event listeners to tab buttons programmatically
document.querySelectorAll('.tab-item').forEach(link => {
    const tabName = link.getAttribute('data-tab');
    if (tabName) {
        link.addEventListener('click', (evt) => openTab(evt, tabName));
    }
});

// ✅ The rest of your exercises and logic can remain unchanged below this

});

