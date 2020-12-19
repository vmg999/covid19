import { fullScreenButton } from "./buttons.js";
// import 'leaflet.css';
import L from "./leaflet.js";

const Token = 'pk.eyJ1Ijoidm1nOTk5IiwiYSI6ImNraXVxYTRuaTMyanUyeXFqdWI5aGFzcnEifQ.0GI3zMsWmnz6X--jidn8ew';

export default class Map {
  constructor() {
    this.map = document.getElementById("map");
    this.container = null;
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
    this.container = document.createElement("div");
    this.container.setAttribute("id", "leafmap");
    this.map.append(this.container);

    this.leafmap = L.map("leafmap").setView([38.4, -8.1], 2);

    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'vmg999/ckiuycxdj1bkf19o7akd3jj4j',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: Token,
      }
    ).addTo(this.leafmap);


  }
}
