/* eslint-disable no-restricted-syntax */
import {
  getFullScreenButton, buttonGroup, keyboardButton, resetInput,
} from './buttons';
import { addDigitSeparator } from './functions';
import { getCountryPopulationDividedBy100k } from './api_data';

export default class CountriesTable {
  constructor(data, parent) {
    this.block = document.getElementById('search');
    this.parent = parent;
    this.data = data;
    this.countries = data.Countries;
    this.sortCountries('TotalConfirmed');
    this.id = 'country_cases';
    this.table_id = 'country_table';
    this.table = null;
    this.currentCountry = 'Global';
    this.search = null;
    this.keyboardButton = keyboardButton();
    this.resetInput = resetInput();
    this.currentStat = 'TotalConfirmed';
    this.period = 'Total';
    this.statistic = 'Absolute';
  }

  async createSearch() {
    this.search = document.createElement('input');
    this.search.classList.add('form-control', 'search');
    this.search.setAttribute('type', 'text');
    this.search.setAttribute('placeholder', 'country');
    const event = new Event('input', {
      bubbles: true,
      cancelable: true,
    });

    const table = document.querySelectorAll('.table-row');

    this.search.addEventListener('input', (e) => {
      if (e.target.value !== '') {
        table.forEach((el) => {
          el.classList.remove('hide');
        });
        const re = new RegExp(`${e.target.value}`, 'i');
        table.forEach((el) => {
          if (el.childNodes[1].innerText.search(re) === -1) {
            el.classList.add('hide');
          }
        });
      } else {
        table.forEach((el) => {
          el.classList.remove('hide');
        });
      }
    });

    this.resetInput.addEventListener('click', () => {
      this.search.value = '';
      this.search.dispatchEvent(event);
    });

    this.block.innerHTML = '';
    this.block.append(this.keyboardButton);
    this.block.append(this.search);
    this.block.append(this.resetInput);
  }

  sortCountries(order) {
    const ord = order;
    this.countries.sort((a, b) => {
      if (a[ord] > b[ord]) {
        return -1;
      }
      if (a[ord] < b[ord]) {
        return 1;
      }
      return 0;
    });
  }

