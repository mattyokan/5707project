-- Represents a cereal product which consumers may choose.
CREATE TABLE Cereal
(
    -- The UPC of this cereal, which uniquely identifies it.
    upc            BIGINT,
    -- The name of this cereal.
    name           VARCHAR(64),
    -- A description of this cereal.
    description    VARCHAR(256),
    -- The ID of the manufacturer of this cereal.
    manufacturerId INTEGER,
    -- The health rating of this cereal.
    healthRating  REAL,

    PRIMARY KEY (upc),
    FOREIGN KEY (manufacturerId) REFERENCES Manufacturer
        ON DELETE CASCADE
);

-- Represents a manufacturer which creates cereals.
CREATE TABLE Manufacturer
(
    -- The internal ID of this manufacturer.
    id   SERIAL PRIMARY KEY,
    -- The company name of this manufacturer.
    name VARCHAR(64)
);


-- Represents a food ingredient.
CREATE TABLE Ingredient
(
    -- The internal ID of this ingredient.
    ingredientId SERIAL PRIMARY KEY,
    -- The name of this ingredient.
    name         VARCHAR(128)

);

-- Represents an ingredient contained within a cereal and its relative ranking.
CREATE TABLE CerealIngredient
(

    -- The UPC of the cereal the ingredient belongs to.
    upc          BIGINT,
    -- The ingredient ID, corresponding to a key from the Ingredient table.
    ingredientId INTEGER,
    -- The rank of this ingredient in the cereal it belongs to, starting at 1.
    -- A lower rank corresponds to a more frequent ingredient according to USDA standards.
    rank         INTEGER,

    -- A cereal ingredient is identifiable based on
    -- the cereal it belongs to and the name of the ingredient.
    PRIMARY KEY (upc, ingredientId),
    FOREIGN KEY (upc) REFERENCES Cereal ON DELETE CASCADE,
    FOREIGN KEY (ingredientId) REFERENCES Ingredient ON DELETE CASCADE
);

-- Represents a nutrient of interest, such as protein or fat.
CREATE TABLE Nutrient
(
    -- The internal ID of this nutrient.
    id   SERIAL,
    -- The name of this nutrient.
    name VARCHAR(128),

    PRIMARY KEY (id)
);

-- Represents an amount of a nutrient contained within a cereal.
CREATE TABLE CerealNutrient
(
    -- The UPC of the cereal the ingredient belongs to.
    upc        BIGINT,
    -- The internal ID of the nutrient this cereal contains.
    nutrientId INTEGER,
    -- The amount of this nutrient contained within the cereal.
    amount     DECIMAL,

    PRIMARY KEY (upc, nutrientId),
    FOREIGN KEY (upc) REFERENCES Cereal ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (nutrientId) REFERENCES Nutrient ON DELETE CASCADE ON UPDATE CASCADE
);


-- Represents an allergy and an ingredient which causes it.
CREATE TABLE Allergy
(
    -- The name of this allergy.
    name         VARCHAR(64),
    -- The internal ID of the ingredient from the Ingredient
    -- table which causes this allergy.
    ingredientId INTEGER,
    -- The type of allergy this is
    -- (e.g vegetable, legume, plant, etc).
    type         VARCHAR(128),
    -- The food group related to this allergy.
    foodGroup    VARCHAR(128),
    -- The origin of this allergen
    -- (e.g. plant/animal origin)
    origin       VARCHAR(128),

    PRIMARY KEY (name, ingredientId),
    FOREIGN KEY (ingredientId) REFERENCES Ingredient ON DELETE CASCADE

);
