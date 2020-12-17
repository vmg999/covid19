export default class CountriesTable {
  constructor(data, divId) {
    this.data = data;
    this.countries = data.Countries;
    this.sortCountries("TotalConfirmed");
    this.id = divId;
    this.table = {
      table: null,
      thead: null,
    };
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

  async createTable() {
    let tableDiv = document.getElementById(this.id);
    let { table } = this.table;
    table = document.createElement("table");
    table.classList.add("table", "table-dark", "table-hover");
    const thead = document.createElement("thead");
    const th1 = document.createElement("th");
    const th2 = document.createElement("th");
    const th3 = document.createElement("th");
    th1.textContent = "";
    th2.textContent = "Country";
    th3.textContent = "Total Confirmed";
    th1.setAttribute('scope','col');
    th2.setAttribute('scope','col');
    th3.setAttribute('scope','col');

    thead.append(th1);
    thead.append(th2);
    thead.append(th3);

    table.append(thead);

    await this.countries.forEach(el => {
        const row = table.insertRow(-1);

        const flag = row.insertCell(0);
        const country = row.insertCell(1);
        const total = row.insertCell(2);

        const img = document.createElement('img');
        img.src = `https://www.countryflags.io/${el.CountryCode}/flat/24.png`;

        flag.append(img);
        country.textContent = el.Country;
        total.textContent = el.TotalConfirmed;

    });

    await tableDiv.append(table);

  }
}
