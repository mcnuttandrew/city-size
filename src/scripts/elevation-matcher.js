const fs = require('fs');
const WikiData = JSON.parse(fs.readFileSync('./src/data/wiki-data.json', 'utf8'));
const LatLngs = JSON.parse(fs.readFileSync('./src/data/elevation-by-lat-lng.json', 'utf8'));

/* eslint-disable no-console */

const cityLatLngMap = WikiData.reduce((res, city) => {
  const [lng, lat] = city.Location.match(/(\d*\.\d*)/g);
  const loc = `${lng}, ${-lat}`;
  res[loc] = city.City;
  return res;
}, {});

const cityElevations = LatLngs.results.reduce((res, latLng) => {
  const {lat, lng} = latLng.location;
  const city = cityLatLngMap[`${lat}, ${lng}`];
  if (!city) {
    return res;
  }
  res[city] = latLng.elevation;
  return res;
}, {});

fs.writeFile('./src/data/city-elevations.json', JSON.stringify(cityElevations), (err) => {
  if (err) {
    console.log('error');
    return;
  }
  console.log('complete');
});
