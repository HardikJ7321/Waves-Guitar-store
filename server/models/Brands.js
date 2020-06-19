const mongoose = require('mongoose');

const brandSchema = mongoose.Schema({
    name:{
        required:true,
        type:String,
        unique:1,
        maxlength:50
    }
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = {Brand};