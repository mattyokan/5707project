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

    let nutrients = []

    const xs = await sql`
        SELECT *
        FROM Nutrient
    `

    nutrients = xs

    for (const cereal of data) {
        for (const nutrient of nutrients) {
            const entry = kaggleData.find(c => cereal.gtinUpc.includes(c.gtinUpc))
            if (entry) {
                const cerealNutrients = cereal.labelNutrients
                const amount = cerealNutrients[nutrient.name]
                if(amount) {
                    console.log("Inserting (", entry.gtinUpc, ", ", nutrient.id, ", ", amount.value , ")")
                    await sql`
                        INSERT INTO CerealNutrient (upc, nutrientid, amount) VALUES (${entry.gtinUpc}, ${nutrient.id}, ${amount.value}) ON CONFLICT DO NOTHING
                    `
                }
            } else {
                console.log("Missing manufacturer ID for cereal ", cereal)
            }
        }
    }

}

setupDatabase()
    .then(() => {
    })