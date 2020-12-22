import { fullScreenButton, buttonGroup, globe } from "./buttons.js";
import 'chart.js/dist/Chart.js';
import {getWorldTotal, getDataByCountry} from './api_data.js';

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
        let chart_label;
        let color;
        let currentcase;
        let values = [];
        let colors = [];
        let labels = [];

        if (cases === 'TotalConfirmed' || cases === "total_cases") {
            currentcase = 'total_cases';
            chart_label = 'Global Total Cases';
            color = '#FD8D3C';
        } else if (cases === 'TotalDeaths') {
            currentcase = 'total_deaths';
            chart_label = 'Global Total Deaths';
            color = 'rgba(255, 0, 0, 1)';
        } else if (cases === 'TotalRecovered') {
            currentcase = 'total_recovered';
            chart_label = 'Global Total Recovered';
            color = 'rgba(0, 255, 0, 1)';
        }

        await data.forEach(el => {
            values.push(el[currentcase]);
            colors.push(color);
            let d = new Date(el.last_update)
            let ds = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
            labels.push(ds);
        });
        let dataObj = {
            labels: labels.reverse(),
            datasets: [{
                label: chart_label,
                data: values.reverse(),
                backgroundColor: colors,
            }]
        };

        this.createChart(dataObj);
      }
}