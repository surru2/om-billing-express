const Excel = require('exceljs')

const makeExcel = async (data, tableConfig) => {
    const workbook = new Excel.Workbook()
    workbook.creator = workbook.lastModifiedBy = 'Мобильный Оценщик'
    workbook.created = workbook.modified = new Date()
    const ws = workbook.addWorksheet('Детализация', { properties: { tabColor: { argb: 'FFC0000' } } })
    ws.views = [{ zoomScale: 75 }]
    ws.addTable({
        name: 'report',
        ref: 'A1',
        headerRow: true,
        totalsRow: false,
        style: {
            theme: 'TableStyleMedium15',
            showRowStripes: true,
        },
        columns: tableConfig.map(col => ({
            name: col.name,
            key: col.key,
            filterButton: col.filterButton
        })),
      rows: data.map(row => tableConfig.map(col =>
        (typeof col.value === 'function' ? col.value(row) :
          (typeof row[col.key] !== 'undefined' ? row[col.key] :
          (typeof row[col.key.split('.')[0]] !== 'undefined' ? (row[col.key.split('.')[0]][col.key.split('.')[1]] !== 'undefined' ? row[col.key.split('.')[0]][col.key.split('.')[1]] : ''):'')))))
    });
    ws.columns.forEach((col, i) => {
        if (tableConfig[i].width) {
          col.width = tableConfig[i].width
        }
        if (tableConfig[i].style) {
          Object.keys(tableConfig[i].style).forEach(k => {
            col[k] = tableConfig[i].style[k]
          })
        }
      })
    //await workbook.xlsx.writeFile('111.xlsx')
    return await workbook.xlsx.writeBuffer()
}

module.exports = makeExcel;