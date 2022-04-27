document.addEventListener('DOMContentLoaded', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, { 'customClass': 'custom-tooltip' })
    })

    var carousel = document.querySelector('#carouselExampleCaptions');
    var bootstrapCarousel = new bootstrap.Carousel(carousel, {interval:3000});
});

$('#owl0').owlCarousel({
    loop: true,
    margin: 5,
    responsiveClass: true,
    autoplay: true,
    autoplayTimeout: 2500,
    autoplayHoverPause: true,
    nav: true,
    dots: false,
    responsive: {
        0: {
            items: 1,
        },
        768: {
            items: 2,
        },
        1100: {
            items: 3,
        },
        1400: {
            items: 4,
        }
    }
});

$('#owl1').owlCarousel({
    loop: true,
    margin: 20,
    responsiveClass: true,
    autoplay: true,
    autoplayTimeout: 2500,
    autoplayHoverPause: true,
    nav: true,
    dots: false,
    responsive: {
        0: {
            items: 1,
        },
        768: {
            items: 1,
        },
        1100: {
            items: 2,
        },
        1400: {
            items: 3,
        }
    }
});

$('#owl2').owlCarousel({
    loop: true,
    margin: 30,
    responsiveClass: true,
    autoplay: true,
    autoplayTimeout: 2500,
    autoplayHoverPause: true,
    nav: true,
    dots: false,
    responsive: {
        0: {
            items: 1,
        },
        768: {
            items: 1,
        },
        1100: {
            items: 2,
        },
        1400: {
            items: 3,
        }
    }
});

$('#owl3').owlCarousel({
    loop: true,
    margin: 30,
    responsiveClass: true,
    autoplay: true,
    autoplayTimeout: 2500,
    autoplayHoverPause: true,
    nav: true,
    dots: false,
    responsive: {
        0: {
            items: 1,
        },
        768: {
            items: 1,
        },
        1100: {
            items: 2,
        },
        1400: {
            items: 3,
        }
    }
});



function hoverImagen(ruta) {
    
    document.getElementById("main-img").src = ruta;
}

const navbar = document.getElementById('navbar-home');
let navbarCollapse = document.getElementById('navbarNavDropdown');

window.addEventListener('scroll', function () {
    if (window.pageYOffset > 86) {
        navbar.classList.add('shrink', 'shadow');
    } else {
        if(!navbar.classList.contains("activado")){
            navbar.classList.remove('shrink', 'shadow');
        }
    }
});


function navbarResponsive(){
    navbar.classList.toggle('activado');
    if(navbar.classList.contains("activado") || window.pageYOffset > 86){
        navbar.classList.add('shrink');
    }else{
        navbar.classList.remove('shrink');
    }
}

