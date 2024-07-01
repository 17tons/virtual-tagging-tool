const fs = require('fs');
const axios = require('axios');

async function main() {
    const folder = 'cli/paired'
    const files = fs.readdirSync(folder)
    let id = 0
    const project = "0xe18b4938cf1c48bda6c29e0be52813072dd46967d91b01ff2719423cc41049df"
    const treesOfProject = await axios.get("https://api.17tons.tech/explorer/trees/project/" + project)
    for (const file of files) {
        const path = `${folder}/${file}`
        if (path.endsWith('.csv') || path.endsWith('.DS_Store')) {
            continue
        }
        let used = [];
        let id = 0;
        console.log("Reading Geojson", path)
        const geojson = JSON.parse(fs.readFileSync(path))
        for (let i = 0; i < geojson.features.length; i++) {
            const feature = geojson.features[i]
            const exists = fs.existsSync('cli/measured/' + feature.properties.treeUUID)
            if (!exists) {
                console.log("Measuring", feature.properties.treeUUID)
                try {
                    const measured = await axios.post("https://api.17tons.tech/tag/measure", {
                        "opid": new Date().getTime(),
                        "details": {
                            "height": feature.properties.height,
                            "diameter": feature.properties.diameter,
                            "status": "LIVE",
                            "timestamp": new Date().getTime()
                        },
                        "treeUUID": feature.properties.treeUUID
                    }, {
                        headers: {
                            Authorization: "Bearer 0x930b1c974687221b38d5baa99c878605f4013c0f49cfefb1c21a18bac286a39ae379600e8a3e0e32892d51a0328833dd39a43960ecb3babadd1405baa6bef19477ba2e98b684a14699903a5e0c9c66f31de0f1242bcaff58"
                        }
                    })
                    console.log(measured.data)
                    if (measured.data.error) {
                        console.log("Error measuring", feature.properties.treeUUID)
                    } else {
                        console.log("Measured", feature.properties.treeUUID)
                        feature.properties.done = true
                        fs.writeFileSync('cli/measured/' + feature.properties.treeUUID, "")
                    }
                } catch (e) {
                    console.log("Error measuring", feature.properties.treeUUID)
                    console.log(e / message)
                }
            } else {
                console.log("Already measured", feature.properties.treeUUID)
            }
        }
        console.log("-------------------")
    }
}
main()