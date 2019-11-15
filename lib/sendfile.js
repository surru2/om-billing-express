const aws4 = require('aws4')
const got = require('got')
require('dotenv').config();

const sendFile = async (orgId,buf,type) => {
    const filePath = `om-invoice/express/${orgId}/${new Date().toISOString().replace(/[^\d]/g, '').substr(0, 6)}-detail.${type}`
    const headers = {
        'X-Amz-Storage-Class': 'COLD', // https://cloud.yandex.ru/docs/storage/concepts/storage-class#identifikatory-klassov-hranilisha
        'X-Amz-ACL': 'public-read' // https://cloud.yandex.ru/docs/storage/concepts/acl#predefined_acls
    }
    const opts = {
        service: 's3',
        method: 'PUT',
        host: 'storage.yandexcloud.net',
        path: `${filePath}?X-Amz-Expires=300`,
        headers,
        signQuery: true
    }
    aws4.sign(opts, { accessKeyId: process.env.YANDEX_CLOUD_STORAGE_KEY, secretAccessKey: process.env.YANDEX_CLOUD_STORAGE_SECRET })
    const uploadUrl = `https://storage.yandexcloud.net/${opts.path}`
    const downloadUrl = `https://storage.yandexcloud.net/${filePath}`

    await got(uploadUrl, {
        method: 'PUT',
        body: buf,
        headers,
        agent: null
    })
    //console.log('Uploaded:', downloadUrl)
    return downloadUrl
}

module.exports = sendFile

