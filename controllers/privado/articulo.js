$(document).ready(function () {
    $('#table-articulo').DataTable({
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