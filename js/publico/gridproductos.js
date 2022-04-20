document.addEventListener('DOMContentLoaded', function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl, {'customClass': 'custom-tooltip'})
    })
  });

function hoverImagen(ruta){
  document.getElementById("main-img").src=ruta;
}
