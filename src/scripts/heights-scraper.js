const express = require('express');
// const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();
/* eslint-disable no-console, max-len */
// const rooturl = 'https://www.emporis.com/country/100185/usa';
function requestCityUrl(state, city) {
  const stateLinks = require('../data/state-links.json');
  request(stateLinks[state], (error, response, html) => {
    if (error) {
      console.log('error!!!', error);
      return;
    }
    const $ = cheerio.load(html);
    // go to the relavant state
    // find out the url code for relavant city
    // go to the tallest building
    // `https://www.emporis.com/statistics/tallest-buildings/City/${cityCode}`;
    // execute savescript
    const links = $('.box-white li');
    links.each(function linkIterator(index, elem) {
      const li = $(this);
      const link = li.find('a');
      const href = link.attr('href');
      const name = link.text();

      if (city.toUpperCase() === name.toUpperCase()) {
        console.log(city, href);
      }
    });
  });
}

function requestCityHeights(cityName, cityUrl) {
  const rowList = [
    '#', 'skip', 'Building', 'City', 'Floors', 'Height', 'Year'
  ];
  request(cityUrl, (error, response, html) => {
    if (error) {
      console.log('error!!!', error);
      return;
    }
    const $ = cheerio.load(html);
    const rows = $('.table-condensed tbody tr');
    rows.each(function rowIterator(index, elem) {
      const tr = $(this);
      const cells = tr.find('td');
      const rowOut = {'#': false, Building: false, City: false, Floors: false, Height: false, Year: false};

      cells.each(function cellIterator(cellIndex, cellElem) {
        const cell = $(this);
        if (rowList[cellIndex] === 'skip') {
          return;
        }
        rowOut[rowList[cellIndex]] = cell.text().trim();
      });
      // const href = link.attr('href');
      console.log(JSON.stringify(rowOut));
    });
  });
}

app.get('/scrape-city-names', (req, res) => {
  // const wikiData = require('../data/wiki-data.json');
  // wikiData.forEach(city => requestCityUrl(city.State, city.City));
});

