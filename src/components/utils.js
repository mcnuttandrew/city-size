import {format} from 'd3-format';
import {scaleLog} from 'd3-scale';

import WikiData from '../data/wiki-data.json';
import StateAbrevs from '../data/state-abrevs';
import COLOR_RANGE from './bmc-colors.json';

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
  return data.reduce((res, city, index) => {
    res.xMax = Math.max(res.xMax, city.x);
    res.xMin = Math.min(res.xMin, city.x);
    res.yMax = Math.max(res.yMax, city.y);
    res.yMin = Math.min(res.yMin, city.y);
    return res;
  }, {xMax: -Infinity, xMin: Infinity, yMin: Infinity, yMax: -Infinity});
}

const stringTemplates = {
  0: d => `${d} FT MAX`,
  1: d => `${d} FT ELEV`
};

export function prepData(dataset, dataindex) {

  const formatter = format('.2s');
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
    const color = COLOR_RANGE[(city['2016 rank'].replace(/,/g, '') + 4) % COLOR_RANGE.length];
    return {
      x: heightDelta,
      y: sqMiAccesor(city),
      color: color.color,
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
