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
    let resp;
    try {
      const response = await fetch('https://covid19-api.org/api/timeline', { mode: 'cors' });
      resp = await response.json();
      localStorage.WorldTotalData = JSON.stringify(resp);
      localStorage.WorldTotalDataUpdate = Date.now();
    } catch (e) {
      resp = (await fetch('api-data/world_total_timeline.json')).json();
    }
    return resp;
  }
  return JSON.parse(localStorage.WorldTotalData);
}
