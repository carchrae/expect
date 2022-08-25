const moment = require('moment');
const osmosis = require('osmosis');
const fs = require('fs');

function removeSpace(str) {
  return str.replace(/\s+/g, ' ');
}

const timeFormat = 'hh:mm AA';

module.exports = function ({date, from, to}) {
  let url;
  //bcf use this format 05/10/2021

  let html;
  if (process.env.OFFLINE) {
    html = fs.readFileSync(`./schedule2-${from.toLowerCase()}-${to.toLowerCase()}.html`);
  }

  if (date) {
    const dateStr = moment(date).format('MM/DD/Y');
    url = `https://www.bcferries.com/routes-fares/schedules/daily/${from}-${to}?&scheduleDate=${dateStr}`;
  } else {
    url = `https://www.bcferries.com/routes-fares/schedules/daily/${from}-${to}`;
  }
  const sailings = [];
  return new Promise(((resolve, reject) => {
    const doc = html
      ? osmosis.parse(html)
      : osmosis.get(url);


    // osmosis
    //       .parse(html)
    //       // .get(url)
    //       // .find('table:first tr:not(:first-child)')
    doc
      .find('table:first tr:not(th)')
      .set({
        // blank: 'td[1]',
        date: 'td[2]/@data-sort',
        depart: 'td[2]',
        arrive: 'td[3]',
        // duration: 'td[4]',
      })
      .then((context, data) =>
        Object
          .keys(data)
          .forEach(k => data[k] = removeSpace(data[k]))
      )
      .data((d) => d.depart && sailings.push(d))
      .error(e => {
        console.error('error', e);
        reject(e);
      })
      .then(() => {
        resolve(sailings);
      });
  }));
}
