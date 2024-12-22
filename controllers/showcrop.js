const Crop = require("../models/crop");
const Cropreading = require("../models/cropreading");

exports.showCropAndReadings = async (req, res) => {
    try {
      const cropId = req.params.id; // Get crop ID from route params

      // Fetch the crop details
      const crop = await Crop.findById(cropId).lean();
      if (!crop) {
        return res.status(404).send('Crop not found');
      }
  
      // Fetch all crop readings related to this crop
      const reading = await Cropreading.find({ crop : cropId }).lean(); // Assuming `cropId` exists in the `Cropreading` model
     
      // Render the EJS page with both crop and reading data
      res.render('showcrop', { crop, reading });
    } catch (error) {
      console.error('Error fetching crop or readings:', error);
  
      if (error.kind === 'ObjectId') {
        return res.status(400).send('Invalid ID format');
      }
  
      res.status(500).send('Failed to fetch crop or readings');
    }
  };

  exports.editreading = async (req,res)=>{
    const { id } = req.params; // Get the crop reading ID from the URL
    try {
        // Fetch the crop reading by ID
        const cropreading = await Cropreading.findById(id);
        if (!cropreading) {
            return res.status(404).send("Crop reading not found.");
        }

        // Render the edit form with the current crop reading data
        res.render("editreading", { record: cropreading });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching crop reading.");
    }
  }

  exports.updatereading = async (req,res)=>{
    const { id } = req.params; // Extract the record ID from the route
    const updateData = req.body; // Extract the updated data from the form

    try {
        const updatedRecord = await Cropreading.findByIdAndUpdate(id, updateData, { new: true }); // Update the record
        if (!updatedRecord) {
            return res.status(404).send('Crop record not found');
        }
        const cropId = updatedRecord.crop; // Get the crop ID
        res.redirect(`/farm/${cropId}`); // Redirect to the crop page
      

    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating crop record');
    }
  }

  exports.deletereading = async (req,res)=>{
    const { id } = req.params; // Extract the record ID from the route
    try {
        const deletedRecord = await Cropreading.findByIdAndDelete(id); // Delete the record
        if (!deletedRecord) {
            return res.status(404).send('Crop record not found');
        }
        const cropId = deletedRecord.crop
        res.redirect(`/farm/${cropId}`); // Redirect to the all records page after deletion
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting crop record');
    }
  }