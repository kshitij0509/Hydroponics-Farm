const Cropreading = require("../models/cropreading");
const Crop = require("../models/crop")
exports.readingform = async (req,res)=>{
  // res.render('readingform',{cropid:req.params.id});
  try {
    const { id: cropid } = req.params; // Extract cropid from URL parameters

    // Query the database to find the crop by cropid
    const crop = await Crop.findById(cropid).lean(); // Using .lean() for better performance when not modifying the data

    if (!crop) {
      return res.status(404).send('Crop not found');
    }

    // Now crop.name contains the name of the crop
    res.render('readingform', {
      cropid: cropid, // Pass the cropid to the form
      cropName: crop.name // Pass the crop name to the form
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching crop data');
  }
}


exports.cropreading = async (req, res) => {
  try {
      const { datetime, name, ph, ec, temperature, batch_no,cropid } = req.body;
      const docToBeSaved={
          datetime,
          name,
          ph: parseFloat(ph),
          ec: parseFloat(ec),
          temperature: parseFloat(temperature),
          batch_no,
          crop: cropid, // Add the reference to the crop here

          // photo_url: req.file ? req.file.path : null, // Cloudinary URL
      }
      const reading = new Cropreading(docToBeSaved);
      await reading.save();
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",reading);
      
      res.redirect(`/farm/${cropid}`);

      // res.status(200).json({ message: 'Reading saved successfully!' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error saving reading' });
  }
};

