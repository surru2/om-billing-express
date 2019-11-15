const fs = require('fs')
const { promisify } = require('util')
const doT = require('dot')

const makeDoc = async (data, bank) => {
    const fields = await bank.getActFields(data)
    let templateAct = await promisify(fs.readFile)(`./templates/${bank.template}`, 'utf8')
    var resultAct = doT.template(templateAct)(fields);
    //await promisify(fs.writeFile)(`./${bank.name}.doc`, resultAct)
    return Buffer.from(resultAct, 'utf8')
}

module.exports = makeDoc