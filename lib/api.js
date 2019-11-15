const HttpsProxyAgent = require('https-proxy-agent')
const httpsAgent = process.env.HTTP_PROXY ? new HttpsProxyAgent(process.env.HTTP_PROXY) : null
const moment = require('moment');
const AWS = require('aws-sdk')
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESSKEY_ID,
    secretAccessKey: process.env.AWS_ACCESSKEY_SECRET,
    region: process.env.AWS_ACCESSKEY_REGION || '',
    httpOptions: {
        agent: httpsAgent
    }
})
const apigateway = new AWS.APIGateway({
    apiVersion: '2015-07-09'
})

const getUsage = async (startDate,endDate,customerName,usagePlanId) => {
    const key = await apigateway.getUsagePlanKeys({usagePlanId:usagePlanId}).promise().then(keys=>keys.items.filter(x=>x.name===customerName).shift())
    return await apigateway.getUsage({
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).subtract(1, 'day').format('YYYY-MM-DD'),
        usagePlanId,
        keyId: key.id
    })
    .promise()
    .then(data=>data.items[key.id])
}

module.exports.getUsage = getUsage