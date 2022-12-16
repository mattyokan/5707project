const fs = require("fs")
const csv = require('csv-parser')
const postgres = require('postgres')
globalFoods = fs.readFileSync('pruned.json')
const allergies = JSON.parse(fs.readFileSync('allergies.json'))

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

    for (const allergy of allergies) {
        const ingredient = ingredients.find(i => i.name === allergy.food)
        if(ingredient) {
            console.log("Ingredient ", ingredient, " found for allergy ", allergy.allergy)
            console.log(`Inserting (${allergy.allergy}, ${ingredient.ingredientid}, ${allergy.type}, ${allergy.group}, ${allergy.class})`)
            await sql`INSERT INTO Allergy (name, ingredientid, type, foodgroup, origin) VALUES (${allergy.allergy}, ${ingredient.ingredientid}, ${allergy.type}, ${allergy.group}, ${allergy.class}) ON CONFLICT DO NOTHING`
        }
    }

}

setupDatabase()
    .then(() => {
    })