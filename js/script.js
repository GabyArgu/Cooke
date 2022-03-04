$('#owl0').owlCarousel({
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

$('#owl1').owlCarousel({
    loop:true,
    margin: 20,
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
            items: 3,
        }
    }
});

$('#owl2').owlCarousel({
    loop:true,
    margin: 30,
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
            items: 3,
        }
    }
});

$('#owl3').owlCarousel({
    loop:true,
    margin: 30,
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
            items: 3,
        }
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
