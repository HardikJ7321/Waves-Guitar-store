const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT = 10;
const jwt = require('jsonwebtoken');
require('dotenv').config();


const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required:true,
        maxlength: 50
    },
    lastName:{
        type:String,
        required:true,
        maxlength: 50
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        required:true,
        minlength:5
    },
    cart:{
        type:Array,
        default:[]
    },
    history:{
        type:Array,
        default:[]
    },
    role:{
        type:Number,
        default:0
    },
    token:{
        type:String
    }
});

userSchema.pre('save', function(next){    ///before "save" is performed by server.js' user.save() function, this function will run
    var user = this;

    if(user.isModified('password')){  /// if later on user changes other fields then it will check if passowrd is changed, then only encrypt the new passwrd otherwise passes on 
        bcrypt.genSalt(SALT, function(err, salt){
            if(err) next(err);   ///kills this function and moves to the next thing 
            bcrypt.hash(user.password, salt, function(err,hash){
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    } 
});

///adding a method to userSchema to compare passwords
userSchema.methods.comparePassword = function(candidatePassword, cb){     ///method to compare password //cb is the callback function
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if(err) return cb(err);
        //else
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function(cb){   //cb is the callback function
    var user = this;
    var token = jwt.sign(user._id.toHexString(), process.env.SECRET);

    user.token = token;
    user.save((err, user)=>{
        if(err) return cb(err);
        //else
        cb(null,user);
    })
}

const User = mongoose.model('User', userSchema);

module.exports = {User};