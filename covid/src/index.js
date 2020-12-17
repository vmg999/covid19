import 'bootstrap/dist/css/bootstrap.min.css';
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



async function createApp() {
    try {
        let data = await getData();
        showTotal(data);
        let countries = new CountriesTable(data, 'country_table');
        countries.createTable();
    } catch (e){
        showTotal('error');
    }

};

createApp();