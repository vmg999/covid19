import { fullScreenButton, buttonGroup } from "./buttons.js";
import { addDigitSeparator } from './functions.js';
import { getCountryPopulationR100k } from './api_data.js';

export default class CountriesTable {
  constructor(data) {
    this.data = data;
    this.countries = data.Countries;
    this.sortCountries("TotalConfirmed");
    this.id = "country_cases";
    this.table_id = "country_table";
    this.table = {
      table: null,
      thead: null,
    },
    this.currentStat = null
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
    let { table } = this.table;
    table = document.createElement("table");
    table.classList.add("table", "table-dark", "table-hover");
    const thead = document.createElement("thead");
    const th1 = document.createElement("th");
    const th2 = document.createElement("th");
    const th3 = document.createElement("th");
    th1.textContent = "";
    th2.textContent = "Country";
    th3.textContent = value;
    th1.setAttribute("scope", "col");
    th1.classList.add('table_head');
    th2.setAttribute("scope", "col");
    th2.classList.add('table_head');
    th3.setAttribute("scope", "col");
    th3.classList.add('table_head');

    thead.append(th1);
    thead.append(th2);
    thead.append(th3);

    table.append(thead);

    await this.countries.forEach((el, key) => {
      const row = table.insertRow(key);

      const flag = row.insertCell(0);
      const country = row.insertCell(1);
      country.classList.add('cell');
      const total = row.insertCell(2);

      country.addEventListener('click', (e) => {
        let country = e.target.textContent
        let divider = getCountryPopulationR100k(country);
        divider.then((result)=>{
            console.log(country);
            console.log(result);
        })
      })

      const img = document.createElement("img");
      img.src = `https://www.countryflags.io/${el.CountryCode}/flat/16.png`;

      flag.append(img);
      country.textContent = el.Country;
      total.textContent = addDigitSeparator(el[value.split(' ').join('')]);
    });

    tableDiv.innerHTML='';
    await tableDiv.append(table);
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
    }
  }

}
