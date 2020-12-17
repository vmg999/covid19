import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import getData from './js/api_data.js';
import CountriesTable from './js/countries.js';

async function showTotal(data) {
    const total = document.getElementById('total');
    if (data !== 'error') {
    total.textContent = await data.Global.TotalConfirmed;
    } else {
        total.textContent = 'Data unavailable';
    }
}

async function showDate(data) {
    let actual_date = document.getElementById('actual_date');
    const date = await new Date(data.Date);
    actual_date.textContent = `Data actual on: ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}`;
}

async function createApp() {
    try {
        let data = await getData();
        showTotal(data);
        let countries = new CountriesTable(data);
        countries.createTable();
        countries.createButtons();
        showDate(data);
    } catch (e){
        showTotal('error');
    }

};

createApp();