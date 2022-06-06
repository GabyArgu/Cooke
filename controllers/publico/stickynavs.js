

navPage = document.getElementById('navbar-page');

window.addEventListener('scroll', function () {
    if (window.pageYOffset > 100) {
      navPage.classList.add('shadow');
    } else {
      navPage.classList.remove('shadow');
    }
});