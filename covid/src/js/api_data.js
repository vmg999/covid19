export default async function getData() {
    let response = await fetch('https://api.covid19api.com/summary', {mode: "cors"})
    let resp = await response.json();
    return resp;
}

export async function getDataByCountry(country) {
    let response = await fetch(`https://api.covid19api.com/total/country/${country}`, {mode: "cors"})
    let resp = await response.json();
    return resp;
}

export async function getWorldTotal() {
    let response = await fetch(`https://covid19-api.org/api/timeline`, {mode: "cors"})
    let resp = await response.json();
    return resp;
}

async function getCountriesPopulation() {
    let response = await fetch('https://restcountries.eu/rest/v2/all?fields=name;population', {mode: "cors"})
    let resp = await response.json();
    return resp;
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