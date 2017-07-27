import {format} from 'd3-format';
import {scaleLog} from 'd3-scale';

import WikiData from '../data/wiki-data.json';
import StateAbrevs from '../data/state-abrevs';
// import COLOR_RANGE from './bmc-colors.json';

import CityElevations from '../data/city-elevations.json';
import BuildHeights from '../data/hashed-max-heights.json';

import {scaleQuantile} from 'd3-scale';

export const DIV_COLOR = [
  '#8c510a',
  '#d8b365',
  '#b2171a',
  '#6c8aa4',
  '#6cbe9d',
  '#01665e'
];

// the quantiles:
// [198, 323, 411, 555, 791]
export const heightScale = scaleQuantile()
  .domain(Object.keys(BuildHeights).map(cityName => BuildHeights[cityName]))
  .range(DIV_COLOR);

// the quantiles
// [14, 58, 156, 222, 382]
export const elevationScale = scaleQuantile()
  .domain(Object.keys(CityElevations).map(cityName => CityElevations[cityName]))
  .range(DIV_COLOR);

function getColor(cityName, state, dataindex) {
  if (dataindex) {
    return elevationScale(CityElevations[cityName]);
  }
  return heightScale(BuildHeights[cityName]);
}

export function getAvgHeight(dataset) {
  const buildSum = Object.keys(dataset).reduce((res, cityName) => {
    return res + dataset[cityName];
  }, 0);
  return buildSum / Object.keys(dataset).length;
}

export function sqMiAccesor(city) {
  return Number(city['2014 land area'].replace(/,/g, '').split(' sq mi')[0]);
}

export function getDomains(data) {
  return data.reduce((res, row, index) => {
    res.xMax = Math.max(res.xMax, row.x);
    res.xMin = Math.min(res.xMin, row.x);
    res.yMax = Math.max(res.yMax, row.y);
    res.yMin = Math.min(res.yMin, row.y);
    return res;
  }, {xMax: -Infinity, xMin: Infinity, yMin: Infinity, yMax: -Infinity});
}

const stringTemplates = {
  0: d => `${d} FT MAX`,
  1: d => `${d} M ELEV`
};

export function prepData(dataset, dataindex) {

  const formatter = format(',.2r');
  const HEIGHT_AVG = getAvgHeight(dataset);
  const preMappedWikiData = WikiData.sort((a, b) => {
    return sqMiAccesor(a) - sqMiAccesor(b);
  })
  .filter(city => Number(city['2016 rank'].replace(/,/g, '')) <= 100)
  .filter(city => city.City !== 'WINSTON–SALEM')
  .map((city, index) => {
    const name = city.City.toUpperCase();
    const state = (StateAbrevs[city.State] || '').toUpperCase();

    // const height = BuildingHeights[city.City];
    // const heightDelta = BuildingHeights[city.City] - HEIGHT_AVG;

    const height = dataset[city.City];
    const heightDelta = dataset[city.City] - HEIGHT_AVG;
    // const color = COLOR_RANGE[(city['2016 rank'].replace(/,/g, '') + 4) % COLOR_RANGE.length];
    const color = getColor(city.City, city.State, dataindex);
    // console.log(color)
    return {
      x: heightDelta,
      y: sqMiAccesor(city),
      color,
      // label: [
      //   <tspan dx="0em">
      //     <tspan dx="0" dy="1em">{`${name}, ${state}`}</tspan>
      //     <tspan dx="-10em" dy="1em">{`${sqMiAccesor(city)} sq mi`}</tspan>
      //     <tspan dx="0em" dy="1em">{`${formatter(height)} ft`}</tspan>
      //   </tspan>
      // ],
      // label: `${name}, ${state} ${sqMiAccesor(city)} SQ MI ${formatter(height)} FT`,
      line1: `${name}, ${state}`,
      line2: `${sqMiAccesor(city)} SQ MI`,
      line3: stringTemplates[dataindex](formatter(height))
    };
  })
  .filter(city => city.x && city.y);

  const {yMin, yMax} = getDomains(preMappedWikiData);
  const logger = scaleLog().domain([yMin, yMax]).range([yMin, yMax]);
  return preMappedWikiData.map(city => {
    return {...city, y: logger(city.y)};
  });
}
