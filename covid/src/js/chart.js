import { fullScreenButton, buttonGroup, globe } from "./buttons.js";
import 'chart.js/dist/Chart.js';
import {getWorldTotal, getDataByCountry} from './api_data.js';

const chartLayout = [
    {
        currentcase: 'total_cases',
        chart_label: 'Total Cases',
        color: '#FD8D3C'
    },
    {
        currentcase:'total_deaths',
        chart_label: 'Total Deaths',
        color: 'rgba(255, 0, 0, 1)'
    },
    {
        currentcase: 'total_recovered',
        chart_label: 'Total Recovered',
        color: '#008000'
    }
]

export default class dataChart {
    constructor() {
        this.block = document.getElementById('chart_block')
        this.chart = document.getElementById('chart').getContext('2d');
        this.charNewObj = null;

        this.createButtons();
    }

    createButtons() {
        let full_screen_button = fullScreenButton();
        full_screen_button.classList.add("full_screen");
        full_screen_button.addEventListener("click", () => {
          this.block.classList.toggle("chart_block");
          this.block.classList.toggle("country_cases_full");
        });
        this.block.append(full_screen_button);
      }

    async createChart(data) {
        if (this.charNewObj) {
            this.charNewObj.destroy();
        }
        
        this.charNewObj = new Chart(this.chart, {
            type: 'bar',
            data: await data,
            options: {
                maintainAspectRatio: false,
                scales: {
                  yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    stacked: true,
                    gridLines: {
                      display: true,
                      color: "rgba(255,99,132,0.2)"
                    }
                  }],
                  xAxes: [{
                    gridLines: {
                      display: false
                    }
                  }]
                }
            }
        });
      }

      async worldTotal(cases = "total_cases") {
        let data = await getWorldTotal();
        let currentcase;
        let values = [];
        let labels = [];

        if (cases === 'TotalConfirmed' || cases === "total_cases") {
            currentcase = 0;
        } else if (cases === 'TotalDeaths') {
            currentcase = 1;
        } else if (cases === 'TotalRecovered') {
            currentcase = 2;
        }

        await data.forEach(el => {
            values.push(el[chartLayout[currentcase].currentcase]);
            let d = new Date(el.last_update)
            let ds = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
            labels.push(ds);
        });
        let dataObj = {
            labels: labels.reverse(),
            datasets: [{
                label: `Global ${chartLayout[currentcase].chart_label}`,
                data: values.reverse(),
                backgroundColor: chartLayout[currentcase].color,
            }]
        };

        this.createChart(dataObj);
      }

      async countryCases(country, cases = "total_cases") {
          let data = await getDataByCountry(country);
          let currentcase;
          let datafield;
          let values = [];
          let labels = [];
  
          if (cases === 'TotalConfirmed' || cases === "total_cases") {
              currentcase = 0;
              datafield = 'Confirmed';
          } else if (cases === 'TotalDeaths') {
              currentcase = 1;
              datafield = 'Deaths';
          } else if (cases === 'TotalRecovered') {
              currentcase = 2;
              datafield = 'Recovered';
          }

          
        await data.forEach(el => {
            values.push(el[datafield]);
            let d = new Date(el.Date)
            let ds = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
            labels.push(ds);
        });
        let dataObj = {
            labels: labels,
            datasets: [{
                label: `${country} ${chartLayout[currentcase].chart_label}`,
                data: values,
                backgroundColor: chartLayout[currentcase].color,
            }]
        };

        this.createChart(dataObj);
      }
}