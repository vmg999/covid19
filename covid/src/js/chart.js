/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import { getFullScreenButton } from './buttons';
import 'chart.js/dist/Chart';
import { getWorldTotal, getDataByCountry } from './api_data';

const chartLayout = [
  {
    currentcase: 'total_cases',
    chart_label: 'Total Cases',
    color: '#FD8D3C',
  },
  {
    currentcase: 'total_deaths',
    chart_label: 'Total Deaths',
    color: 'rgba(255, 0, 0, 1)',
  },
  {
    currentcase: 'total_recovered',
    chart_label: 'Total Recovered',
    color: '#008000',
  },
];

export default class dataChart {
  constructor() {
    this.block = document.getElementById('chart_block');
    this.chart = document.getElementById('chart').getContext('2d');
    this.chart.font = '1.5rem Arial bold';
    this.chart.fillStyle = 'red';
    this.chart.textAlign = 'center';
    this.chart.fillText('Please waite...', 150, 50);
    this.charNewObj = null;

    this.createButtons();
  }

  createButtons() {
    const fullScreenButton = getFullScreenButton();
    fullScreenButton.classList.add('full_screen');
    fullScreenButton.addEventListener('click', () => {
      this.block.classList.toggle('chart_block');
      this.block.classList.toggle('country_cases_full');
    });
    this.block.append(fullScreenButton);
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
              beginAtZero: true,
            },
            stacked: true,
            gridLines: {
              display: true,
              color: 'rgba(255,99,132,0.2)',
            },
          }],
          xAxes: [{
            gridLines: {
              display: false,
            },
          }],
        },
      },
    });
  }

  async worldTotal(cases = 'total_cases') {
    const data = await getWorldTotal();
    let currentcase;
    const values = [];
    const labels = [];

    if (cases === 'TotalConfirmed' || cases === 'total_cases') {
      currentcase = 0;
    } else if (cases === 'TotalDeaths') {
      currentcase = 1;
    } else if (cases === 'TotalRecovered') {
      currentcase = 2;
    }

    await data.forEach((el) => {
      values.push(el[chartLayout[currentcase].currentcase]);
      const d = new Date(el.last_update);
      const ds = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
      labels.push(ds);
    });
    const dataObj = {
      labels: labels.reverse(),
      datasets: [{
        label: `Global ${chartLayout[currentcase].chart_label}`,
        data: values.reverse(),
        backgroundColor: chartLayout[currentcase].color,
      }],
    };

    this.createChart(dataObj);
  }

  async countryCases(country, cases = 'total_cases') {
    const data = await getDataByCountry(country);
    let currentcase;
    let datafield;
    const values = [];
    const labels = [];

    if (cases === 'TotalConfirmed' || cases === 'total_cases') {
      currentcase = 0;
      datafield = 'Confirmed';
    } else if (cases === 'TotalDeaths') {
      currentcase = 1;
      datafield = 'Deaths';
    } else if (cases === 'TotalRecovered') {
      currentcase = 2;
      datafield = 'Recovered';
    }

    await data.forEach((el) => {
      values.push(el[datafield]);
      const d = new Date(el.Date);
      const ds = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
      labels.push(ds);
    });
    const dataObj = {
      labels,
      datasets: [{
        label: `${country} ${chartLayout[currentcase].chart_label}`,
        data: values,
        backgroundColor: chartLayout[currentcase].color,
      }],
    };

    this.createChart(dataObj);
  }
}
