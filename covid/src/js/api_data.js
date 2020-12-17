export default async function getData() {
    let response = await fetch('https://api.covid19api.com/summary', {mode: "cors"})
    let resp = await response.json();
    return resp;
}