const axios = require("axios");

async function testKomerce() {
  const RAJAONGKIR_API_KEY = "b846db1d8b8034b8c1d64c373ac4f5c7";
  const RAJAONGKIR_BASE_URL = "https://rajaongkir.komerce.id/api/v1/destination";

  try {
    console.log("Testing Provinces...");
    const resProv = await axios.get(`${RAJAONGKIR_BASE_URL}/province`, {
      headers: { key: RAJAONGKIR_API_KEY },
    });
    console.log("Province Sample:", JSON.stringify(resProv.data.data ? resProv.data.data[0] : resProv.data, null, 2));

    if (resProv.data.data && resProv.data.data.length > 0) {
      const firstProvId = resProv.data.data[0].province_id || resProv.data.data[0].id;
      console.log(`\nTesting Cities for Province ID: ${firstProvId}...`);
      const resCity = await axios.get(`${RAJAONGKIR_BASE_URL}/city/${firstProvId}`, {
        headers: { key: RAJAONGKIR_API_KEY },
      });
      console.log("City Sample:", JSON.stringify(resCity.data.data ? resCity.data.data[0] : resCity.data, null, 2));
    }
  } catch (error) {
    console.error("Error testing Komerce:", error.response ? error.response.status : error.message);
    if (error.response) console.error("Response data:", error.response.data);
  }
}

testKomerce();
