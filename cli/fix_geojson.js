const fs = require('fs');

async function main() {
    const folder = 'cli/demo_meta'
    const files = fs.readdirSync(folder)
    let id = 0
    for (const file of files) {
        const path = `${folder}/${file}`
        if (path.endsWith('.csv') || path.endsWith('.DS_Store')) {
            continue
        }
        console.log("Reading Geojson", path)
        const geojson = JSON.parse(fs.readFileSync(path))
        const relativeCsv = path.replace('.geojson', '.csv')
        console.log("Relative csv", relativeCsv)
        const csv = fs.readFileSync(relativeCsv, 'utf8')
        const csvRows = csv.split('\n')
        for (let i = 0; i < geojson.features.length; i++) {
            const feature = geojson.features[i]
            const properties = feature.properties
            const csvColumns = csvRows[i + 1].split(',')
            feature.id = id
            properties.type = csvColumns[0]
            properties.height = parseFloat(csvColumns[1].replace("\r", "")).toFixed(2)
            properties.diameter = parseFloat(csvColumns[2].replace("\r", "")).toFixed(2)
            console.log(feature)
            id++
        }
        fs.writeFileSync("cli/fixed/" + file, JSON.stringify(geojson, null, 2))
        console.log("-------------------")
    }
}
main()