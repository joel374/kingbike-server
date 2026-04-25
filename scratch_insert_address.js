const db = require("./models");

async function insertAddress() {
  try {
    const address = await db.Address.create({
      UserId: 4,
      address_label: "Rumah Utama",
      city_id: "444", // ID Kota Tangerang (contoh)
      province_id: "3", // ID Provinsi Banten (contoh)
      postal_code: "15111",
      full_address: "Jl. Raya Bumi Indah Selatan No. 88, Kec. Pasar Kemis, Tangerang",
      is_primary: true
    });
    console.log("Address inserted successfully:", JSON.stringify(address, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

insertAddress();
