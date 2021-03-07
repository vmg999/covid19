export default async function getData() {
  if (localStorage.summaryData === undefined) {
    localStorage.setItem('summaryData', null);
    localStorage.setItem('summaryDataUpdate', Date.now());
  }

  if (localStorage.summaryData === 'null' || Date.now() > (+localStorage.summaryDataUpdate + 60000)) {
    let resp;
    try {
      const response = await fetch('https://api.covid19api.com/summary', { mode: 'cors' });
      resp = await response.json();
      if (resp.Message !== 'Caching in progress') {
        localStorage.summaryData = JSON.stringify(resp);
        localStorage.summaryDataUpdate = Date.now();
      } else if (resp.Message === 'Caching in progress' && localStorage.summaryData !== 'null') {
        return JSON.parse(localStorage.summaryData);
      }
    } catch (e) {
      resp = (await fetch('api-data/summary.json')).json();
    }
    return resp;
  }
  return JSON.parse(localStorage.summaryData);
}

export async function getDataByCountry(country) {
  const response = await fetch(`https://api.covid19api.com/total/country/${country}`, { mode: 'cors' });
  const resp = await response.json();
  return resp;
}

export async function getWorldTotal() {
  if (localStorage.WorldTotalData === undefined) {
    localStorage.setItem('WorldTotalData', null);
    localStorage.setItem('WorldTotalDataUpdate', Date.now());
  }
  if (localStorage.WorldTotalData === 'null' || Date.now() > (+localStorage.WorldTotalDataUpdate + 60000)) {
    const response = await fetch('https://covid19-api.org/api/timeline', { mode: 'cors' });
    const resp = await response.json();
    localStorage.WorldTotalData = JSON.stringify(resp);
    localStorage.WorldTotalDataUpdate = Date.now();

    return resp;
  }
  return JSON.parse(localStorage.WorldTotalData);
}

async function getCountriesPopulation() {
  if (localStorage.countriesPopulation === undefined) {
    localStorage.setItem('countriesPopulation', null);
    localStorage.setItem('countriesPopulationUpdate', Date.now());
  }
  if (localStorage.countriesPopulation === 'null' || Date.now() > (+localStorage.countriesPopulationUpdate + 3600000)) {
    const response = await fetch('https://restcountries.eu/rest/v2/all?fields=name;population', { mode: 'cors' });
    const resp = await response.json();
    localStorage.countriesPopulation = JSON.stringify(resp);
    localStorage.countriesPopulationUpdate = Date.now();
    return resp;
  }
  return JSON.parse(localStorage.countriesPopulation);
}

export async function getCountryPopulationDividedBy100k(country) {
  const data = await getCountriesPopulation();
  const re = new RegExp(country);
  const countryInfo = data.find((countryData) => countryData.name.search(re) === 0);
  return Math.ceil(Number(countryInfo.population) / 100000);
}
