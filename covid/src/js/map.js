import { fullScreenButton } from "./buttons.js";
// import 'leaflet.css';
import L from "./leaflet.js";
import countryCoordinates from "./country_coordinates.json";
import { addDigitSeparator, sliceZeros } from "./functions.js";

const Token =
  "pk.eyJ1Ijoidm1nOTk5IiwiYSI6ImNraXVxYTRuaTMyanUyeXFqdWI5aGFzcnEifQ.0GI3zMsWmnz6X--jidn8ew";
const colors = ["#FFEDA0", "#FED976", "#FD8D3C", "#FC4E2A", "#E31A1C", "#f00"];

export default class Map {
  constructor(data, parent) {
    this.data = data;
    this.parent = parent;
    this.map = document.getElementById("map");
    this.container = document.createElement("div");
    this.container.setAttribute("id", "leafmap");
    this.map.append(this.container);
    this.leafmap = null;
  }

  createButtons() {
    let full_screen_button = fullScreenButton();
    full_screen_button.classList.add("full_screen");
    full_screen_button.addEventListener("click", () => {
      this.map.classList.toggle("map");
      this.map.classList.toggle("country_cases_full");
    });
    this.map.append(full_screen_button);
  }

  createMap() {
    this.leafmap = L.map("leafmap").setView([38.4, -8.1], 2);

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

    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;
        let updatedFormatted;
        let casesString;
        let color;
        let size;

        const {
          Country,
          TotalConfirmed,
          TotalDeaths,
          TotalRecovered,
        } = properties;
        const update = properties.Date;

        casesString = sliceZeros(+TotalConfirmed);

        if (update) {
          let date = new Date(update);
          updatedFormatted = `${date.getDate()}.${
            date.getMonth() + 1
          }.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        }

        if (TotalConfirmed < 1000) {
          color = colors[0];
          size = "2.4em";
        } else if (TotalConfirmed >= 1000 && TotalConfirmed < 10000) {
          color = colors[1];
          size = "2.8em";
        } else if (TotalConfirmed >= 10000 && TotalConfirmed < 100000) {
          color = colors[2];
          size = "3em";
        } else if (TotalConfirmed >= 100000 && TotalConfirmed < 1000000) {
          color = colors[3];
          size = "3.3em";
        } else if (TotalConfirmed >= 1000000 && TotalConfirmed < 10000000) {
          color = colors[4];
          size = "4em";
        } else if (TotalConfirmed >= 10000000) {
          color = colors[5];
          size = "4.5em";
        }

        const span = `
              <span class="icon-marker-tooltip">
                <h2>${Country}</h2>
                <ul>
                  <li>Confirmed: ${addDigitSeparator(TotalConfirmed)}</li>
                  <li>Deaths: ${addDigitSeparator(TotalDeaths)}</li>
                  <li>Recovered: ${addDigitSeparator(TotalRecovered)}</li>
                  <li>Last Update: ${updatedFormatted}</li>
                </ul>
              </span>
              ${casesString}
          `;

        let html = document.createElement("span");
        html.classList.add("icon-marker");
        html.style.backgroundColor = color;
        html.style.width = size;
        html.style.height = size;
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

    await geoJsonLayers.addTo(this.leafmap);
  }

  createLegend() {
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      var div = L.DomUtil.create("div", "legend"),
        grades = ['0', '1k', '10k', '100k', '1M', '10M'],
        labels = [];
      for (let i = 0; i < grades.length; i += 1) {
        labels.push(`<div><i style="background:${colors[i]}"></i>${grades[i]}${grades[i + 1] ? " - " + grades[i + 1] : "+"}</div>`);
      }
      div.innerHTML = labels.join("   ");
      return div;
    };

    legend.addTo(this.leafmap);
  }
}
