const db = require("./models");

async function seedWarehouse() {
  try {
    const warehouse = await db.Warehouse.create({
      warehouse_name: "Gudang Utama OusamaBike",
      address: "Jl. Raya Bumi Indah No. 10, Kec. Pasar Kemis, Tangerang",
      city_id: "444", // Tangerang
      province_id: "3", // Banten
      postal_code: "15560",
      phone: "08123456789"
    });
    console.log("Warehouse seeded successfully:", JSON.stringify(warehouse, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedWarehouse();
