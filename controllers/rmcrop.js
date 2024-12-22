const Crop = require("../models/crop");
const Cropreading = require('../models/cropreading');
exports.updatecrop = async (req, res) => {
  try {
      const crop = await Crop.findByIdAndUpdate(req.params.id,req.body,{ new: true, runValidators: true });
      if (!crop) {
          return res.status(404).send('Crop not found');
      }
      res.redirect(`/farm/${crop._id}`);

  } catch (err) {
      console.error(err);
      res.status(500).send('Error loading crop details');
  }
};

exports.deletecrop = async (req,res)=>{
  try {
    // Find the crop by ID
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).send('Crop not found');
    }

    // Delete all crop readings associated with the crop
    await Cropreading.deleteMany({ crop: crop._id });

    // Delete the crop itself
    await crop.deleteOne();

    // Redirect back to the home page
    res.redirect('/farm');
  } catch (error) {
    console.error('Error deleting crop:', error);
    res.status(500).send('Error deleting crop and its readings');
  }

}

exports.editcrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).send('Crop not found');
    }
    res.render('editcrop', { crop }); // Renders the `editcrop.ejs` form
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading crop details');
  }
};