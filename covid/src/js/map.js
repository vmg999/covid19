import { fullScreenButton } from "./buttons.js";
import L from "./leaflet.js";
import countryCoordinates from "./country_coordinates.json";
// import borders from './countries.geo.json';
import { addDigitSeparator, sliceZeros } from "./functions.js";

const Token = "pk.eyJ1Ijoidm1nOTk5IiwiYSI6ImNraXVxYTRuaTMyanUyeXFqdWI5aGFzcnEifQ.0GI3zMsWmnz6X--jidn8ew";
const maincolors = ["#FFEDA0", "#FED976", "#FD8D3C", "#FC4E2A", "#E31A1C", "#f00"];
const redcolors = ['rgba(197, 151, 151, 0.85)', 'rgba(202, 121, 121, 0.89)', 'rgba(212, 80, 80, 0.95)', 'rgba(214, 55, 55, 0.97)', 'rgba(236, 48, 48, 0.97)', 'rgb(255, 0, 0)'];
const greencolors = ['rgb(147, 180, 147)', 'rgb(122, 192, 122)', 'rgb(106, 192, 106)', 'rgb(79, 192, 79)', 'rgb(51, 214, 51)', 'rgb(2, 219, 2)'];
const sizes = ["2.3em", "2.6em", "3em", "3.3em", "4em", "4.5em"];
const TotalConfirmedScale = [0, 1000, 10000, 100000, 1000000, 10000000, Infinity];
const TotalDeathsScale = [0, 1000, 10000, 50000, 100000, 200000, Infinity];
const TotalRecoveredScale = [0, 1000, 10000, 100000, 1000000, 10000000, Infinity];
const NewConfirmedScale = [0, 1000, 5000, 10000, 50000, 100000, Infinity];
const NewDeathsScale = [0, 10, 50, 100, 300, 1000, Infinity];
const NewRecoveredScale = [0, 100, 500, 1000, 5000, 10000 , Infinity];


export default class Map {
  constructor(data, parent) {
    this.data = data;
    this.parent = parent;
    this.map = document.getElementById("map");
    this.container = document.createElement("div");
    this.container.setAttribute("id", "leafmap");
    this.map.append(this.container);
    this.leafmap = null;
    this.state = null;
    this.period = null;
    this.dataLayer = null;
    this.legend = null;
    this.legenddiv = null;
  }

  createButtons() {
    let event = new Event('resize', {
      bubbles: true,
      cancelable: true,
    });
    let full_screen_button = fullScreenButton();
    full_screen_button.classList.add("full_screen");
    full_screen_button.addEventListener("click", () => {
      this.map.classList.toggle("map_full");
      this.map.dispatchEvent(event);
    });
    this.map.append(full_screen_button);
  }

