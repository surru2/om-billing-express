const MongoClient = require('mongodb');
const makeExcel = require('./lib/xls');
const sendFile = require('./lib/sendfile');
const sendMail = require('./lib/mailer.js');
const makeDoc = require('./lib/doc');
const cfg = require('./lib/config');
const api = require('./lib/api');
require('dotenv').config();

(async ()=>{
    console.time('Report')
    console.timeLog('Report', `Work for ${cfg.params.banks.filter(x => x.enable).length} banks started`)
    const client = await MongoClient.connect(cfg.params.mongoURL, cfg.params.mongoOpts)
    const db = client.db('express')
    const report = await cfg.params.banks.filter(x => x.enable).reduce(async (accReport, bank) => { //генерация массива [банк,docUrl,xlsUrl] для отправки письма
        try {
            const _report = await accReport;
            const details = bank.calculateType === 'standart' ?  //для каждого банка создан свой тип работы, standart обращается к req, api - в aws
                await db.collection('req').aggregate(cfg.detailQuery(bank._id, bank.reqStatuses)).toArray() :
                await api.getUsage(cfg.params.stDt,cfg.params.enDt, bank.customerName, bank.usagePlanId)
            //для экономии ресурса проверяется необходима ли группировка данных в акте по ручным,контрольным запросам и ЕГРН
            const data = bank.consolidated ? { consolidated: await db.collection('req').aggregate(cfg.groupQuery(bank._id, bank.reqStatuses)).toArray(), details } : { details }
            const docbuf = await makeDoc(data, bank)
            const xlsbuf = bank.calculateType === 'standart' ? 
                await makeExcel(data.details, cfg.params.expressTblCnfg) : //передаём детализацию и необходимые поля таблицы
                await makeExcel(data.details.map((x,i)=>{return {date:`${i+1<10?0:''}${i+1}.${cfg.getMonthYear()}`,count:x[0]}}), cfg.params.apiTblCnfg)
            docUrl = await sendFile(bank._id, docbuf, 'doc')
            xlsUrl = await sendFile(bank._id, xlsbuf, 'xlsx') 
            const result = [..._report].concat([{ name: bank.name, docUrl, xlsUrl }])
            console.timeLog('Report', `Data for the "${bank.name}" completed`)
            return result
        } catch (e) {
            console.timeLog('Report', `Data for the "${bank.name}" failed: ${e}`)
        }
    }, Promise.resolve([]));
    await sendMail(process.argv[2] || 'panov.va@mail.ru', report)
    client.close()
    console.timeEnd('Report')
    console.log('Report: done')
})()