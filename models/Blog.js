const mongoose = require("mongoose");

const schema = require('./secure/blogValidation')
const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
        required:true
    },
    blogPicture:{
        type:String,
        required:true
    },
    likes:{
        type:Number,
        default:0
    }
})
// blogSchema.statics.blogValidation = function (body){
//     return schema.validate(body , {abortEarly: false})
// }

module.exports = mongoose.model('Blog' , blogSchema)