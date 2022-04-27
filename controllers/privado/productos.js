$(document).ready(function () {
  $('#table-productos').DataTable({
    "info": false,
    "searching": false,
    "dom":
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-5'l><'col-sm-7 d-flex justify-content-end pe-3'p>>",
    "language": {
      "lengthMenu": "Mostrando _MENU_ registros",
      "paginate": {
        "next": '<i class="fa-solid fa-angle-right"></i>',
        "previous": '<i class="fa-solid fa-angle-left"></i>'
      }
    },
    "lengthMenu": [[10, 15, 20, -1], [10, 15, 20, "Todos"]]
  });
});


var input = document.querySelector('.tagify')
var tagify = new Tagify(input, {
  dropdown: {
    enabled: 0
  },
  whitelist: ["Oferta", "Nuevo", "Abril", "Limitado", "Especial", "Descuento"]
})
input = document.querySelector('.tagify1')
var tagify = new Tagify(input, {
  dropdown: {
    enabled: 0
  },
  whitelist: ["Oferta", "Nuevo", "Marzo", "Limitado", "Especial", "Descuento"]
})

Dropzone.options.myDropzone = {
  // Configuration options go here
};

function hoverImagen(ruta) {
  document.getElementById("main-img").src = ruta;
}
