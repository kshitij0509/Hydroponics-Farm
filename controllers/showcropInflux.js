const Crop = require("../models/crop");
const influxClient = require("../influxdb");

exports.showCropAndReadingsInflux = async (req, res) => {
    try {
      const cropId = req.params.id;

      // Fetch the crop details from MongoDB (crop metadata)
      const crop = await Crop.findById(cropId).lean();
      if (!crop) {
        return res.status(404).send('Crop not found');
      }
  
      // Fetch sensor readings from InfluxDB
      const reading = await influxClient.getLatestReadings(cropId, 50);
     
      // Render the EJS page with both crop and reading data
      res.render('showcrop', { crop, reading });
    } catch (error) {
      console.error('Error fetching crop or readings from InfluxDB:', error);
  
      if (error.kind === 'ObjectId') {
        return res.status(400).send('Invalid ID format');
      }
  
      res.status(500).send('Failed to fetch crop or readings');
    }
};