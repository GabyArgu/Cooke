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
  