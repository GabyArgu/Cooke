$('#owl4').owlCarousel({
    loop:true,
    margin: 10,
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
            items: 1,
        },
        1100:{
            items: 2,
        },
        1400:{
            items: 4,
        }
    }
});
$(".my-rating").starRating({
    totalStars: 5,
  starShape: 'rounded',
  starSize: 20,
  disableAfterRate: false,
  emptyColor: 'lightgray',
  hoverColor: '#F7DADF',
  activeColor: '#c34e8b',
  ratedColors: ['#c34e8b', '#c34e8b', '#c34e8b', '#c34e8b', '#c34e8b'],
  useGradient: false
});
navPage = document.getElementById('navbar-page');

window.addEventListener('scroll', function () {
    if (window.pageYOffset > 100) {
      navPage.classList.add('shadow');
    } else {
      navPage.classList.remove('shadow');
    }
});
document.addEventListener('DOMContentLoaded', function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl, {'customClass': 'custom-tooltip'})
    })
  });

  function hoverImagen(ruta){
    document.getElementById("main-img").src=ruta;
  }

  function hoverImagenC(ruta){
    document.getElementById("main-imgC").src=ruta;
  }
