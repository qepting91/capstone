// Event listener for the navbar toggle
document.querySelector('.navbar-toggler').addEventListener('click', function() {
    document.querySelector('.navbar-collapse').classList.toggle('active');
});

// Event listeners for expanding and collapsing sections
document.querySelectorAll('.search, .cvss-feed, .threat-landscape, .features').forEach(item => {
    item.addEventListener('click', () => {
        // Check if the clicked box is already open
        const isOpen = item.classList.contains('expanded');

        // Close all open boxes
        document.querySelectorAll('.cvss-feed, .threat-landscape, .features').forEach(content => {
            content.classList.remove('expanded'); 
            let additionalContent = content.querySelector('.additional-content');
            if (additionalContent) {
                additionalContent.style.display = 'none';
            }
        });

        // If the clicked box was not open, open it
        if (!isOpen) {
            item.classList.add('expanded'); 
            let additionalContent = item.querySelector('.additional-content');
            if (additionalContent) {
                additionalContent.style.display = 'block'; 
            }
        }
    });
});