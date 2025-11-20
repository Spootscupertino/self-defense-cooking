document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            // Toggle active classes on both hamburger and menu
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.recipe-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Adjust the multiplier for more/less tilt
            const rotateY = (x / rect.width) * -20; // Tilt left/right
            const rotateX = (y / rect.height) * 20;  // Tilt up/down

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
});
