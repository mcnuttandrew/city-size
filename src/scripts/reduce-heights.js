const fs = require('fs');
const heights = fs.readFileSync('./src/data/building-heights.json', 'utf8');
const buildingHeights = JSON.parse(heights);

/* eslint-disable no-console */

const groupedBuildings = buildingHeights.reduce((res, building) => {
  if (!res[building.City]) {
    res[building.City] = [];
  }
  res[building.City].push(building);
  return res;
}, {});
// console.log(groupedBuildings)
function getHeight(height) {
  return Number(height.replace(/\sft/, '').replace(',', ''));
}

// const buildingAVGS = Object.keys(groupedBuildings).reduce((res, cityName) => {
//   const buildingGroup = groupedBuildings[cityName];
//   const sum = buildingGroup.reduce((acc, building) => {
//     const height = getHeight(building.Height);
//     return acc + (isNaN(height) ? 0 : height);
//   }, 0);
//   const count = buildingGroup.reduce((acc, building) => {
//     const height = getHeight(building.Height);
//     return acc + ((isNaN(height) || height === 0) ? 0 : 1);
//   }, 0);
//
//   res[cityName] = sum / count;
//   return res;
// }, {});

const buildingMAXES = Object.keys(groupedBuildings).reduce((res, cityName) => {
  const buildingGroup = groupedBuildings[cityName];
  const max = buildingGroup.reduce((acc, building) => {
    const height = getHeight(building.Height);
    return Math.max(acc, isNaN(height) ? 0 : height);
  }, -Infinity);

  res[cityName] = max;
  return res;
}, {});

// console.log(JSON.stringify(buildingAVGS, null, 2));

fs.writeFile('./src/data/hashed-max-heights.json', JSON.stringify(buildingMAXES), (err) => {
  if (err) {
    console.log('error');
    return;
  }
  console.log('complete');
});
