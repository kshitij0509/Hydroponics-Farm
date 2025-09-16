const Crop = require("../models/crop");

exports.homepage = async (req, res) => {
  try {
    const crops = await Crop.find({});
    const activeCropsCount = crops.filter(crop => crop.active !== false).length;
    const inactiveCropsCount = crops.filter(crop => crop.active === false).length;
    const totalCropsCount = crops.length;
    
    // Get weather data (you can replace with actual API call)
    const weatherData = {
      temperature: await getCurrentTemperature(),
      location: "Current Location"
    };
    
    res.render("home", { crops, activeCropsCount, inactiveCropsCount, totalCropsCount, weather: weatherData });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch crops" });
  }
};

// Simple weather function (replace with actual weather API)
async function getCurrentTemperature() {
  try {
    // This is a placeholder - you can integrate with OpenWeatherMap or similar
    const temp = Math.floor(Math.random() * 15) + 20; // Random temp between 20-35°C
    return temp;
  } catch (error) {
    return 24; // Default fallback
  }
}

exports.newcrop = (req, res) => {
  res.render("newcrop");
};

exports.cropadded = async (req, res) => {
  try {
    const { name, ec, temperature, ph, active } = req.body.crop;
    const newCrop = new Crop({ name, ec, temperature, ph, active: active === 'true' });
    await newCrop.save();
    res.redirect("/farm");
    // res.status(201).json({ message: 'Crop added successfully', crop: newCrop });
  } catch (err) {
    res.status(500).json({ error: "Failed to add crop", message: err.message });
  }
};
