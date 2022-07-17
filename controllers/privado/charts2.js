const graph = document.querySelector("#grafica");
const labels = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const data = {
  labels: labels,
  datasets: [{
    label: 'Ingresos por dia',
    data: [200, 459, 380, 481, 256, 355, 240],
    fill: true,
    borderColor: '#CF71A3',
    backgroundColor: '#CF71A3',
    pointBackgroundColor: "#C34E8B",
    tension: 0.3
  }]
};

const config = {
  type: 'line',
  data: data,
  options: {
    plugins: {
      legend: {
        display: false,
      }
    }
  }
};


new Chart(graph, config);