const fs = require('fs');
const cities = fs.readFileSync('./src/data/city-link.json', 'utf8');
const cityLinks = JSON.parse(cities);

const wiki = fs.readFileSync('./src/data/wiki-data.json', 'utf8');
const wikiCities = JSON.parse(wiki);

/* eslint-disable no-console */

const validCityNames = wikiCities
  .filter(city => Number(city['2016 rank'].replace(/,/g, '')) <= 100)
  .reduce((res, city) => {
    res[city.City] = true;
    return res;
  }, {});

const hashedCityLinks = cityLinks.reduce((res, cityLink) => {
  if (!validCityNames[cityLink.city]) {
    return res;
  }
  res[cityLink.city] = cityLink.link;
  return res;
}, {});

fs.writeFile('./src/data/hased-city-links.json', JSON.stringify(hashedCityLinks), (err) => {
  if (err) {
    console.log('error');
    return;
  }
  console.log('complete');
});
