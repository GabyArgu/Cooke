navbar = document.getElementById('navbar-home');

window.addEventListener('scroll', function () {
    if (window.pageYOffset > 86) {
      navbar.classList.add('shrink', 'shadow');
    } else {
      navbar.classList.remove('shrink', 'shadow');
    }
});

navPage = document.getElementById('navbar-page');

window.addEventListener('scroll', function () {
    if (window.pageYOffset > 100) {
      navPage.classList.add('shadow');
    } else {
      navPage.classList.remove('shadow');
    }
});