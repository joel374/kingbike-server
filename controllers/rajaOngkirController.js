const axios = require('axios');

const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY;
const RAJAONGKIR_BASE_URL_DESTINATION = process.env.RAJAONGKIR_BASE_URL_DESTINATION;
const RAJAONGKIR_BASE_URL_COST = process.env.RAJAONGKIR_BASE_URL_COST;

const rajaOngkirController = {
  getProvinces: async (req, res) => {
    try {
      const response = await axios.get(
        `${RAJAONGKIR_BASE_URL_DESTINATION}/province`,
        {
          headers: { key: RAJAONGKIR_API_KEY },
        },
      );
      const data = response.data.data || response.data;
      const mapped = data.map(p => ({
        province_id: p.id.toString(),
        province: p.name,
      }));
      return res.status(200).json(mapped);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server Error' });
    }
  },
  getCities: async (req, res) => {
    try {
      const { provinceId } = req.query;
      const response = await axios.get(
        `${RAJAONGKIR_BASE_URL_DESTINATION}/city/${provinceId}`,
        {
          headers: { key: RAJAONGKIR_API_KEY },
        },
      );
      const data = response.data.data || response.data;
      const mapped = data.map(c => ({
        city_id: c.id.toString(),
        province_id: provinceId,
        city_name: c.name,
        type: '', // Komerce doesn't seem to provide type (Kota/Kabupaten) in this endpoint
      }));
      return res.status(200).json(mapped);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server Error' });
    }
  },
  getCost: async (req, res) => {
    try {
      const { origin, destination, weight, courier } = req.body;

      const params = new URLSearchParams();
      params.append('origin', origin);
      params.append('destination', destination);
      params.append('weight', weight);
      params.append('courier', courier);

      const response = await axios.post(RAJAONGKIR_BASE_URL_COST, params, {
        headers: {
          key: RAJAONGKIR_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      // Komerce structure for cost usually returns an array of services
      return res
        .status(200)
        .json(
          response.data.data ||
            response.data.rajaongkir?.results ||
            response.data,
        );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server Error' });
    }
  },
};

module.exports = rajaOngkirController;
