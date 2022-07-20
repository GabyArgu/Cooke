/* globals Chart:false, feather:false */

(function () {
  'use strict'

  feather.replace({ 'aria-hidden': 'true' })

  // Graphs
  var ctx = document.getElementById('myChart');


  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domigo'],
      datasets: [
        {
          data: [339, 345, 483, 353, 489, 292, 334],
          label: 'Cocina',
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: "#E6006D",
          borderWidth: 4,
          pointBackgroundColor: "#E6006D",
          lineTension: 0.5
        },
        {
          data: [255, 260, 350, 290, 133, 432, 234],
          label: 'Utencilios',
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: "#F794A6",
          borderWidth: 4,
          pointBackgroundColor: "#F794A6",
          lineTension: 0.5
        },
        {
          data: [210, 200, 150, 220, 303, 332, 204],
          label: 'Recetas',
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: "#F764B2",
          borderWidth: 4,
          pointBackgroundColor: "#F764B2",
          lineTension: 0.5
        },
        {
          data: [130, 230, 290, 120, 403, 182, 174],
          label: 'Electrodomesticos',
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: "#FFCFD3",
          borderWidth: 4,
          pointBackgroundColor: "#FFCFD3",
          lineTension: 0.5
        }
      ],

    },
    options: {
      scales: {
        y: {
          ticks: {
            beginAtZero: false,
            color: '#D683AD'
          },
          grid: {
            drawBorder: false,
            color: "#75365a"
          }
        },
        x: {
          ticks: {
            beginAtZero: false,
            color: '#FBD5E5'
          },
          grid: {
            drawBorder: false,
            color: "#75365a"
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#C44E8C'
          }
        }
      }
    }

  })

  var data = {
    labels: [
      "Cocina",
      "Utensilios",
      "Recetas",
      "Electrodomestidos"
    ],
    datasets: [
      {
        data: [170, 50, 70, 90],
        backgroundColor: [
          "#F0B2D0",
          "#F7BFD8",
          "#FBD5E5",
          "#FDEAF2"
        ],
        hoverBackgroundColor: [
          "#DF92B2",
          "#E2AFC5",
          "#FABEC0",
          "#FBC5FF"
        ]
      }]
  };
  var promisedDeliveryChart = new Chart(document.getElementById('myChart2'), {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      legend: {
        display: false
      }
    }

  });

})()
