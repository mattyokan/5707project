const fs = require("fs")
const csv = require('csv-parser')
const postgres = require('postgres')
globalFoods = fs.readFileSync('pruned.json')

data = JSON.parse(globalFoods)
const kaggleData = JSON.parse(fs.readFileSync("kaggle_with_ingredients.json"))

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

async function setupDatabase() {
    const sql = postgres({
        host: process.env.POSTGRES_DB_HOST,
        port: process.env.POSTGRES_DB_PORT,
        database: process.env.POSTGRES_DB_NAME,
        username: process.env.POSTGRES_DB_USERNAME,
        password: process.env.POSTGRES_DB_PASSWORD,
        ssl: 'require'
    })

    let manufacturers = []

    const xs = await sql`
        SELECT * FROM manufacturer
    `

    manufacturers = xs

    kaggleData.forEach(k => console.log("Have kaggle data ", k))

    for (const cereal of data) {
        const manufacturerId = manufacturers.find(m => cereal.brandOwner === m.name)?.id
        if(manufacturerId) {
            console.log("Cereal ", cereal.description, " has manufacturer ID ", manufacturerId)
            const entry = kaggleData.find(c => cereal.gtinUpc.includes(c.gtinUpc))
            console.log(`Going to insert data (upc=${entry.gtinUpc}, name=${entry.name}, description=${cereal.description}, manufacturerId=${manufacturerId})`)
            const insertionResult = await sql`
                INSERT INTO Cereal (upc, name, description, manufacturerid) VALUES (${entry.gtinUpc}, ${entry.name}, ${cereal.description}, ${manufacturerId}) ON CONFLICT DO NOTHING
            `
        } else {
            console.log("Missing manufacturer ID for cereal ", cereal)
        }
    }

}

setupDatabase()
.then(() => {})