  createMap() {
    this.leafmap = L.map("leafmap").setView([25, 20], 2);

    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        maxZoom: 18,
        id: "vmg999/ckiuycxdj1bkf19o7akd3jj4j",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: Token,
      }
    ).addTo(this.leafmap);
  }

  getCooordinates(country) {
    let coordinates;
    for (let i = 0; i < countryCoordinates.length; i += 1) {
      if (countryCoordinates[i].country == country) {
        coordinates = countryCoordinates[i];
        break;
      } else {
        coordinates = {
          Lat: 0,
          Lon: 0,
        };
      }
    }
    return coordinates;
  }

  async createDataLayer() {
    if (this.dataLayer != null) {
      this.leafmap.removeLayer(this.dataLayer);
    }
    this.state = this.parent.countries.currentStat;
    this.period = this.parent.statistic.state.period;

    let data = await this.data.Countries;

    const geoJson = {
      type: "FeatureCollection",
      features: data.map((country = {}) => {
        const coordinates = this.getCooordinates(country.Country);
        const { Lat, Lon } = coordinates;
        return {
          type: "Feature",
          properties: {
            ...country,
          },
          geometry: {
            type: "Point",
            coordinates: [Lon, Lat],
          },
        };
      }),
    };

    this.dataLayer = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;
        let updatedFormatted;
        let casesString;
        let current;

        const {
          Country,
          TotalConfirmed,
          TotalDeaths,
          TotalRecovered,
          NewConfirmed,
          NewDeaths,
          NewRecovered,
        } = properties;
        const update = properties.Date;

        if (this.state === 'TotalConfirmed' && this.period === 'Total') {
          casesString = +TotalConfirmed;
          current = 'Total Confirmed';
        } else if (this.state === 'TotalDeaths' && this.period === 'Total') {
          casesString = +TotalDeaths;
          current = 'Total Deaths';
        } else if (this.state === 'TotalRecovered' && this.period === 'Total') {
          casesString = +TotalRecovered;
          current = 'Total Recovered';
        } else if (this.state === 'TotalConfirmed' && this.period === 'Today') {
          casesString = +NewConfirmed;
          current = 'Today Confirmed';
        } else if (this.state === 'TotalDeaths' && this.period === 'Today') {
          casesString = +NewDeaths;
          current = 'Today Deaths';
        } else if (this.state === 'TotalRecovered' && this.period === 'Today') {
          casesString = +NewRecovered;
          current = 'Today Recovered';
        }
        

        if (update) {
          let date = new Date(update);
          updatedFormatted = `${date.getDate()}.${
            date.getMonth() + 1
          }.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        }

        const span = `
              <span class="icon-marker-tooltip">
                <h2>${Country}</h2>
                <ul>
                  <li>Map shows ${current} Cases</li>
                  <hr>
                  <li>Confirmed: ${addDigitSeparator(TotalConfirmed)}</li>
                  <li>Deaths: ${addDigitSeparator(TotalDeaths)}</li>
                  <li>Recovered: ${addDigitSeparator(TotalRecovered)}</li>
                  <li>Today Confirmed: ${addDigitSeparator(NewConfirmed)}</li>
                  <li>Today Deaths: ${addDigitSeparator(NewDeaths)}</li>
                  <li>Today Recovered: ${addDigitSeparator(NewRecovered)}</li>
                  <li>Last Update: ${updatedFormatted}</li>
                </ul>
              </span>
              ${sliceZeros(casesString)}+
          `;

        let html = document.createElement("span");
        let MarkerLayout = this.getMarkerLayout(casesString);
        html.classList.add("icon-marker");
        html.style.backgroundColor = MarkerLayout.color;
        html.style.width = MarkerLayout.size;
        html.style.height = MarkerLayout.size;
        html.innerHTML = span;

        return L.marker(latlng, {
          icon: L.divIcon({
            className: "icon",
            html,
          }),
          riseOnHover: true,
        });
      },
    });



    await this.dataLayer.addTo(this.leafmap);
    this.createLegend();
  }

  createLegend() {
    if (this.legend != null) {
      this.legend.remove();
    }
    this.legend = L.control({ position: "bottomright" });
    let label;
    let grades;
    let colors;

    if(this.state === 'TotalConfirmed' && this.period === 'Total') {
      label = 'Total Confirmed';
      grades = TotalConfirmedScale;
      colors = maincolors;
    }
    if(this.state === 'TotalConfirmed' && this.period === 'Today') {
      label = 'Today Confirmed';
      grades = NewConfirmedScale;
      colors = maincolors;
    }
    if(this.state === 'TotalDeaths' && this.period === 'Total') {
      label = 'Total Deaths';
      grades = TotalDeathsScale;
      colors = redcolors;
    }
    if(this.state === 'TotalDeaths' && this.period === 'Today') {
      label = 'Today Deaths';
      grades = NewDeathsScale;
      colors = redcolors;
    }
    if(this.state === 'TotalRecovered' && this.period === 'Total') {
      label = 'Total Recovered';
      grades = TotalRecoveredScale;
      colors = greencolors;
    }
    if(this.state === 'TotalRecovered' && this.period === 'Today') {
      label = 'Today Recovered';
      grades = NewRecoveredScale;
      colors = greencolors;
    }

    this.legend.onAdd = function () {
      let legenddiv = L.DomUtil.create("div", "legend");
        let labels = [];
        labels.push(`<div><b>${label}</b></div>`);
      for (let i = 0; i < grades.length - 1; i += 1) {
        labels.push(`<div><i style="background:${colors[i]}"></i>${sliceZeros(grades[i])}
            ${(grades[i + 1] != undefined && grades[i + 1] != Infinity)? " - " + sliceZeros(grades[i + 1]) : "+"}</div>`);
      }
      legenddiv.innerHTML = labels.join("   ");
      return legenddiv;
    };

    this.legend.addTo(this.leafmap);
  }

  getMarkerLayout(value) {
    let layout = {
      color: null,
      size: null,
    }

  if(this.state === 'TotalConfirmed' && this.period === 'Total') {
    for (let i = 0; i < TotalConfirmedScale.length; i +=1) {
      if (value >= TotalConfirmedScale[i] && value < TotalConfirmedScale[i + 1]) {
        layout.color = maincolors[i];
        layout.size = sizes[i];
      }
    }
  }
  
  if(this.state === 'TotalDeaths' && this.period === 'Total') {
    for (let i = 0; i < TotalDeathsScale.length; i +=1) {
      if (value >= TotalDeathsScale[i] && value < TotalDeathsScale[i + 1]) {
        layout.color = redcolors[i];
        layout.size = sizes[i];
      }
    }
  }

  if(this.state === 'TotalRecovered' && this.period === 'Total') {
    for (let i = 0; i < TotalRecoveredScale.length; i +=1) {
      if (value >= TotalRecoveredScale[i] && value < TotalRecoveredScale[i + 1]) {
        layout.color = greencolors[i];
        layout.size = sizes[i];
      }
    }
  }

  if(this.state === 'TotalConfirmed' && this.period === 'Today') {
    for (let i = 0; i < NewConfirmedScale.length; i +=1) {
      if (value >= NewConfirmedScale[i] && value < NewConfirmedScale[i + 1]) {
        layout.color = maincolors[i];
        layout.size = sizes[i];
      }
    }
  }
  
  if(this.state === 'TotalDeaths' && this.period === 'Today') {
    for (let i = 0; i < NewDeathsScale.length; i +=1) {
      if (value >= NewDeathsScale[i] && value < NewDeathsScale[i + 1]) {
        layout.color = redcolors[i];
        layout.size = sizes[i];
      }
    }
  }

  if(this.state === 'TotalRecovered' && this.period === 'Today') {
    for (let i = 0; i < NewRecoveredScale.length; i +=1) {
      if (value >= NewRecoveredScale[i] && value < NewRecoveredScale[i + 1]) {
        layout.color = greencolors[i];
        layout.size = sizes[i];
      }
    }
  }

  return layout;
  }
}
