const cfg = require('./config');
const SES = require('aws-sdk').SES
const sesClient = new SES({
  region: process.env.AWS_ACCESSKEY_REGION,
  accessKeyId: process.env.SES_ACCESS_KEY,
  secretAccessKey: process.env.SES_SECRET
})

module.exports = async (mail,report) => {
  let mailHeader = `
  <style>
    table{
      border: 0
    }
    .cnt {
      text-align: center;
    }
  </style>
  <table>
  <tr>
    <th>Организация</th>
    <th class="cnt">Акт</th>
    <th class="cnt">Детализация</th>
  </tr>`
  let mailbody = report.reduce((body, bank) => {
  return body + `
  <tr>
    <td>${bank.name}</td>
    <td class="cnt"><a href="${bank.docUrl}" target="_self">Скачать</a></td>
    <td class="cnt">${bank.xlsUrl && `<a href="${bank.xlsUrl}" target="_self">Скачать</a>`}</td>
  </tr>` 
  }, mailHeader);
  mailbody+='</table>'
  const emailOptions = {
    Destination: {
      ToAddresses: [mail],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'utf-8',
          Data: mailbody
        }
      },
      Subject: {
        Data: `Акты ${cfg.reportPeriod()}`,
        Charset: 'utf-8'
      }
    },
    Source: '=?UTF-8?B?0JzQvtCx0LjQu9GM0L3Ri9C5INCe0YbQtdC90YnQuNC6?= <username@mail.domain>'
  }
  await sesClient.sendEmail(emailOptions).promise()
  //console.log(`Message sended to ${mail}`)
}