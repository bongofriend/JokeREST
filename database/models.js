const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const moment = require("moment");
const rounds = 10;

const userSchema = mongoose.Schema({
    Username: {type: String, unique: true},
    Password: String,
    Coins: {type: Number, default: 0}
});

const jokeSchema = mongoose.Schema({
    Content: String,
    Date: {type: String, default: moment.utc().format("YYYY-MM-DD")},
    Username: String,
    Category: Number,
    Upvotes: {type: Number, default: 0},
    Downvotes: {type: Number, default: 0}
});

const voteSchema = mongoose.Schema({
    Username: String,
    JokeID: Number,
    VoteType: String
});

const categorySchema = mongoose.Schema({
    Category: String
});

userSchema.pre("save",function(next){
    let user = this;
    if(!user.isModified("Password")) return next();
    bcrypt.genSalt(rounds,function(err,salt){
        if(err) return next(err);
        bcrypt.hash(user.Password,salt,null,function(err,hash){
            if(err) return next(err);
            user.Password = hash;
            next();
        })
    })
})

userSchema.methods.comparePassword = function(hash){
    return new Promise((resolve,reject) => {
        bcrypt.compare(this.Password,hash,null,(err,isMatch) => {
            if(err) return reject(err);
            return resolve(isMatch);
        })
    })
}

module.exports = {
    userSchema: userSchema,
    jokeSchema: jokeSchema,
    voteSchema: voteSchema,
    categorySchema: categorySchema
}