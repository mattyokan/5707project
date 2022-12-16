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

    let ingredients = []

    const xs = await sql`
        SELECT *
        FROM Ingredient
    `

    ingredients = xs

    kaggleData.forEach(k => console.log("Have kaggle data ", k))

    for (const cereal of data) {
        for (const ingredient of ingredients) {
            const entry = kaggleData.find(c => cereal.gtinUpc.includes(c.gtinUpc))
            if (entry) {
                const cerealIngredients = entry.ingredients.map(i => i.toUpperCase())
                const idx = cerealIngredients.indexOf(ingredient.name)
                if(idx !== -1) {
                    const rank = idx + 1 // convention: rank 1 is minimum
                    console.log("Inserting (", entry.gtinUpc, ", ", ingredient.ingredientid, ", ", rank , ")")
                    await sql`
                        INSERT INTO CerealIngredient (upc, ingredientid, rank) VALUES (${entry.gtinUpc}, ${ingredient.ingredientid}, ${rank}) ON CONFLICT DO NOTHING
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