  async createTable() {
    this.period = this.parent.statistic.state.period;
    this.statistic = this.parent.statistic.state.stat;
    let field;
    let columnHead;

    if (this.currentStat === 'TotalConfirmed' && this.period === 'Total' && this.statistic === 'Absolute') {
      field = 'TotalConfirmed';
      columnHead = 'Total Confirmed';
    } else if (this.currentStat === 'TotalDeaths' && this.period === 'Total' && this.statistic === 'Absolute') {
      field = 'TotalDeaths';
      columnHead = 'Total Deaths';
    } else if (this.currentStat === 'TotalRecovered' && this.period === 'Total' && this.statistic === 'Absolute') {
      field = 'TotalRecovered';
      columnHead = 'Total Recovered';
    } else if (this.currentStat === 'TotalConfirmed' && this.period === 'Today' && this.statistic === 'Absolute') {
      field = 'NewConfirmed';
      columnHead = 'Today Confirmed';
    } else if (this.currentStat === 'TotalDeaths' && this.period === 'Today' && this.statistic === 'Absolute') {
      field = 'NewDeaths';
      columnHead = 'Today Deaths';
    } else if (this.currentStat === 'TotalRecovered' && this.period === 'Today' && this.statistic === 'Absolute') {
      field = 'NewRecovered';
      columnHead = 'Today Recovered';
    } else if (this.currentStat === 'TotalConfirmed' && this.period === 'Total' && this.statistic === 'By 100k') {
      field = 'TotalConfirmed';
      columnHead = 'Total Conf./100k';
    } else if (this.currentStat === 'TotalDeaths' && this.period === 'Total' && this.statistic === 'By 100k') {
      field = 'TotalDeaths';
      columnHead = 'Total Deaths/100k';
    } else if (this.currentStat === 'TotalRecovered' && this.period === 'Total' && this.statistic === 'By 100k') {
      field = 'TotalRecovered';
      columnHead = 'Total Recov./100k';
    } else if (this.currentStat === 'TotalConfirmed' && this.period === 'Today' && this.statistic === 'By 100k') {
      field = 'NewConfirmed';
      columnHead = 'Today Conf./100k';
    } else if (this.currentStat === 'TotalDeaths' && this.period === 'Today' && this.statistic === 'By 100k') {
      field = 'NewDeaths';
      columnHead = 'Today Deaths/100k';
    } else if (this.currentStat === 'TotalRecovered' && this.period === 'Today' && this.statistic === 'By 100k') {
      field = 'NewRecovered';
      columnHead = 'Today Recov./100k';
    }

    const tableDiv = document.getElementById(this.table_id);
    this.table = document.createElement('table');
    this.table.classList.add('table', 'table-dark', 'table-hover');
    const thead = document.createElement('thead');
    const th1 = document.createElement('th');
    const th2 = document.createElement('th');
    const th3 = document.createElement('th');
    th1.textContent = '';
    th2.textContent = 'Country';
    th3.textContent = columnHead;
    th1.setAttribute('scope', 'col');
    th1.classList.add('table_head');
    th1.style = 'width: 10%';
    th2.setAttribute('scope', 'col');
    th2.classList.add('table_head');
    th2.style = 'width: 55%';
    th3.setAttribute('scope', 'col');
    th3.classList.add('table_head');

    thead.append(th1);
    thead.append(th2);
    thead.append(th3);

    this.table.append(thead);

    await this.countries.forEach(async (el, key) => {
      const row = this.table.insertRow(key);
      row.classList.add('table-row');

      const flag = row.insertCell(0);
      const country = row.insertCell(1);
      country.classList.add('cell');
      if (this.currentCountry === el.Country) {
        row.setAttribute('id', 'active');
      }
      const total = row.insertCell(2);

      country.addEventListener('click', async (e) => {
        const curCountry = e.target.textContent;
        if (this.currentCountry !== curCountry) {
          for (const Row of this.table.rows) {
            Row.removeAttribute('id');
          }
          this.currentCountry = curCountry;
          const divider = await getCountryPopulationDividedBy100k(curCountry);
          this.parent.statistic.state.divide100k = divider;
          this.parent.statistic.setRegion(curCountry);
          this.parent.statistic.createTable();

          this.parent.chart.countryCases(curCountry, this.currentStat);

          row.setAttribute('id', 'active');
        } else if (this.currentCountry === curCountry) {
          this.currentCountry = 'Global';
          this.parent.statistic.setRegion('Global');
          this.parent.statistic.createTable();
          this.parent.chart.worldTotal(this.currentStat);

          row.removeAttribute('id');
        }
      });

      const img = document.createElement('img');
      img.src = `https://www.countryflags.io/${el.CountryCode}/flat/16.png`;

      flag.append(img);
      country.textContent = el.Country;
      if (this.statistic === 'By 100k') {
        try {
          const divider = await getCountryPopulationDividedBy100k(el.Country);
          total.textContent = addDigitSeparator(Math.ceil(el[field] / divider));
        } catch (err) {
          total.textContent = 'No data';
        }
      } else {
        total.textContent = addDigitSeparator(el[field]);
      }
    });

    tableDiv.innerHTML = '';
    tableDiv.append(this.table);
    await this.createSearch();
  }

  createButtons() {
    const countriesDiv = document.getElementById(this.id);
    const arr = ['Total Confirmed', 'Total Deaths', 'Total Recovered'];

    const fullScreenButton = getFullScreenButton();
    fullScreenButton.classList.add('full_screen');
    fullScreenButton.addEventListener('click', () => {
      countriesDiv.classList.toggle('country_cases');
      countriesDiv.classList.toggle('country_cases_full');
    });
    countriesDiv.append(fullScreenButton);

    const statisticButtons = buttonGroup(arr);
    statisticButtons.classList.add('firstplan');
    countriesDiv.append(statisticButtons);
    arr.forEach((el) => {
      document.getElementById(el).addEventListener('click', this.addEvents.bind(this));
    });
  }

  addEvents(e) {
    const stat = e.target.id.split(' ').join('');
    if (stat !== this.currentStat) {
      this.currentStat = stat;
      this.sortCountries(stat);
      this.createTable();
      if (this.currentCountry !== 'Global') {
        this.parent.chart.countryCases(this.currentCountry, stat);
      } else {
        this.parent.chart.worldTotal(stat);
      }

      this.parent.map.createDataLayer();
    }
  }
}