const hashedCityLinks = {
  'New York City': 'https://www.emporis.com/statistics/tallest-buildings/City/101028/new-york-city-ny-usa',
  Washington: 'https://www.emporis.com/statistics/tallest-buildings/City/101047/washington-dc-usa',
  'Las Vegas': 'https://www.emporis.com/statistics/tallest-buildings/City/101318/las-vegas-nv-usa',
  Tucson: 'https://www.emporis.com/statistics/tallest-buildings/City/102386/tucson-az-usa',
  Henderson: 'https://www.emporis.com/statistics/tallest-buildings/City/101764/henderson-nv-usa',
  'North Las Vegas': 'https://www.emporis.com/statistics/tallest-buildings/City/102817/north-las-vegas-nv-usa',
  Anaheim: 'https://www.emporis.com/statistics/tallest-buildings/City/102574/anaheim-ca-usa',
  'San Jose': 'https://www.emporis.com/statistics/tallest-buildings/City/101038/san-jose-ca-usa',
  'San Diego': 'https://www.emporis.com/statistics/tallest-buildings/City/101033/san-diego-ca-usa',
  Aurora: 'https://www.emporis.com/statistics/tallest-buildings/City/101705/aurora-il-usa',
  Phoenix: 'https://www.emporis.com/statistics/tallest-buildings/City/101034/phoenix-az-usa',
  Honolulu: 'https://www.emporis.com/statistics/tallest-buildings/City/102596/honolulu-hi-usa',
  Anchorage: 'https://www.emporis.com/statistics/tallest-buildings/City/102276/anchorage-ak-usa',
  Scottsdale: 'https://www.emporis.com/statistics/tallest-buildings/City/103646/scottsdale-az-usa',
  Reno: 'https://www.emporis.com/statistics/tallest-buildings/City/102240/reno-nv-usa',
  Nashville: 'https://www.emporis.com/statistics/tallest-buildings/City/101337/nashville-tn-usa',
  Glendale: 'https://www.emporis.com/statistics/tallest-buildings/City/102219/glendale-ca-usa',
  'Santa Ana': 'https://www.emporis.com/statistics/tallest-buildings/City/102125/santa-ana-ca-usa',
  Louisville: 'https://www.emporis.com/statistics/tallest-buildings/City/101641/louisville-ky-usa',
  'Oklahoma City': 'https://www.emporis.com/statistics/tallest-buildings/City/101327/oklahoma-city-ok-usa',
  Mesa: 'https://www.emporis.com/statistics/tallest-buildings/City/102183/mesa-az-usa',
  Baltimore: 'https://www.emporis.com/statistics/tallest-buildings/City/101042/baltimore-md-usa',
  Fresno: 'https://www.emporis.com/statistics/tallest-buildings/City/102328/fresno-ca-usa',
  Denver: 'https://www.emporis.com/statistics/tallest-buildings/City/101307/denver-co-usa',
  Chandler: 'https://www.emporis.com/statistics/tallest-buildings/City/106484/chandler-az-usa',
  'Fort Wayne': 'https://www.emporis.com/statistics/tallest-buildings/City/102432/fort-wayne-in-usa',
  Raleigh: 'https://www.emporis.com/statistics/tallest-buildings/City/101907/raleigh-nc-usa',
  Boston: 'https://www.emporis.com/statistics/tallest-buildings/City/101045/boston-ma-usa',
  'Virginia Beach': 'https://www.emporis.com/statistics/tallest-buildings/City/101500/virginia-beach-va-usa',
  Milwaukee: 'https://www.emporis.com/statistics/tallest-buildings/City/101324/milwaukee-wi-usa',
  'New Orleans': 'https://www.emporis.com/statistics/tallest-buildings/City/101332/new-orleans-la-usa',
  Albuquerque: 'https://www.emporis.com/statistics/tallest-buildings/City/102790/albuquerque-nm-usa',
  Lexington: 'https://www.emporis.com/statistics/tallest-buildings/City/102479/lexington-ky-usa',
  'Jersey City': 'https://www.emporis.com/statistics/tallest-buildings/City/101309/jersey-city-nj-usa',
  Sacramento: 'https://www.emporis.com/statistics/tallest-buildings/City/101358/sacramento-ca-usa',
  Gilbert: 'https://www.emporis.com/statistics/tallest-buildings/City/109095/gilbert-az-usa',
  Memphis: 'https://www.emporis.com/statistics/tallest-buildings/City/101918/memphis-tn-usa',
  Indianapolis: 'https://www.emporis.com/statistics/tallest-buildings/City/101039/indianapolis-in-usa',
  Columbus: 'https://www.emporis.com/statistics/tallest-buildings/City/102334/columbus-ga-usa',
  Riverside: 'https://www.emporis.com/statistics/tallest-buildings/City/102915/riverside-ca-usa',
  'St. Louis': 'https://www.emporis.com/statistics/tallest-buildings/City/102345/st-louis-mo-usa',
  Cincinnati: 'https://www.emporis.com/statistics/tallest-buildings/City/101314/cincinnati-oh-usa',
  'San Bernardino': 'https://www.emporis.com/statistics/tallest-buildings/City/101528/san-bernardino-ca-usa',
  Stockton: 'https://www.emporis.com/statistics/tallest-buildings/City/102641/stockton-ca-usa',
  Jacksonville: 'https://www.emporis.com/statistics/tallest-buildings/City/101041/jacksonville-fl-usa',
  Buffalo: 'https://www.emporis.com/statistics/tallest-buildings/City/102063/buffalo-ny-usa',
  Newark: 'https://www.emporis.com/statistics/tallest-buildings/City/101306/newark-nj-usa',
  Norfolk: 'https://www.emporis.com/statistics/tallest-buildings/City/102569/norfolk-va-usa',
  Greensboro: 'https://www.emporis.com/statistics/tallest-buildings/City/102581/greensboro-nc-usa',
  Toledo: 'https://www.emporis.com/statistics/tallest-buildings/City/102532/toledo-oh-usa',
  Fremont: 'https://www.emporis.com/statistics/tallest-buildings/City/101923/fremont-ca-usa',
  'St. Petersburg': 'https://www.emporis.com/statistics/tallest-buildings/City/103046/st-petersburg-fl-usa',
  'Kansas City': 'https://www.emporis.com/statistics/tallest-buildings/City/101973/kansas-city-ks-usa',
  Tampa: 'https://www.emporis.com/statistics/tallest-buildings/City/102589/tampa-fl-usa',
  Cleveland: 'https://www.emporis.com/statistics/tallest-buildings/City/101311/cleveland-oh-usa',
  Atlanta: 'https://www.emporis.com/statistics/tallest-buildings/City/101302/atlanta-ga-usa',
  Dallas: 'https://www.emporis.com/statistics/tallest-buildings/City/101036/dallas-tx-usa',
  Detroit: 'https://www.emporis.com/statistics/tallest-buildings/City/101037/detroit-mi-usa',
  'San Francisco': 'https://www.emporis.com/statistics/tallest-buildings/City/101040/san-francisco-ca-usa',
  Portland: 'https://www.emporis.com/statistics/tallest-buildings/City/101329/portland-or-usa',
  'Corpus Christi': 'https://www.emporis.com/statistics/tallest-buildings/City/102236/corpus-christi-tx-usa',
  Irvine: 'https://www.emporis.com/statistics/tallest-buildings/City/101841/irvine-ca-usa',
  Houston: 'https://www.emporis.com/statistics/tallest-buildings/City/101031/houston-tx-usa',
  'Fort Worth': 'https://www.emporis.com/statistics/tallest-buildings/City/101322/fort-worth-tx-usa',
  'Long Beach': 'https://www.emporis.com/statistics/tallest-buildings/City/102416/long-beach-ca-usa',
  Charlotte: 'https://www.emporis.com/statistics/tallest-buildings/City/101310/charlotte-nc-usa',
  Pittsburgh: 'https://www.emporis.com/statistics/tallest-buildings/City/101313/pittsburgh-pa-usa',
  'San Antonio': 'https://www.emporis.com/statistics/tallest-buildings/City/101035/san-antonio-tx-usa',
  Irving: 'https://www.emporis.com/statistics/tallest-buildings/City/102130/irving-tx-usa',
  Bakersfield: 'https://www.emporis.com/statistics/tallest-buildings/City/101637/bakersfield-ca-usa',
  Orlando: 'https://www.emporis.com/statistics/tallest-buildings/City/101340/orlando-fl-usa',
  Oakland: 'https://www.emporis.com/statistics/tallest-buildings/City/102062/oakland-ca-usa',
  Arlington: 'https://www.emporis.com/statistics/tallest-buildings/City/102102/arlington-tx-usa',
  Philadelphia: 'https://www.emporis.com/statistics/tallest-buildings/City/101032/philadelphia-pa-usa',
  Chicago: 'https://www.emporis.com/statistics/tallest-buildings/City/101030/chicago-il-usa',
  Austin: 'https://www.emporis.com/statistics/tallest-buildings/City/101341/austin-tx-usa',
  'Los Angeles': 'https://www.emporis.com/statistics/tallest-buildings/City/101029/los-angeles-ca-usa',
  Garland: 'https://www.emporis.com/statistics/tallest-buildings/City/101984/garland-tx-usa',
  'Chula Vista': 'https://www.emporis.com/statistics/tallest-buildings/City/106553/chula-vista-ca-usa',
  Chesapeake: 'https://www.emporis.com/statistics/tallest-buildings/City/102619/chesapeake-va-usa',
  Lubbock: 'https://www.emporis.com/statistics/tallest-buildings/City/101489/lubbock-tx-usa',
  Richmond: 'https://www.emporis.com/statistics/tallest-buildings/City/106443/richmond-ca-usa',
  Laredo: 'https://www.emporis.com/statistics/tallest-buildings/City/102906/laredo-tx-usa',
  Plano: 'https://www.emporis.com/statistics/tallest-buildings/City/101475/plano-tx-usa',
  Hialeah: 'https://www.emporis.com/statistics/tallest-buildings/City/102862/hialeah-fl-usa',
  Lincoln: 'https://www.emporis.com/statistics/tallest-buildings/City/102074/lincoln-ne-usa',
  Tulsa: 'https://www.emporis.com/statistics/tallest-buildings/City/101336/tulsa-ok-usa',
  'El Paso': 'https://www.emporis.com/statistics/tallest-buildings/City/101044/el-paso-tx-usa',
  Boise: 'https://www.emporis.com/statistics/tallest-buildings/City/102450/boise-id-usa',
  Madison: 'https://www.emporis.com/statistics/tallest-buildings/City/101361/madison-wi-usa',
  Seattle: 'https://www.emporis.com/statistics/tallest-buildings/City/101046/seattle-wa-usa',
  'Colorado Springs': 'https://www.emporis.com/statistics/tallest-buildings/City/102152/colorado-springs-co-usa',
  Minneapolis: 'https://www.emporis.com/statistics/tallest-buildings/City/101331/minneapolis-mn-usa',
  Omaha: 'https://www.emporis.com/statistics/tallest-buildings/City/102752/omaha-ne-usa',
  Miami: 'https://www.emporis.com/statistics/tallest-buildings/City/101321/miami-fl-usa',
  Wichita: 'https://www.emporis.com/statistics/tallest-buildings/City/101994/wichita-ks-usa',
  Durham: 'https://www.emporis.com/statistics/tallest-buildings/City/102453/durham-nc-usa',
  'Baton Rouge': 'https://www.emporis.com/statistics/tallest-buildings/City/102363/baton-rouge-la-usa'
};

app.get('/scrape-buildings', (req, res) => {
  // const cityList = require('../data/hashed-city-links.json');
  // const hashedCityLinks = JSON.parse(cityList);

  Object.keys(hashedCityLinks).forEach(cityName => {
    requestCityHeights(cityName, hashedCityLinks[cityName]);
  });
  // wikiData.forEach(city => requestCityUrl(city.State, city.City));
});

app.listen('8081');
