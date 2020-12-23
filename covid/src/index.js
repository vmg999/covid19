/* eslint-disable import/no-extraneous-dependencies */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './css/keyboard.css';
import './css/countrytable.css';
import './css/statistictable.css';
import './css/map.css';
import './css/chart.css';
import './css/footer.css';
import './css/buttons.css';
import './css/leaflet.css';
import './css/main.css';
import getData from './js/api_data';
import CountriesTable from './js/countries';
import StatisticTable from './js/statistic';
import { addDigitSeparator, getDate } from './js/functions';
import Map from './js/map';
import DataChart from './js/chart';
import Keyboard from './js/keyboard';

class Dashboard {
  constructor() {
    this.data = null;
    this.global_cases = null;
    this.actual_date = null;
    this.countries = null;
    this.statistic = null;
    this.map = null;
    this.chart = null;
    this.keyboard = null;
  }

  async init() {
    this.global_cases = document.getElementById('total');
    this.actual_date = document.getElementById('actual_date');

    this.data = await getData();
  }

  async showTotal(data) {
    if (data !== 'error') {
      this.global_cases.textContent = await addDigitSeparator(data.Global.TotalConfirmed);
    } else {
      this.global_cases.textContent = 'Data unavailable';
    }
  }

  async showDate(data) {
    const date = new Date(await data.Date);
    this.actual_date.textContent = `Data actual on: ${getDate(date)}`;
  }

  async buildApp() {
    await this.init();
    try {
      this.showTotal(this.data);
      this.showDate(this.data);

      this.statistic = new StatisticTable(this.data, this);
      this.countries = new CountriesTable(this.data, this);

      this.countries.createTable();
      this.countries.createButtons();

      this.statistic.setRegion();
      this.statistic.createTable();
      this.statistic.createButtons();

      this.map = new Map(this.data, this);
      this.map.createButtons();
      this.map.createMap();
      this.map.createDataLayer();

      this.chart = new DataChart();
      this.chart.worldTotal();

      this.keyboard = new Keyboard(this);
    } catch (e) {
      this.showTotal('error');
    }
  }
}

const dashboard = new Dashboard();
dashboard.buildApp();
