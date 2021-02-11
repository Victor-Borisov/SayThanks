const moment = require('moment')
const Thank = require('../models/Thank')
const errorHandler = require('../utils/errorHandler')

module.exports.overview = async function(req, res) {
    try {
        const allThanks = await Thank.find({user: req.user.id}).sort({date: 1});
        const thanksMap = getThanksMap(allThanks);
        //const todayThanks = thanksMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || {"neededThank": 0, "sayedThank": 0, "ratio": 0}
        const todayThanks = thanksMap[moment().format('DD.MM.YYYY')] || {"neededThank": 0, "sayedThank": 0, "ratio": 0}
        //Сегодняшние показатели
        const todaySayedThanks = todayThanks.sayedThank;
        const todayRatio = (todayThanks.ratio * 100).toFixed(2);
        //Количество дней
        const daysCount = Object.keys(thanksMap).length;
        //Количество показателей за все дни
        let neededThankCount = 0;
        let sayedThankCount = 0;
        let ratioSumm = 0;
        for (let key in thanksMap) {
            neededThankCount += thanksMap[key].neededThank;
            sayedThankCount += thanksMap[key].sayedThank;
            ratioSumm += thanksMap[key].ratio;
        }
        //Среднее количество сказанных спасибо в день
        const middleSayedThanks = daysCount > 0 ? sayedThankCount / daysCount : 0
        //Средняя выполненность задачи в день
        const middleRatio = daysCount > 0 ? (ratioSumm / daysCount * 100).toFixed(2) : 0
        //Процент сказанных сегодня спасибо от среднего в день, на сколько больше
        const todayThanksPercent = ((todaySayedThanks / middleSayedThanks - 1) * 100).toFixed(2)
        //Процент выполненности задачи сегодня от средней выполненности задачи, на сколько больше
        const todayRatioPercent = ((todayRatio / middleRatio - 1) * 100).toFixed(2)
        //Сравнение количества спасибо сегодня со средним знчением в день
        const compareNumber = (todaySayedThanks - middleSayedThanks).toFixed(2)
        //Сравнение выполненности задачи сегодня со средним знчением в день
        const compareRatio = (todayRatio - middleRatio).toFixed(2)

        res.status(200).json({
            completedTask: {
              percent: Math.abs(+todayRatioPercent),
              compare: Math.abs(+compareRatio),
              today: +todayRatio,
              middle: (+middleRatio).toFixed(2),
              isHigher: +compareRatio > 0
            },
            sayedThanks: {
              percent: Math.abs(+todayThanksPercent),
              compare: Math.abs(+compareNumber),
              today: +todaySayedThanks,
              middle: (+middleSayedThanks).toFixed(2),
              isHigher: +compareNumber >= 0
            }
        })


    }
    catch (e) {
        errorHandler(res, e);
    }
}

module.exports.analytics = async function(req, res) {
    const allThanks = await Thank.find({user: req.user.id}).sort({date: 1});
    const thanksMap = getThanksMap(allThanks);
    //Количество дней
    const daysCount = Object.keys(thanksMap).length;
    //Количество показателей за все дни
    let neededThankCount = 0;
    let sayedThankCount = 0;
    let ratioSumm = 0;
    for (let key in thanksMap) {
        neededThankCount += thanksMap[key].neededThank;
        sayedThankCount += thanksMap[key].sayedThank;
        ratioSumm += thanksMap[key].ratio;
    }
    //Среднее количество сказанных спасибо в день
    const middleSayedThanks = daysCount > 0 ? sayedThankCount / daysCount : 0
    const average = +(middleSayedThanks).toFixed(2)

    const chart = Object.keys(thanksMap).map(label => {
      const ratio = (thanksMap[label].ratio * 100).toFixed(2)
      const thanks = thanksMap[label].sayedThank

      return {label, thanks, ratio}
    })

    res.status(200).json({average, chart})

}

function getThanksMap(thanks = []) {
    const daysThanks = {};
    thanks.forEach(thankDay => {
        const date = moment(thankDay.createdOn).format('DD.MM.YYYY');
        /*if (date === moment().format('DD.MM.YYYY')) {
            return;
        }*/
        let neededThank = 0;
        let sayedThank = 0;
        thankDay.list.forEach(thank => {
            neededThank++;
            if (thank.thanked == 1) {
                sayedThank++;
            }
        });

        const ratio = neededThank == 0 ? 0 : sayedThank / neededThank;
        daysThanks[date] = {
            "neededThank": neededThank,
            "sayedThank": sayedThank,
            "ratio": ratio
        }
    })
    return daysThanks;
}