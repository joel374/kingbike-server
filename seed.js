const db = require('./models');
const bcrypt = require('bcrypt');

async function seedData() {
  try {
    console.log("Seeding started...");

    // 1. Create Admin User
    const hashedAdminPassword = bcrypt.hashSync("admin123", 5);
    const adminUser = await db.User.create({
      username: "Admin KingBike",
      email: "admin@kingbike.com",
      password: hashedAdminPassword,
      is_verify: true,
      is_admin: true,
      otp: "seed",
    });

    // 2. Create Categories
    const catMountain = await db.Category.create({ category_name: "Mountain Bike" });
    const catRoad = await db.Category.create({ category_name: "Road Bike" });
    const catCity = await db.Category.create({ category_name: "City Bike" });
    const catAccessories = await db.Category.create({ category_name: "Aksesoris" });

    // 3. Create Brands
    const brandPolygon = await db.Brand_Category.create({ brand_name: "Polygon" });
    const brandUnited = await db.Brand_Category.create({ brand_name: "United" });
    const brandPacific = await db.Brand_Category.create({ brand_name: "Pacific" });
    const brandShimano = await db.Brand_Category.create({ brand_name: "Shimano" });

    // 4. Create Products
    const product1 = await db.Product.create({
      product_name: "Polygon Siskiu D7",
      stock: 10,
      price: 15500000,
      description: "Sepeda gunung dual suspension cocok untuk medan ekstrem. Bahan frame ALX XC tangguh.",
      SKU: 1001,
      is_active: true,
      CategoryId: catMountain.id,
      BrandCategoryId: brandPolygon.id,
    });

    const product2 = await db.Product.create({
      product_name: "United Helios A8",
      stock: 5,
      price: 21000000,
      description: "Road bike karbon yang sangat ringan untuk kecepatan maksimal di jalan raya. Groupset Shimano 105.",
      SKU: 1002,
      is_active: true,
      CategoryId: catRoad.id,
      BrandCategoryId: brandUnited.id,
    });

    const product3 = await db.Product.create({
      product_name: "Pacific Noris 2.0",
      stock: 15,
      price: 32000000,
      description: "Sepeda lipat yang praktis dan stylish untuk keliling kota. Frame alloy ringan.",
      SKU: 1003,
      is_active: true,
      CategoryId: catCity.id,
      BrandCategoryId: brandPacific.id,
    });

    // 5. Insert dummy image URLs (Assuming no real image, just placeholders)
    // We can use a generic placeholder URL, but since the frontend maps with process.env.REACT_APP_API_IMAGE_URL
    // We will just put generic image filenames and let it render broken if file not present, or use external if frontend allows.
    // The frontend code expects relative URLs if the IMAGE_URL base is used. We'll use some default strings.
    await db.Image_Url.bulkCreate([
      { image_url: "dummy1.jpg", ProductId: product1.id },
      { image_url: "dummy2.jpg", ProductId: product2.id },
      { image_url: "dummy3.jpg", ProductId: product3.id },
    ]);

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    process.exit(0);
  }
}

seedData();
