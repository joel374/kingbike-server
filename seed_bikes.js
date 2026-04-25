const db = require("./models");

const products = [
  {
    product_name: "Polygon Xtrada 5",
    SKU: 1001,
    stock: 15,
    price: 6250000,
    description: "Hardtail Mountain Bike yang handal untuk segala medan.",
    weight: 14000,
    length: 170,
    width: 20,
    height: 100,
    CategoryId: 5,
    BrandCategoryId: 5,
    image: "xtrada5.png"
  },
  {
    product_name: "United Detroit 1.0",
    SKU: 1002,
    stock: 10,
    price: 3500000,
    description: "MTB entry-level tangguh dengan desain sporty.",
    weight: 15000,
    length: 175,
    width: 20,
    height: 105,
    CategoryId: 5,
    BrandCategoryId: 6,
    image: "detroit1.png"
  },
  {
    product_name: "United Sterling R1",
    SKU: 1004,
    stock: 5,
    price: 12500000,
    description: "Road bike performa tinggi untuk kecepatan maksimal.",
    weight: 9000,
    length: 165,
    width: 15,
    height: 95,
    CategoryId: 6,
    BrandCategoryId: 6,
    image: "sterling.png"
  },
  {
    product_name: "Pacific Noris 2.0",
    SKU: 1005,
    stock: 25,
    price: 4500000,
    description: "Sepeda lipat 20 inci dengan desain stylish dan praktis.",
    weight: 12500,
    length: 150,
    width: 30,
    height: 90,
    CategoryId: 7,
    BrandCategoryId: 7,
    image: "noris2.png"
  },
  {
    product_name: "Shimano Groupset XT",
    SKU: 2001,
    stock: 10,
    price: 8500000,
    description: "Groupset premium untuk performa perpindahan gigi yang halus.",
    weight: 2000,
    length: 40,
    width: 30,
    height: 20,
    CategoryId: 8,
    BrandCategoryId: 8,
    image: "shimano.png"
  }
];

async function seed() {
  try {
    for (const p of products) {
      const { image, ...prodData } = p;
      const [newProduct] = await db.Product.upsert(prodData);
      
      const productId = newProduct.id || (await db.Product.findOne({ where: { SKU: p.SKU } })).id;
      
      await db.Image_Url.destroy({ where: { ProductId: productId } });
      await db.Image_Url.create({
        image_url: image,
        ProductId: productId
      });
      console.log(`Successfully seeded ${p.product_name}`);
    }
    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
