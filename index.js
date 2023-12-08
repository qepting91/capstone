document.addEventListener('DOMContentLoaded', function () {
  
    var navbarToggler = document.querySelector('.navbar-toggler');
    var navbarMenu = document.querySelector('.navbar-collapse');

    navbarToggler.addEventListener('click', function () {
        navbarMenu.classList.toggle('active');
    });

    var expandableSections = document.querySelectorAll('.features, .threat-landscape, .cvss-feed');

    expandableSections.forEach(function(section) {
        section.addEventListener('click', function(event) {
            
            if (event.target.tagName !== 'A') {
                var content = section.querySelector('.additional-content');
                content.classList.toggle('expanded');
            }
        });
    });
});