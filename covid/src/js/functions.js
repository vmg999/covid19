import countryCoordinates from './country_coordinates.json';
import countryPopulation from './country_population.json';

export function addDigitSeparator(num) {
  let digitString = num.toString();
  const tmp = [];
  digitString = digitString.split('').reverse();
  for (let i = 0; i < digitString.length; i += 1) {
    if ((i + 1) % 3 === 0) {
      tmp.push(digitString[i]);
      tmp.push(' ');
    } else {
      tmp.push(digitString[i]);
    }
  }

  return tmp.reverse().join('');
}

export function sliceZeros(num, plus = '') {
  let casesString = `${num}`;
  const n = +num;

  if (n > 1000 && n < 1000000) {
    casesString = `${casesString.slice(0, -3)}k${plus}`;
  } else if (n >= 1000000) {
    casesString = `${casesString.slice(0, -6)}M${plus}`;
  }

  return casesString;
}

export function addZero(num) {
  return (parseInt(num, 10) < 10 ? '0' : '') + num;
}

export function getDate(date) {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}  ${date.getHours()}:${addZero(date.getMinutes())}`;
}

export function getCoordinates(country) {
  let coordinates;
  for (let i = 0; i < countryCoordinates.length; i += 1) {
    if (countryCoordinates[i].country === country) {
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

export function getCountryPopulationDividedBy100k(country) {
  const re = new RegExp(country);
  const countryInfo = countryPopulation.find((countryData) => countryData.name.search(re) === 0);
  return Math.ceil(Number(countryInfo.population) / 100000);
}
