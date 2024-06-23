document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const dashboard = document.querySelector('.content');
    sidebar.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });

    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });
    dashboard.addEventListener('click', function(event) {
        if (sidebar.classList.contains('open') && !event.target.closest('.sidebar')) {
            sidebar.classList.remove('open');
        }
    });
});
