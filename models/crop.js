const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cropSchema = new Schema({
  date:{
    type:Date,
    default:Date.now,
  },
  ph:{
    type:Number,
    // required:true,
    min:0,
    max:14,
  },
  ec:{
    type:Number,
    // required:true,
  },
  temperature:{
    type:Number,
    // required:true,
  },
  name:{
    type:String,
    // required:true,
  }
});

module.exports = mongoose.model('Crop',cropSchema);