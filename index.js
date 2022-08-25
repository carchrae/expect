const moment = require('moment');

const Handlebars = require("handlebars");
const templateSrc = require('./views/home');
const template = Handlebars.compile(templateSrc)

// const exphbs = require('express-handlebars');

const condition = require('./conditions');
const schedule = require('./schedule');
const delay = require('./delay');
const timeFormat = 'hh:mm AA';

// app.engine('handlebars', remoteHandlebars({ layout: 'http://localhost/template.handlebars', cacheControl: 'max-age=600, stale-while-revalidate=86400' }));
//
// app.engine('hbs', exphbs({
//   defaultLayout: 'main',
//   extname: '.hbs',
// }));

// app.set('view engine', 'hbs');

let handler = async (req) => {
    console.log('processing request');
    const [conditions, scheduleToHSB, scheduleToBOW] = await Promise.all([
        condition(),
        schedule({from: 'BOW', to: 'HSB'}),
        schedule({from: 'HSB', to: 'BOW'})
    ]);
    const firstSailingHSB = scheduleToHSB[0].depart;
    const firstSailingBOW = scheduleToBOW[0].depart;
    const isHSBFirst = (moment(firstSailingHSB, timeFormat)
        .isBefore(moment(firstSailingBOW, timeFormat)));

    const rows = delay(scheduleToBOW, conditions);


    if (isHSBFirst) {
        rows.forEach((c, i) => {
            if (scheduleToHSB[i]) {
                rows[i].b = scheduleToHSB[i];
            }
        });
    } else {
        // offset to keep order
        rows.forEach((c, i) => {
            if (scheduleToHSB[i]) {
                rows[i + 1] = rows[i + 1] || {};
                rows[i + 1].b = scheduleToHSB[i];
            }
        });
    }

    let context = {conditions, scheduleToBOW, scheduleToHSB, rows};

    {
        context.json = JSON.stringify(context, null, 2);
        return {
            headers: {
                'content-type': 'text/html; charset=utf8',
                'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
            },
            statusCode: 200,
            body: template(context)
        }
    }
};


exports.handler = handler;


