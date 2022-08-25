const moment = require('moment');
const timeFormat = 'hh:mm AA';

const delay = (actual, expected) => {
    const diff = moment
        .duration(
            moment(expected, timeFormat)
                .diff(moment(actual, timeFormat)));

    if (diff.asMinutes() < 0) {
    return `${-diff.asMinutes()} minutes early`;
    }
    if (diff.asMinutes() > 0) {
    return `${diff.asMinutes()} minutes late`;
    }
    return 'on time'
}


function calculateEarlyDeparture(c, b) {
    const departC = moment(c.departed || c.depart, timeFormat);
    const departB = moment(b.depart, timeFormat);

    let howEarlyDidItDepart = moment.duration(departC.diff(departB));
    console.log('howEarlyDidItDepart.asMinutes())',howEarlyDidItDepart.asMinutes())
    console.log('departB',departB.format(timeFormat))
    console.log('departC',departC.format(timeFormat))
    return howEarlyDidItDepart.asMinutes();
}

module.exports = (schedule, conditions) => {
    let offset = 0;
    return conditions
        .map((c, i) => {
            let b, departedTooEarly;
            do {
                b = schedule[i+offset];
                if (b) {
                    let departedTooEarly = calculateEarlyDeparture(c, b) < -15;
                    console.log('departedTooEarly',departedTooEarly);
                    if (departedTooEarly) {
                        offset++;
                    }
                } else {
                    departedTooEarly = false;
                }
            } while (departedTooEarly);

            if (b) {
                if (c.departed && b.depart) {
                    c.delayDepart = delay(b.depart, c.departed)
                }
                if (c.arrived && b.arrive) {
                    c.delayArrive = delay(b.arrive, c.arrived);
                }

                if (c.delayArrive) {
                    c.delay = c.delayArrive;
                } else if (c.delayDepart) {
                    c.delay = c.delayDepart;
                }
            }
            return {i, ...c, ...b}
        });
}
