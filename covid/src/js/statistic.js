import { fullScreenButton, buttonGroup, globe } from "./buttons.js";
import { addDigitSeparator } from './functions.js';

const EarthPopulationR100k = 78270;

export default class StatisticTable {
  constructor(data) {
    this.data = data;
    this.block = document.getElementById("statistic_table");
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
    let block = this.block;

    this.elements.region = document.createElement("div");
    this.elements.region.classList.add("region");

    this.elements.table = document.createElement("div");
    this.elements.table.classList.add("statistic_table_table");

    this.elements.buttons = document.createElement("div");
    this.elements.buttons.classList.add("statistic_table_buttons");

    let full_screen_button = fullScreenButton();
    full_screen_button.classList.add("full_screen");
    full_screen_button.addEventListener("click", () => {
      block.classList.toggle("statistic_table");
      block.classList.toggle("country_cases_full");
    });

    block.append(full_screen_button);
    block.append(this.elements.region);
    block.append(this.elements.table);
    block.append(this.elements.buttons);
  }

  setRegion(region = "Global") {
    this.elements.region.innerHTML = '';
    let reg = document.createElement("h2");
    reg.textContent = region;
    this.state.region = region;

    if (region == "Global") {
      this.elements.region.append(reg);
    } else {
      const country_code = this.findCountry(region).CountryCode;
      const img = document.createElement("img");
      const globe_button = globe();
      globe_button.addEventListener('click', () => {
          this.setRegion('Global');
          this.createTable();
      })
      img.src = `https://www.countryflags.io/${country_code}/flat/32.png`;
      this.elements.region.innerHTML = '';
      this.elements.region.append(img);
      this.elements.region.append(reg);
      this.elements.region.append(globe_button);
    }
  }

  async createTable() {
    let table = document.createElement("table");
    table.classList.add("table", "table-dark", "table-striped");

    const row1 = table.insertRow(0);
    const row2 = table.insertRow(1);
    const row3 = table.insertRow(2);

    const cell1 = row1.insertCell(0);
    const cell2 = row1.insertCell(1);
    const cell3 = row2.insertCell(0);
    const cell4 = row2.insertCell(1);
    const cell5 = row3.insertCell(0);
    const cell6 = row3.insertCell(1);

    cell2.style = 'color: yellow';
    cell4.style = 'color: red';
    cell6.style = 'color: green';

    cell1.innerText = 'Confirmed';
    cell3.innerText = 'Death';
    cell5.innerText = 'Recovered';

    if (this.state.region == 'Global' && this.state.period == 'Total' && this.state.stat == 'Absolute') {
        cell2.innerText = await addDigitSeparator(this.data.Global.TotalConfirmed);
        cell4.innerText = await addDigitSeparator(this.data.Global.TotalDeaths);
        cell6.innerText = await addDigitSeparator(this.data.Global.TotalRecovered);
    } else if (this.state.region == 'Global' && this.state.period == 'Today' && this.state.stat == 'Absolute') {
        cell2.innerText = await addDigitSeparator(this.data.Global.NewConfirmed);
        cell4.innerText = await addDigitSeparator(this.data.Global.NewDeaths);
        cell6.innerText = await addDigitSeparator(this.data.Global.NewRecovered);
    } else if (this.state.region == 'Global' && this.state.period == 'Total' && this.state.stat == 'By 100k') {
        cell2.innerText = await addDigitSeparator(Math.ceil(this.data.Global.TotalConfirmed / EarthPopulationR100k));
        cell4.innerText = await addDigitSeparator(Math.ceil(this.data.Global.TotalDeaths / EarthPopulationR100k));
        cell6.innerText = await addDigitSeparator(Math.ceil(this.data.Global.TotalRecovered / EarthPopulationR100k));
    } else if (this.state.region == 'Global' && this.state.period == 'Today' && this.state.stat == 'By 100k') {
        cell2.innerText = await addDigitSeparator(Math.ceil(this.data.Global.NewConfirmed / EarthPopulationR100k));
        cell4.innerText = await addDigitSeparator(Math.ceil(this.data.Global.NewDeaths / EarthPopulationR100k));
        cell6.innerText = await addDigitSeparator(Math.ceil(this.data.Global.NewRecovered / EarthPopulationR100k));
    } else if (this.state.region !== 'Global' && this.state.period == 'Total' && this.state.stat == 'Absolute') {
        let data = this.findCountry(this.state.region);
        cell2.innerText = addDigitSeparator(data.TotalConfirmed);
        cell4.innerText = addDigitSeparator(data.TotalDeaths);
        cell6.innerText = addDigitSeparator(data.TotalRecovered);
    } else if (this.state.region !== 'Global' && this.state.period == 'Today' && this.state.stat == 'Absolute') {
        let data = this.findCountry(this.state.region);
        cell2.innerText = addDigitSeparator(data.NewConfirmed);
        cell4.innerText = addDigitSeparator(data.NewDeaths);
        cell6.innerText = addDigitSeparator(data.NewRecovered);
    } else if (this.state.region !== 'Global' && this.state.period == 'Total' && this.state.stat == 'By 100k') {
        let data = this.findCountry(this.state.region);
        cell2.innerText = addDigitSeparator(Math.ceil(data.TotalConfirmed / this.state.divide100k));
        cell4.innerText = addDigitSeparator(Math.ceil(data.TotalDeaths / this.state.divide100k));
        cell6.innerText = addDigitSeparator(Math.ceil(data.TotalRecovered / this.state.divide100k));
    } else if (this.state.region !== 'Global' && this.state.period == 'Today' && this.state.stat == 'By 100k') {
        let data = this.findCountry(this.state.region);
        cell2.innerText = addDigitSeparator(Math.ceil(data.NewConfirmed / this.state.divide100k));
        cell4.innerText = addDigitSeparator(Math.ceil(data.NewDeaths / this.state.divide100k));
        cell6.innerText =  addDigitSeparator(Math.ceil(data.NewRecovered / this.state.divide100k));
    }



    this.elements.table.innerHTML = '';
    this.elements.table.append(table);

  }

  findCountry(country) {
    let res;
    this.data.Countries.forEach((el) => {
        if (el.Country == country) {
            res = el;
        }
    })
    return res;
  }

  createButtons (){
    const arr1 = ['Total', 'Today'];
    const arr2 = ['Absolute', 'By 100k'];

    let buttons1 = buttonGroup(arr1);
    let buttons2 = buttonGroup(arr2);

    this.elements.buttons.append(buttons1);
    this.elements.buttons.append(buttons2);

    arr1.forEach((el) => {
        document.getElementById(el).addEventListener('click', () => {
            this.state.period = el;
            this.createTable();
        });
    })

    arr2.forEach((el) => {
        document.getElementById(el).addEventListener('click', () => {
            this.state.stat = el;
            this.createTable();
        });
    })
  }
}
