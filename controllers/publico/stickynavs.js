window.addEventListener('scroll', function () {
  navPage = document.getElementById('navbar-page');
    if (window.pageYOffset > 100) {
      navPage.classList.add('shadow');
    } else {
      navPage.classList.remove('shadow');
    }
});