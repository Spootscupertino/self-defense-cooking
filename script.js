document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-scroll');
    const inputField = document.getElementById('recipe-request');

    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const request = inputField.value.trim();
            if (request) {
                // Formulate the email
                const subject = encodeURIComponent(`Scroll of Request: ${request}`);
                const body = encodeURIComponent(`Sensei,\n\nI seek knowledge on the art of crafting: ${request}\n\nI await your guidance.\n\n- A Dedicated Student`);
                
                // Open mail client
                window.location.href = `mailto:eric@selfdefensecooking.com?subject=${subject}&body=${body}`;
                
                // Visual Feedback on the Scroll
                const originalText = sendBtn.innerHTML;
                sendBtn.innerHTML = "<span class='btn-text'>Scroll Sent!</span>";
                sendBtn.style.backgroundColor = "#4E342E"; // Dark wood color to signify 'sealed'
                
                setTimeout(() => {
                    sendBtn.innerHTML = originalText;
                    sendBtn.style.backgroundColor = ""; 
                    inputField.value = "";
                }, 3000);
            } else {
                // Shake animation for error (simple JS implementation)
                inputField.style.borderBottom = "2px solid #8B0000";
                setTimeout(() => {
                     inputField.style.borderBottom = "2px solid #0d0d0d";
                }, 500);
            }
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
