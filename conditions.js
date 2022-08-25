const moment = require('moment');
const osmosis = require('osmosis');


function removeSpace(str) {
  return str.replace(/\s+/g, ' ');
}

const timeFormat = 'hh:mm AA';



module.exports = function () {
  const sailings = [];
  const capacity = [];
  const statuses = [];

  let html;

  if (process.env.OFFLINE) {
    const fs = require('fs');
    html = fs.readFileSync(`./conditions3.html`);
  }

  return new Promise(((resolve, reject) => {
    const doc = html
      ? osmosis.parse(html)
      : osmosis.get('https://www.bcferries.com/current-conditions/HSB-BOW');

    doc
      .find('table:first tr')
      .set({
        depart: 'td[1]',
        // status: 'td[2]',
        status: '.percentage-full',
      })
      .then((context, data) => {
        console.log('data', data);
        // Object.keys(data)
        //   .forEach(k => data[k] = removeSpace(data[k]));
        let {depart, status} = data;
        status = removeSpace(status || '');
        console.log('depart', depart);
        depart = (depart || '').split('\n')[0].trim();
        let arrived = '';
        if (status) {
          const words = status.split(' ');
          if (words.includes('Arrived:')) {
            arrived = status.replace('Arrived:', '').trim();
            // const delay = moment
            //     .duration(
            //         moment(arrived, timeFormat)
            //             .diff(moment(departed, timeFormat)))
            //     .humanize();
            sailings.push({
              departed: depart,
              arrived
            });
            statuses.push({
              departed: depart,
              arrived
            });
          } else {
            capacity.push({
              depart,
              status
            });
            statuses.push({
              depart,
              capacity: status
            });

          }
        }
      })
      // .data((d) => console.log('d', d))
      // .log(console.log)
      .error(e => {
        console.error('error', e);
        reject(e);
      })
      // .debug(console.log)
      .then(() => {
        let result = {
          sailings,
          capacity,
        };
        resolve(statuses);
      });
  }));

}
