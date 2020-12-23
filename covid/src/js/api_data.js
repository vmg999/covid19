export default async function getData() {
    if (localStorage.summaryData == undefined) {
        localStorage.setItem('summaryData', null);
        localStorage.setItem('summaryDataUpdate', Date.now());
    }

    if (localStorage.summaryData === 'null' || Date.now() > (+localStorage.summaryDataUpdate + 60000) ) {
        let response = await fetch('https://api.covid19api.com/summary', {mode: "cors"})
        let resp = await response.json();
        if (resp.Message !== 'Caching in progress') {
            localStorage.summaryData = JSON.stringify(resp);
            localStorage.summaryDataUpdate = Date.now();
        }

        return resp;
    } else {
        return JSON.parse(localStorage.summaryData);
    }
}

export async function getDataByCountry(country) {
    let response = await fetch(`https://api.covid19api.com/total/country/${country}`, {mode: "cors"})
    let resp = await response.json();
    return resp;
}

export async function getWorldTotal() {
    if (localStorage.WorldTotalData == undefined) {
        localStorage.setItem('WorldTotalData', null);
        localStorage.setItem('WorldTotalDataUpdate', Date.now());
    }
    if (localStorage.WorldTotalData === 'null' || Date.now() > (+localStorage.WorldTotalDataUpdate + 60000) ) {
        let response = await fetch(`https://covid19-api.org/api/timeline`, {mode: "cors"})
        let resp = await response.json();
        localStorage.WorldTotalData = JSON.stringify(resp);
        localStorage.WorldTotalDataUpdate = Date.now();

        return resp;
    } else {
        return JSON.parse(localStorage.WorldTotalData);
    }
}

async function getCountriesPopulation() {
    if (localStorage.countriesPopulation == undefined) {
        localStorage.setItem('countriesPopulation', null);
        localStorage.setItem('countriesPopulationUpdate', Date.now());
    }
    if (localStorage.countriesPopulation === 'null' || Date.now() > (+localStorage.countriesPopulationUpdate + 3600000) ) {
        let response = await fetch('https://restcountries.eu/rest/v2/all?fields=name;population', {mode: "cors"})
        let resp = await response.json();
        localStorage.countriesPopulation = JSON.stringify(resp);
        localStorage.countriesPopulationUpdate = Date.now();
        return resp;
    } else {
        return JSON.parse(localStorage.countriesPopulation);
    }
}

export async function getCountryPopulationR100k(country) {
    let pop;
    let data = await getCountriesPopulation();

    data.forEach(el => {
        if (el.name == country) {
            pop = Math.ceil(+el.population / 100000);
        }
    });
    return pop;
}