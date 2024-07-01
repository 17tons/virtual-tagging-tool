const fs = require('fs');
const axios = require('axios');

async function main() {
    const folder = 'cli/fixed'
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
        const pairs = {}
        const geojson = JSON.parse(fs.readFileSync(path))
        for (let j = 0; j < treesOfProject.data.trees.length; j++) {
            const tree = treesOfProject.data.trees[j]
            used.push(tree.treeUUID)
            pairs[id] = tree.treeUUID
            id++
        }
        for (let i = 0; i < geojson.features.length; i++) {
            const feature = geojson.features[i]
            feature.properties.treeUUID = pairs[feature.id]
        }
        fs.writeFileSync("cli/paired/" + file, JSON.stringify(geojson, null, 2))
        console.log("-------------------")
    }
}
main()