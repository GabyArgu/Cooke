$('#owl3').owlCarousel({
    loop:true,
    margin: 5,
    responsiveClass: true,
    autoplay: true,
    autoplayTimeout:2500,
    autoplayHoverPause: true,
    nav: true,
    dots:false,
    responsive: {
        0:{
            items: 1,
        },
        768:{
            items: 2,
        },
        1100:{
            items: 3,
        },
        1400:{
            items: 4,
        }
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