const fs = require('fs');
const cities = fs.readFileSync('./src/data/admin_level_8.geojson', 'utf8');
const jsonCity = JSON.parse(cities);

const targetCitiesBlob = fs.readFileSync('./src/data/cities.json', 'utf8');
const targetCities = JSON.parse(targetCitiesBlob).reduce((res, city) => {
  res[city] = true;
  return res;
}, {});

jsonCity.features.filter(feature => {
  return targetCities[feature.name];
}).forEach(feature => {
  if (typeof targetCities[feature.name] === 'boolean') {
    targetCities[feature.name] = [];
  }
  // feature.geometry = 'SKIP';
  targetCities[feature.name].push(feature);
});

Object.keys(targetCities).sort().forEach(featureGroupName => {
  console.log(`${featureGroupName}: ${targetCities[featureGroupName].length}`);
});

// console.log(JSON.stringify(targetCities.Renton))

// console.log(jsonCity.features.length, filteredCities.length, Object.keys(targetCities).length)
// console.log(filteredCities)
// const count = jsonCity.features.reduce((cnt, feature) => {
//   return cnt + (targetCities[feature.name] ? 1 : 0);
// }, 0);
//
// /* eslint-disable no-console */
// console.log(jsonCity.features, count);
/* eslint-enable no-console */
// console.log(count, Object.keys(targetCities).length)
// console.log(jsonCity.features.map(feature => feature.name))

fs.writeFile('./src/data/grouped-city-shapes.json', JSON.stringify(targetCities), 'utf8', (err, data) => {
  /* eslint-disable no-console */
  if (err) {
    console.log(err);
  } else {
    console.log('complete');
  }
  /* eslint-enable no-console */
});
