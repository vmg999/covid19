import { fullScreenButton, buttonGroup } from "./buttons.js";
import { addDigitSeparator } from './functions.js';
import { getCountryPopulationR100k } from './api_data.js';

export default class CountriesTable {
  constructor(data, parent) {
    this.parent = parent;
    this.data = data;
    this.countries = data.Countries;
    this.sortCountries("TotalConfirmed");
    this.id = "country_cases";
    this.table_id = "country_table";
    this.table =  null;
    this.currentStat = null;
    this.search_id = 'search';
    this.search = null;
  }

  async createSearch() {
    this.search = document.createElement('input');
    this.search.classList.add('form-control');
    this.search.setAttribute('type', 'text');
    this.search.setAttribute('placeholder', 'country');

    let table = document.querySelectorAll('.table-row');

    this.search.addEventListener('input', (e) => {
        if (e.target.value !== '') {
            table.forEach((el) => {
                el.classList.remove('hide');
            })
            let re = new RegExp(`${e.target.value}`, 'i');
            table.forEach((el) => {
                if (el.childNodes[1].innerText.search(re) == -1) {
                    el.classList.add('hide');
                }
            })
        } else {
            table.forEach((el) => {
                el.classList.remove('hide');
            })
        }
    })

    document.getElementById(this.search_id).innerHTML = '';
    document.getElementById(this.search_id).append(this.search);
  }

  async sortCountries(order) {
    const ord = order;
    await this.countries.sort((a, b) => {
      if (a[ord] > b[ord]) {
        return -1;
      }
      if (a[ord] < b[ord]) {
        return 1;
      }
      return 0;
    });
  }

  async createTable(value = "Total Confirmed") {
    let tableDiv = document.getElementById(this.table_id);
    this.table = document.createElement("table");
    this.table.classList.add("table", "table-dark", "table-hover");
    const thead = document.createElement("thead");
    const th1 = document.createElement("th");
    const th2 = document.createElement("th");
    const th3 = document.createElement("th");
    th1.textContent = "";
    th2.textContent = "Country";
    th3.textContent = value;
    th1.setAttribute("scope", "col");
    th1.classList.add('table_head');
    th1.style = "width: 10%";
    th2.setAttribute("scope", "col");
    th2.classList.add('table_head');
    th2.style = "width: 55%";
    th3.setAttribute("scope", "col");
    th3.classList.add('table_head');

    thead.append(th1);
    thead.append(th2);
    thead.append(th3);

    this.table.append(thead);

    await this.countries.forEach((el, key) => {
      const row = this.table.insertRow(key);
      row.classList.add('table-row');

      const flag = row.insertCell(0);
      const country = row.insertCell(1);
      country.classList.add('cell');
      const total = row.insertCell(2);

      country.addEventListener('click', (e) => {
        let country = e.target.textContent
        let divider = getCountryPopulationR100k(country);
        divider.then((result)=>{
            this.parent.statistic.state.divide100k = result;
            this.parent.statistic.setRegion(country);
            this.parent.statistic.createTable();
        })
      })

      const img = document.createElement("img");
      img.src = `https://www.countryflags.io/${el.CountryCode}/flat/16.png`;

      flag.append(img);
      country.textContent = el.Country;
      total.textContent = addDigitSeparator(el[value.split(' ').join('')]);
    });


    tableDiv.innerHTML='';
    tableDiv.append(this.table);
    await this.createSearch();
  }

  createButtons() {
    let countries_div = document.getElementById(this.id);
    const arr = ['Total Confirmed', 'Total Deaths', 'Total Recovered'];
    

    let full_screen_button = fullScreenButton();
    full_screen_button.classList.add("full_screen");
    full_screen_button.addEventListener("click", () => {
      countries_div.classList.toggle("country_cases");
      countries_div.classList.toggle("country_cases_full");
    });
    countries_div.append(full_screen_button);

    let statistic_buttons = buttonGroup(arr);
    countries_div.append(statistic_buttons);
    arr.forEach((el) => {
        document.getElementById(el).addEventListener('click', this.addEvents.bind(this));
    })
  }

  addEvents(e) {
    let stat = e.target.id.split(' ').join('');
    if (stat !== this.currentStat) {
        this.sortCountries(stat);
        this.createTable(e.target.id);
        this.parent.chart.worldTotal(stat);
    }
  }

}
