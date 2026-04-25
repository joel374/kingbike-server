const db = require("./models");

async function check() {
  const cats = await db.Category.findAll();
  const brands = await db.Brand_Category.findAll();
  console.log("Categories:", JSON.stringify(cats, null, 2));
  console.log("Brands:", JSON.stringify(brands, null, 2));
  process.exit();
}

check();
