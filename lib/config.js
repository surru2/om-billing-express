const moment = require('moment');
const digitToStr = require('./digitostr') //библиотека перевода цифр в пропись
const api = require('./api')

String.prototype.allReplace = function (obj) { //прототип массовой замены текстовых данных
    var retStr = this;
    for (var x in obj) {
        retStr = retStr.replace(new RegExp(x, 'gim'), obj[x]);
    }
    return retStr;
};

const priceFormat = (price) => {
    return price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")
}

const monthNames = ["январь", "февраль", "март", "апрель", "май", "июнь", 
    "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
];

const monthNamesGenitive = ["января", "февраля", "марта", "апреля", "мая", "июня", 
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

const params = {
    stDt: moment().utcOffset('+0300').subtract(1, 'month').startOf('month').startOf('day')._d, //начало предыдущего месяца по МСК
    enDt: moment().utcOffset('+0300').subtract(1, 'month').endOf('month').endOf('day')._d, //конец предыдущего месяца по МСК
    banks: [
        {
            enable: true,
            calculateType: 'api',
            _id: '57ffbc7300ac186e638b4567',
            name: 'name',
            reqStatuses: ['accepted', 'rejected'],
            requestLimit: 50000, //лимит запросов входящих в пакет
            fixPrice: 100000, //цена пакета запросов
            requestPrice: 10, //цена одного запроса сверх лимита
            template: 'templatename.xml',
            customerName: '',
            usagePlanId: '',
            getActFields: async function (data) {
                const requestCount = data.details.reduce((sum, day) => { //суммирование количества запросов по дням
                    return sum + day[0]
                }, 0);
                const lastDay = new Date(moment(params.enDt).subtract(1, 'day')) //последний день расчётного месяца
                return {
                    dateDigit: moment(params.enDt).subtract(1, 'day').format('DD.MM.YYYY'), //полная дата цифрами
                    date: lastDay.getDate(), //дата последнего дня расчётного месяца
                    month: monthNames[lastDay.getMonth()], //расчётный месяц
                    year: lastDay.getFullYear(), //расчётный год
                    startDt: moment(params.stDt).format('DD.MM.YYYY'), //начало расчётного периода
                    endDt: moment(params.enDt).subtract(1, 'day').format('DD.MM.YYYY'), //конец расчётного периода
                    requestCount: priceFormat(requestCount), //количество запросов
                    requestCountWord: digitToStr(requestCount, 'count'),
                    price: priceFormat(requestCount < this.requestLimit ? this.fixPrice : (requestCount - this.requestLimit) * this.requestPrice), //цена
                    priceWord: digitToStr(requestCount < this.requestLimit ? this.fixPrice : (requestCount - this.requestLimit) * this.requestPrice) //цена прописью
                }
            }
        }, {
            enable: true,
            calculateType: 'api',
            _id: '599d8b9169d50a1ca9751c2f',
            name: 'name',
            reqStatuses: ['accepted', 'rejected'],
            requestLimit: 50000, //лимит запросов входящих в пакет
            fixPrice: 125000, //цена пакета запросов
            requestPrice: 5, //цена одного запроса сверх лимита
            template: 'templatename.xml',
            customerName: '',
            usagePlanId: '',
            getActFields: async function (data) {
                const requestCount = data.details.reduce((sum, day) => { //суммирование количества запросов по дням
                    return sum + day[0]
                }, 0);
                const lastDay = new Date(moment(params.enDt).subtract(1, 'day')) //последний день расчётного месяца
                return {
                    fulldate: moment(params.enDt).subtract(1, 'day').format('DD.MM.YYYY'), //полная дата цифрами
                    date: lastDay.getDate(), //дата последнего дня расчётного месяца
                    month: monthNames[lastDay.getMonth()], //расчётный месяц
                    year: lastDay.getFullYear(), //расчётный год
                    startDt: moment(params.stDt).format('DD.MM.YYYY'), //начало расчётного периода
                    endDt: moment(params.enDt).subtract(1, 'day').format('DD.MM.YYYY'), //конец расчётного периода
                    requestCount: priceFormat(requestCount), //количество запросов
                    requestCountWord: digitToStr(requestCount, 'count'), //количество запросов
                    price: priceFormat(requestCount < this.requestLimit ? this.fixPrice : (requestCount - this.requestLimit) * this.requestPrice), //цена
                    priceWord: digitToStr(requestCount < this.requestLimit ? this.fixPrice : (requestCount - this.requestLimit) * this.requestPrice) //цена прописью
                }
            }
        }, {
            enable: true,
            calculateType: 'api',
            _id: '5a8eb1c079d1c62b218f1a8b',
            name: 'name',
            reqStatuses: ['accepted', 'rejected'],
            requestPrice: 5, //цена одного запроса сверх лимита
            template: 'templatename.xml',
            customerName: '',
            usagePlanId: '',
            getActFields: async function (data) {
                const requestCount = data.details.reduce((sum, day) => { //суммирование количества запросов по дням
                    return sum + day[0]
                }, 0);
                const lastDay = new Date(moment(params.enDt).subtract(1, 'day')) //последний день расчётного месяца
                return {
                    dateDigit: moment(params.enDt).subtract(1, 'day').format('DD.MM.YYYY'), //полная дата цифрами
                    date: lastDay.getDate(), //дата последнего дня расчётного месяца
                    month: monthNamesGenitive[lastDay.getMonth()], //расчётный месяц
                    year: lastDay.getFullYear(), //расчётный год
                    startDt: moment(params.stDt).format('DD.MM.YYYY'), //начало расчётного периода
                    endDt: moment(params.enDt).subtract(1, 'day').format('DD.MM.YYYY'), //конец расчётного периода
                    requestCount: priceFormat(requestCount), //количество запросов
                    requestCountWord: digitToStr(requestCount, 'count'), //количество запросов
                    price: priceFormat(requestCount * this.requestPrice), //цена
                    priceWord: digitToStr(requestCount * this.requestPrice) //цена прописью
                }
            }
        }, {
            enable: true,
            calculateType: 'standart',
            _id: '5d31aabbe82b685396abd52d',
            name: 'name', //Ипотека24
            reqStatuses: ['accepted', 'rejected', 'cancelled'],
            requestLimit: 200, //лимит запросов входящих в пакет
            fixPrice: 20000, //цена пакета запросов
            requestPrice: 100, //цена одного запроса сверх лимита
            template: 'templatename.xml',
            consolidated: true,
            getActFields: function (data) { //формирует список необходимых полей для формирования doc-акта
                let price = data.consolidated[0].all < this.requestLimit ? this.fixPrice : data.details.reduce((sum, task, i) => {
                    return i < this.requestLimit ? 0 : sum + this.requestPrice
                }, 0);
                const lastDay = new Date(moment(params.enDt).subtract(1, 'day')) //последний день расчётного месяца
                return {
                    date: lastDay.getDate(), //дата последнего дня расчётного месяца
                    month: monthNamesGenitive[lastDay.getMonth()], //расчётный месяц
                    year: lastDay.getFullYear(), //расчётный год
                    count: priceFormat(data.consolidated[0].all), //количество запросов
                    countWord: digitToStr(data.consolidated[0].all, 'count'),
                    tarifCount: priceFormat(this.requestLimit - data.consolidated[0].all > 0 ? 0 : Math.abs(this.limit - data.consolidated[0].all)), //количество тарифицируемых запросов
                    tarifCountWord: digitToStr(this.requestLimit - data.consolidated[0].all > 0 ? 0 : Math.abs(this.limit - data.consolidated[0].all), 'count'),
                    requestAuto: priceFormat(data.consolidated[0].auto), //кол-во автоматических запросов
                    requestAutoWord: digitToStr(data.consolidated[0].auto, 'digit'), //кол-во автоматических запросов
                    requestControl: priceFormat(data.consolidated[0].control), //кол-во запросов с ручной верификацией
                    requestControlWord: digitToStr(data.consolidated[0].control, 'digit'), //кол-во запросов с ручной верификацией
                    price: priceFormat(data.consolidated[0].all >= this.requestLimit ? price + this.fixPrice : this.fixPrice),
                    priceWord: digitToStr(data.consolidated[0].all >= this.requestLimit ? price + this.fixPrice : this.fixPrice), //общая цена прописью
                    limitPrice: priceFormat(this.fixPrice), //цена лимита запросов банка
                    limitPriceWord: digitToStr(this.fixPrice), //цена лимита запросов банка прописью
                    limit: priceFormat(this.requestLimit), //лимит запросов банка     
                    limitWord: digitToStr(this.requestLimit, 'count'), //лимит запросов банка     
                    overLimitPrice: priceFormat(data.consolidated[0].all >= this.requestLimit ? price : 0), //поштучная оплата запросов
                    overLimitPriceWord: digitToStr(data.consolidated[0].all >= this.requestLimit ? price : 0), //поштучная оплата запросов прописью
                    requestPrice: priceFormat(this.requestPrice), //цена одного запроса сверх лимита
                    requestPriceWord: digitToStr(this.requestPrice), //цена одного запроса сверх лимита
                    overLimitRequests: priceFormat(data.consolidated[0].all > this.requestLimit ? Math.abs(this.requestLimit - data.consolidated[0].all) : 0), //запросов сверх лимита
                    overLimitRequestsWord: digitToStr(data.consolidated[0].all > this.requestLimit ? Math.abs(this.requestLimit - data.consolidated[0].all) : 0, 'digit') //запросов сверх лимита
                }
            }
        }, {
            enable: true,
            calculateType: 'standart',
            _id: '5a5da95312582225d178b979',
            name: 'name',
            reqStatuses: ['accepted', 'rejected'],
            fixPrice: 25000, //цена пакета запросов
            template: 'templatename.xml',
            getActFields: function (data) { //формирует список необходимых полей для формирования doc-акта
                let requestTarif = data.details.reduce((count, request) => { //тарифицируются запросы только где отправитель и получатель совпадают
                    return request.from.org.name === request.to.org.name ? count += 1 : count
                }, 0);
                const lastDay = new Date(moment(params.enDt).subtract(1, 'day')) //последний день расчётного месяца
                return {
                    dateDigit: moment(params.enDt).subtract(1, 'day').format('DD.MM.YYYY'), //полная дата цифрами
                    date: lastDay.getDate(), //дата последнего дня расчётного месяца
                    month: monthNamesGenitive[lastDay.getMonth()], //расчётный месяц
                    year: lastDay.getFullYear(), //расчётный год
                    startDt: moment(params.stDt).format('DD.MM.YYYY'), //начало расчётного периода
                    endDt: moment(params.enDt).subtract(1, 'day').format('DD.MM.YYYY'), //конец расчётного периода
                    requestCount: priceFormat(data.details.length), //количество запросов
                    requestCountWord: digitToStr(data.details.length, 'count'), //количество запросов
                    requestTarif: priceFormat(requestTarif), //количество тарифицируемых запросов
                    requestTarifWord: digitToStr(requestTarif, 'count'), //количество тарифицируемых запросов
                    errorRequest: priceFormat(9),
                    errorPercent: (9 / requestTarif * 100).toFixed(1),
                    qualityLevel: 'низкому',
                    price: priceFormat(this.fixPrice), //цена
                    priceWord: digitToStr(this.fixPrice) //цена прописью
                }
            }
        }, {
            enable: true,
            calculateType: 'standart',
            _id: '5a9698c679d1c62b218f1a8d',
            name: 'name',
            reqStatuses: ['accepted', 'rejected'],
            fixPrice: 30000, //цена пакета запросов
            template: 'templatename.xml',
            consolidated: true,
            getActFields: function (data) { //формирует список необходимых полей для формирования doc-акта
                const requestTarif = data.details.reduce((count, request) => { //тарифицируются запросы только где отправитель и получатель совпадают
                    return count += request.from.org.name === request.to.org.name ? 1 : 0
                }, 0);
                const firstDay = new Date(moment(params.stDt)) //первый день расчётного месяца
                const lastDay = new Date(moment(params.enDt).subtract(1, 'day')) //последний день расчётного месяца
                return {
                    dateDigit: moment(params.enDt).subtract(1, 'day').format('DD.MM.YYYY'), //полная дата цифрами
                    startDt: `«${firstDay.getDate() < 10 && 0}${firstDay.getDate()}» ${monthNamesGenitive[firstDay.getMonth()]} ${firstDay.getFullYear()}`,
                    endDt: `«${lastDay.getDate()}» ${monthNamesGenitive[lastDay.getMonth()]} ${lastDay.getFullYear()}`,
                    requestCount: priceFormat(data.details.length), //количество запросов
                    requestCountWord: digitToStr(data.details.length, 'count'), //количество запросов
                    requestTarif: priceFormat(requestTarif), //количество тарифицируемых запросов
                    requestTarifWord: digitToStr(requestTarif, 'count'), //количество тарифицируемых запросов
                    price: priceFormat(this.fixPrice), //цена
                    priceWord: digitToStr(this.fixPrice) //цена прописью
                }
            }
        }, {
            enable: true,
            calculateType: 'standart',
            _id: '5d25a3ab7353101cefdc3c20',
            name: 'name',
            reqStatuses: ['accepted', 'rejected', 'cancelled'],
            fixPrice: 45000, //цена пакета запросов
            template: 'templatename.xml',
            customerName: '',
            usagePlanId: '',
            consolidated: true,
            getActFields: async function (data) { //формирует список необходимых полей для формирования doc-акта
                const requests = await api.getUsage(params.stDt, params.enDt, this.customerName, this.usagePlanId) //получение количество запросов к api
                const requestVerification = requests.reduce((sum, day) => { //суммирование количества запросов по дням
                    return sum + day[0]
                }, 0);
                let requestTarif = data.details.reduce((count, request) => {
                    count += request.status !== 'Отменено' ? 1 : 0
                    return count
                }, 0);
                return {
                    dateDigit: moment(params.enDt).subtract(1, 'day').format('DD.MM.YYYY'), //полная дата цифрами
                    startDt: moment(params.stDt).format('DD.MM.YYYY'),
                    endDt: moment(params.enDt).subtract(1, 'day').format('DD.MM.YYYY'),
                    requestVerification: priceFormat(requestTarif), //количество запросов в API
                    requestVerificationWord: digitToStr(requestTarif, 'count'), //количество запросов в API
                    requestEssessment: priceFormat(requestVerification), //количество запросов на экспресс-оценку
                    requestEssessmentWord: digitToStr(requestVerification, 'count'), //количество запросов на экспресс-оценку
                    requestEgrn: priceFormat(data.consolidated[0].egrn), //количество запросов на предоставление выписки ЕГРН
                    requestEgrnWord: digitToStr(data.consolidated[0].egrn, 'count'), //количество запросов на предоставление выписки ЕГРН
                    price: priceFormat(this.fixPrice), //цена
                    priceword: digitToStr(this.fixPrice) //цена прописью
                }
            }
        }, {
            enable: true,
            calculateType: 'standart',
            _id: '599d8b9169d50a1ca9751c2f',
            name: 'name',
            reqStatuses: ['accepted', 'rejected', 'cancelled'],
            template: 'templatename.xml',
            consolidated: true,
            getActFields: async function (data) {
                let requestTarif = data.details.reduce((count, request) => {
                    count.expressAll += request.status !== 'Отменено' ? 1 : 0
                    count.expressCountFlat += request.params.market === 'Жилая' && request.status !== 'Отменено' ? 1 : 0
                    count.batchAssessmentCount += request.batch && request.status !== 'Отменено' ? 1 : 0
                    count.assessmentReport += request.files && request.status !== 'Отменено' ? (request.files.length ? 1 : 0) : 0
                    return count
                }, {
                    expressAll: 0,
                    expressCountFlat: 0,
                    batchAssessmentCount: 0,
                    assessmentReport: 0
                });
                return {
                    dateDigit: moment(params.enDt).subtract(1, 'day').format('DD.MM.YYYY'), //полная дата цифрами
                    startDate: moment(params.stDt).format('DD.MM.YYYY'), //начало периода
                    endDate: moment(params.enDt).subtract(1, 'day').format('DD.MM.YYYY'), //конец периода
                    requestCount: priceFormat(requestTarif.expressAll), //количество запросов
                    requestCountWord: digitToStr(requestTarif.expressAll, 'count'),
                    expressCountFlat: priceFormat(requestTarif.expressCountFlat), //Экспресс-оценка  – квартиры
                    expressCountFlatWord: digitToStr(requestTarif.expressCountFlat, 'digit'),
                    expressCountOther: priceFormat(requestTarif.expressAll - requestTarif.expressCountFlat), //Экспресс-оценка  – иное имущество 
                    expressCountOtherWord: digitToStr(requestTarif.expressAll - requestTarif.expressCountFlat, 'digit'),
                    ergnCount: priceFormat(data.consolidated[0].egrn), //Получение сведений (выписок) из ЕГРН
                    ergnCountWord: digitToStr(data.consolidated[0].egrn, 'digit'),
                    batchAssessmentCount: priceFormat(requestTarif.batchAssessmentCount), //Пакетная оценка рыночной стоимости квартир
                    batchAssessmentCountWord: digitToStr(requestTarif.batchAssessmentCount, 'digit'),
                    assessmentReport: priceFormat(requestTarif.assessmentReport), //Получение Отчета об оценке квартир
                    assessmentReportWord: digitToStr(requestTarif.assessmentReport, 'digit'),
                }
            }
        }
    ],
    mongoURL: process.env.EXPRESS_MONGO_URL,
    mongoOpts: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    expressTblCnfg: [
        { name: 'Ссылка', key: '_id', filterButton: false, value: (row) => `https://express.ocenka.mobi/#view/${row._id.toString()}` },
        { name: 'Дата создания', key: 'submitDt', filterButton: true, width: 17, style: { numFmt: 'dd/mm/yyyy HH:mm' } },
        { name: 'Дата(авт.)', key: 'auto.endDt', filterButton: true, width: 17, style: { numFmt: 'dd/mm/yyyy HH:mm' } },
        { name: 'Дата(ручн.)', key: 'control.endDt', filterButton: true, width: 17, style: { numFmt: 'dd/mm/yyyy HH:mm' } },
        { name: 'Статус', key: 'status', filterButton: true, width: 15 },
        { name: 'ЕГРН', key: 'egrn.status', filterButton: true, width: 15 },
        { name: 'ЕГРН дата', key: 'egrn.statusUpdateDt', filterButton: true, width: 15 },
        { name: 'Тип имущества', key: 'params.market', filterButton: true, width: 15 },
        { name: 'Тип', key: 'params.type', filterButton: true, width: 15 },
        { name: 'Подтип', key: 'params.subType', filterButton: true, width: 15 },
        { name: 'Адрес', key: 'params.address', filterButton: false },
        { name: 'VIN', key: 'params.vin', filterButton: false },
        { name: 'Цена', key: 'price', filterButton: false, width: 15, style: { numFmt: '#,##р' } }
    ],
    apiTblCnfg: [
        { name: 'Дата', key: 'date', filterButton: true, width: 17, style: { numFmt: 'dd/mm/yyyy HH:mm' } },
        { name: 'Количество', key: 'count', filterButton: true, width: 15 },
    ]
}

const match = (bankId, reqStatuses) => { //match данных по банку за предыдущий месяц
    return {
        $match: {
            'to.org._id': bankId,
            status: { $in: reqStatuses },
            submitDt: {
                $gte: params.stDt,
                $lte: params.enDt
            }
        }
    }
}

const detailQuery = (bankId, reqStatuses) => { //детализация запросов по банку
    return [
        match(bankId, reqStatuses),
        {
            $project: {
                '_id': 1,
                'from.org.name': 1,
                'to.org.name': 1,
                'to.org._id': 1,
                'submitDt': 1,
                'auto.endDt': 1,
                'control.endDt': 1,
                'egrn.status': 1,
                'egrn.statusUpdateDt': 1,
                'status': {
                    $switch: {
                        branches: [
                            { case: { $eq: ['$status', 'cancelled'] }, then: 'Отменено' },
                            { case: { $eq: ['$status', 'accepeted'] }, then: 'Принято' },
                            { case: { $eq: ['$status', 'rejected'] }, then: 'Отклонено' },
                            { case: { $ne: ["$params.objPrice", false] }, then: 'Готово' }
                        ]
                    }
                },
                'params.market': {
                    $switch: {
                        branches: [
                            { case: { $eq: ['$params.market', 'flat'] }, then: 'Жилая' },
                            { case: { $eq: ['$params.market', 'comm'] }, then: 'Коммерческая' },
                            { case: { $eq: ['$params.market', 'resid'] }, then: 'Загородка' },
                            { case: { $eq: ['$params.market', 'parking'] }, then: 'Гараж' },
                            { case: { $eq: ['$params.market', 'auto'] }, then: 'Автотранспорт' },
                            { case: { $eq: ['$params.market', 'machin'] }, then: 'Оборудование' }
                        ]
                    }
                },
                'params.type': 1,
                'params.subType': 1,
                'params.address': 1,
                'params.vin': 1,
                'price': 1,
                'batch': 1,
                'files': 1
            }
        },
        { $sort: { 'submitDt': 1 } }
    ]
}

const groupQuery = (bankId, reqStatuses) => { //сводная по количеству ручных, автоматических и общее число запросов
    return [
        match(bankId, reqStatuses),
        {
            $group: {
                _id: '$to.org._id',
                all: { $sum: 1 },
                auto: { $sum: { $cond: [{ $ne: ['$control.endDt', null] }, 1, 0] } },
                control: { $sum: { $cond: [{ $ne: ['$control.endDt', null] }, 0, 1] } },
                egrn: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $ne: ['$egrn', null] },
                                    { $eq: ['$egrn.status', 'Завершен'] },
                                    { $gte: ['$egrn.statusUpdateDt', params.stDt] },
                                    { $lte: ['$egrn.statusUpdateDt', params.enDt] }
                                ]
                            }, 1, 0
                        ]
                    }
                },
            }
        }
    ]
}

const reportPeriod = () => {
    const lastDay = new Date(moment(params.enDt).subtract(1, 'day'))
    return `${monthNames[lastDay.getMonth()]} ${lastDay.getFullYear()}`
}

const getMonthYear = () => {
    const lastDay = new Date(moment(params.enDt).subtract(1, 'day'))
    return `${lastDay.getMonth() + 1 < 10 ? 0 : ''}${lastDay.getMonth() + 1}.${lastDay.getFullYear()}`
}

module.exports.params = params
module.exports.detailQuery = detailQuery
module.exports.groupQuery = groupQuery
module.exports.reportPeriod = reportPeriod
module.exports.getMonthYear = getMonthYear