import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import getData, {getDataByCountry, getCountryPopulationR100k} from './js/api_data.js';
import CountriesTable from './js/countries.js';
import StatisticTable from './js/statistic.js';
import { addDigitSeparator } from './js/functions.js';
import Map from './js/map.js';

class Dashboard {
    constructor () {
        this.data = null;
        this.elements = {
            global_cases: null,
            country_cases: null,
            map: null,
            statistic_table: null,
            chart: null,
            actual_date: null,
        };
        this.countries = null;
        this.statistic = null;
        this.map = null;
    }

    async init() {
        this.elements.global_cases = document.getElementById('total');
        this.elements.actual_date = document.getElementById('actual_date');

        this.data = await getData();
    }


    async showTotal(data) {
        if (data !== 'error') {
            this.elements.global_cases.textContent = await addDigitSeparator(data.Global.TotalConfirmed);
        } else {
            this.elements.global_cases.textContent = 'Data unavailable';
        }
    }

    async showDate(data) {
        const date = await new Date(data.Date);
        this.elements.actual_date.textContent = `Data actual on: ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}`;
    }

    async buildApp() {
        await this.init();
        try {
            this.showTotal(this.data);
            this.showDate(this.data);

            this.statistic = new StatisticTable(this.data);
            this.countries = new CountriesTable(this.data, this);

            this.countries.createTable();
            this.countries.createButtons();
            // this.countries.createSearch();

            this.statistic.setRegion();
            this.statistic.createTable();
            this.statistic.createButtons();

            this.map = new Map(this.data, this);
            this.map.createButtons();
            this.map.createMap();
            this.map.createDataLayer();
            this.map.createLegend();
        } catch (e){
            this.showTotal('error');
        }
    }
    
}


let dashboard = new Dashboard();
dashboard.buildApp();