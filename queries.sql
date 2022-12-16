-- Select the counts of cereals manufacturers have which contain added sugar
SELECT M.name, COUNT(C.UPC)
FROM Manufacturer M,
     Cereal C
WHERE M.id = C.manufacturerid
  AND C.upc IN (SELECT DISTINCT C1.upc
                FROM Cereal C1,
                     Nutrient N,
                     CerealNutrient CN
                WHERE CN.upc = C1.upc
                  AND N.name = 'addedSugar'
                  AND CN.amount > 0)
GROUP BY M.name;


-- Select the cereals which contain
-- ingredients which trigger a rice allergy
SELECT C.name
FROM Cereal C,
     CerealIngredient I,
     Allergy A
WHERE I.upc = C.upc
  AND I.ingredientid = A.ingredientid
  AND A.name = 'Rice Allergy';

-- Get the five cereals with the highest fiber content per serving
SELECT C.name, CN.amount AS fiberGrams
FROM Cereal C,
     CerealNutrient CN,
     Nutrient N
WHERE CN.upc = C.upc
  AND CN.nutrientid = N.id
  AND N.name = 'fiber'
ORDER BY CN.amount DESC
LIMIT 5;


-- Get the amounts of calcium and iron in each cereal.
SELECT C.name, CN1.amount AS calciumAmount, CN2.amount AS ironAmount
FROM Cereal C,
     CerealNutrient CN1,
     CerealNutrient CN2,
     Nutrient N1,
     Nutrient N2
WHERE CN1.upc = C.upc
  AND CN2.upc = C.upc
  AND CN1.nutrientid = N1.id
  AND CN2.nutrientid = N2.id
  AND N1.name = 'calcium'
  AND N2.name = 'iron';

-- Find cereals which contain the least added sugars
SELECT C.name, CN.amount AS addedSugarGrams
FROM Cereal C,
     CerealNutrient CN,
     Nutrient N
WHERE CN.upc = C.upc
  AND CN.nutrientid = N.id
  AND N.name = 'addedSugar'
ORDER BY CN.amount
LIMIT 15;

-- Find manufacturers which contain the highest amount of average added sugars
SELECT M.name, AVG(CN.amount) AS averageSugars
FROM Manufacturer M,
     CerealNutrient CN,
     Nutrient N,
     Cereal C
WHERE C.upc = CN.upc
  AND N.id = CN.nutrientid
  AND C.manufacturerid = M.id
GROUP BY M.name
ORDER BY averageSugars DESC;
