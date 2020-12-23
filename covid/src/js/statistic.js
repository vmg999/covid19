/* eslint-disable no-restricted-syntax */
import { getFullScreenButton, buttonGroup, globe } from './buttons';
import { addDigitSeparator } from './functions';

const EarthPopulationR100k = 78270;

export default class StatisticTable {
  constructor(data, parent) {
    this.parent = parent;
    this.data = data;
    this.block = document.getElementById('statistic_table');
    this.elements = {
      region: null,
      table: null,
      buttons: null,
    };
    this.state = {
      region: 'Global',
      period: 'Total',
      stat: 'Absolute',
      divide100k: null,
    };

    this.init();
  }

  init() {
    const { block } = this;

    this.elements.region = document.createElement('div');
    this.elements.region.classList.add('region');

    this.elements.table = document.createElement('div');
    this.elements.table.classList.add('statistic_table_table');

    this.elements.buttons = document.createElement('div');
    this.elements.buttons.classList.add('statistic_table_buttons');

    const fullScreenButton = getFullScreenButton();
    fullScreenButton.classList.add('full_screen');
    fullScreenButton.addEventListener('click', () => {
      block.classList.toggle('statistic_table');
      block.classList.toggle('statistic_table_full');
    });

    block.append(fullScreenButton);
    block.append(this.elements.region);
    block.append(this.elements.table);
    block.append(this.elements.buttons);
  }

  setRegion(region = 'Global') {
    this.elements.region.innerHTML = '';
    const reg = document.createElement('h2');
    reg.textContent = region;
    this.state.region = region;

    if (region === 'Global') {
      this.elements.region.append(reg);
    } else {
      const countryCode = this.findCountry(region).CountryCode;
      const img = document.createElement('img');
      const globeButton = globe();
      globeButton.addEventListener('click', () => {
        this.setRegion('Global');
        this.createTable();
        this.parent.countries.currentCountry = 'Global';
        for (const row of this.parent.countries.table.rows) {
          row.removeAttribute('id');
        }
        this.parent.chart.worldTotal(this.parent.countries.currentStat);
      });
      img.src = `https://www.countryflags.io/${countryCode}/flat/32.png`;
      this.elements.region.innerHTML = '';
      this.elements.region.append(img);
      this.elements.region.append(reg);
      this.elements.region.append(globeButton);
    }
  }

  async createTable() {
    const table = document.createElement('table');
    table.classList.add('table', 'table-dark', 'table-striped');

    const row1 = table.insertRow(0);
    const row2 = table.insertRow(1);
    const row3 = table.insertRow(2);

    const cell1 = row1.insertCell(0);
    const cell2 = row1.insertCell(1);
    const cell3 = row2.insertCell(0);
    const cell4 = row2.insertCell(1);
    const cell5 = row3.insertCell(0);
    const cell6 = row3.insertCell(1);

    cell2.style = 'color: #FD8D3C';
    cell4.style = 'color: red';
    cell6.style = 'color: green';

    cell1.innerText = 'Confirmed';
    cell3.innerText = 'Death';
    cell5.innerText = 'Recovered';

    if (this.state.region === 'Global' && this.state.period === 'Total' && this.state.stat === 'Absolute') {
      cell2.innerText = await addDigitSeparator(this.data.Global.TotalConfirmed);
      cell4.innerText = await addDigitSeparator(this.data.Global.TotalDeaths);
      cell6.innerText = await addDigitSeparator(this.data.Global.TotalRecovered);
    } else if (this.state.region === 'Global' && this.state.period === 'Today' && this.state.stat === 'Absolute') {
      cell2.innerText = await addDigitSeparator(this.data.Global.NewConfirmed);
      cell4.innerText = await addDigitSeparator(this.data.Global.NewDeaths);
      cell6.innerText = await addDigitSeparator(this.data.Global.NewRecovered);
    } else if (this.state.region === 'Global' && this.state.period === 'Total' && this.state.stat === 'By 100k') {
      cell2.innerText = await addDigitSeparator(Math.ceil(this.data.Global.TotalConfirmed
        / EarthPopulationR100k));
      cell4.innerText = await addDigitSeparator(Math.ceil(this.data.Global.TotalDeaths
        / EarthPopulationR100k));
      cell6.innerText = await addDigitSeparator(Math.ceil(this.data.Global.TotalRecovered
        / EarthPopulationR100k));
    } else if (this.state.region === 'Global' && this.state.period === 'Today' && this.state.stat === 'By 100k') {
      cell2.innerText = await addDigitSeparator(Math.ceil(this.data.Global.NewConfirmed
        / EarthPopulationR100k));
      cell4.innerText = await addDigitSeparator(Math.ceil(this.data.Global.NewDeaths
        / EarthPopulationR100k));
      cell6.innerText = await addDigitSeparator(Math.ceil(this.data.Global.NewRecovered
        / EarthPopulationR100k));
    } else if (this.state.region !== 'Global' && this.state.period === 'Total' && this.state.stat === 'Absolute') {
      const data = this.findCountry(this.state.region);
      cell2.innerText = addDigitSeparator(data.TotalConfirmed);
      cell4.innerText = addDigitSeparator(data.TotalDeaths);
      cell6.innerText = addDigitSeparator(data.TotalRecovered);
    } else if (this.state.region !== 'Global' && this.state.period === 'Today' && this.state.stat === 'Absolute') {
      const data = this.findCountry(this.state.region);
      cell2.innerText = addDigitSeparator(data.NewConfirmed);
      cell4.innerText = addDigitSeparator(data.NewDeaths);
      cell6.innerText = addDigitSeparator(data.NewRecovered);
    } else if (this.state.region !== 'Global' && this.state.period === 'Total' && this.state.stat === 'By 100k') {
      const data = this.findCountry(this.state.region);
      cell2.innerText = addDigitSeparator(Math.ceil(data.TotalConfirmed / this.state.divide100k));
      cell4.innerText = addDigitSeparator(Math.ceil(data.TotalDeaths / this.state.divide100k));
      cell6.innerText = addDigitSeparator(Math.ceil(data.TotalRecovered / this.state.divide100k));
    } else if (this.state.region !== 'Global' && this.state.period === 'Today' && this.state.stat === 'By 100k') {
      const data = this.findCountry(this.state.region);
      cell2.innerText = addDigitSeparator(Math.ceil(data.NewConfirmed / this.state.divide100k));
      cell4.innerText = addDigitSeparator(Math.ceil(data.NewDeaths / this.state.divide100k));
      cell6.innerText = addDigitSeparator(Math.ceil(data.NewRecovered / this.state.divide100k));
    }

    this.elements.table.innerHTML = '';
    this.elements.table.append(table);
  }

  findCountry(country) {
    let res;
    this.data.Countries.forEach((el) => {
      if (el.Country === country) {
        res = el;
      }
    });
    return res;
  }

  createButtons() {
    const arr1 = ['Total', 'Today'];
    const arr2 = ['Absolute', 'By 100k'];

    const buttons1 = buttonGroup(arr1);
    const buttons2 = buttonGroup(arr2);

    this.elements.buttons.append(buttons1);
    this.elements.buttons.append(buttons2);

    arr1.forEach((el) => {
      document.getElementById(el).addEventListener('click', () => {
        this.state.period = el;
        this.createTable();
        this.parent.map.createDataLayer();
        this.parent.countries.createTable();
      });
    });

    arr2.forEach((el) => {
      document.getElementById(el).addEventListener('click', () => {
        this.state.stat = el;
        this.createTable();
        this.parent.countries.createTable();
      });
    });
  }
}
