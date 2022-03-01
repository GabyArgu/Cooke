document.addEventListener('DOMContentLoaded', function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl, {'customClass': 'custom-tooltip'})
    })
  });

  
navPage = document.getElementById('navbar-page');

window.addEventListener('scroll', function () {
    if (window.pageYOffset > 100) {
      navPage.classList.add('shadow');
    } else {
      navPage.classList.remove('shadow');
    }
});