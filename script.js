document.addEventListener('DOMContentLoaded', () => {
    const drawer = document.getElementById('email-drawer');
    const handle = document.querySelector('.drawer-handle');

    if (drawer && handle) {
        handle.addEventListener('click', () => {
            drawer.classList.toggle('open');
        });
    }
});
