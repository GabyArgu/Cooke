

// $(document).ready(function () {
//   $('#table-productos').DataTable({
//       "info": false,
//       "searching": false,
//       "dom":
//           "<'row'<'col-sm-12'tr>>" +
//           "<'row'<'col-sm-2 text-center'l><'col-sm-10'p>>",
//       "language": {
//           "lengthMenu": "Mostrando _MENU_ registros",
//           "paginate": {
//               "next": '<i class="bi bi-arrow-right-short"></i>',
//               "previous": '<i class="bi bi-arrow-left-short"></i>'
//           }
//       },
//       "lengthMenu": [[10, 15, 20, -1], [10, 15, 20, "Todos"]]
//   });
// });

var input = document.querySelector('.tagify')
var tagify = new Tagify(input, {
  dropdown: {
    enabled: 0
  },
  whitelist: ["Oferta", "Nuevo", "Marzo", "Limitado", "Especial", "Descuento"]
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
  