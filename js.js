let graph = document.getElementById("myGraph").getContext("2d");
let countries = document.getElementById("list-countries");
let request = new XMLHttpRequest();
let myChart = new Chart(graph, {
  type: "line",
  data: {
    labels: [],
    datasets: [],
  },
  options: {
    scales: {
      yAxes: {
        beginAtZero: true,
      },
    },
  },
});

function clk(e) {
  request.open(
    "GET",
    "https://api.covid19api.com/dayone/country/" + e.target.id,
    true
  );
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      let res = JSON.parse(request.response);
      let title = res.map((e) => e.Date.split("T")[0]);
      let confirmed = res.map((e) => e.Confirmed);
      let recovered = res.map((e) => e.Recovered);
      let active = res.map((e) => e.Active);
      let deaths = res.map((e) => e.Deaths);
      let datasets = [
        {
          label: "CONFIRMED",
          data: confirmed,
          borderColor: "#3a8cde",
          backgroundColor: "#3a8cde",
        },
        {
          label: "RECOVERED",
          data: recovered,
          fill: false,
          borderColor: "#009688",
          backgroundColor: "#009688",
          borderWidth: 1,
        },
        {
          label: "DEATHS",
          data: deaths,
          borderColor: "#f44336",
          backgroundColor: "#f44336",
          borderWidth: 1,
        },
        {
          label: "ACTIVE",
          data: active,
          borderColor: "#ffdb12",
          backgroundColor: "#ffdb12",
          borderWidth: 0.5,
        },
      ];
      myChart.data.labels = title;
      myChart.data.datasets = datasets;
      console.log("datasets" + datasets);

      myChart.update();
    }
  };
  request.send();
}

request.open("GET", "https://api.covid19api.com/countries", true);
request.onreadystatechange = function () {
  if (request.readyState == 4 && request.status == 200) {
    let res = JSON.parse(request.response);
    res = res.sort((a, b) => (a.Country > b.Country ? 1 : -1));
    res.forEach((element) => {
      let elem = document.createElement("div");
      elem.setAttribute("id", element.ISO2);
      elem.setAttribute("class", "list");
      elem.innerHTML = element.Country;
      elem.addEventListener("click", clk);
      countries.appendChild(elem);
    });
  }
};
request.send();
