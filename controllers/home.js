const Crop = require("../models/crop");


exports.homepage =  async (req, res) => {
  try {
      const crops = await Crop.find({}, 'name'); // Fetch only the `name` field
      res.render('home', { crops }); // Pass the crops array to the EJS view
  } catch (err) {
      res.status(500).json({ error: 'Failed to fetch crops' });
  }
  
};


exports.newcrop = (req,res)=>{
  res.render('newcrop');
}


exports.cropadded = async (req,res)=>{
  try {
    const { name, ec, temperature, ph } = req.body.crop;
    const newCrop = new Crop({ name, ec, temperature, ph });
    await newCrop.save();
    res.redirect('/farm');
    // res.status(201).json({ message: 'Crop added successfully', crop: newCrop });
  }
  catch (err) {
    res.status(500).json({ error: 'Failed to add crop', message: err.message });
  }
};
