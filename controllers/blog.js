const appRoot = require("app-root-path")
const mongoose = require ('mongoose');
const sharp = require('sharp');
const shortid = require("shortid");

const Blog = require("../models/Blog");
const { produceError } = require('../utils/error');
exports.getAllBlogs = async (req , res , next) =>{
    try{
        const blogs = await  Blog.find().select('-__v');
        if(blogs.length === 0){
            throw produceError('there is not any blog ' , 404);
        }
        const blogsWithPictureLink = blogs.map((item) => {
            let itemWithPictureLink = {};
            itemWithPictureLink._id = item._id
            itemWithPictureLink.title = item.title
            itemWithPictureLink.text = item.text
            itemWithPictureLink.author = item.author
            itemWithPictureLink.blogPicture = `${process.env.URL}/uploads/blogs/${item.blogPicture}`
            itemWithPictureLink.likes = item.likes
            return itemWithPictureLink
        })
        return res.status(200).json({blogsWithPictureLink})
    }catch(err){
        next(err)
    }
}
exports.createBlog = async(req , res , next) =>{
    const blogPicture = req.files ? req.files.blogPicture : {}
    const fileName = `${shortid.generate()}_${blogPicture.name}`;
    const uploadPath = `${appRoot}/public/uploads/blogs/${fileName}`
    try {
        await sharp(blogPicture.data)
        .jpeg({quality:60})
        .toFile(uploadPath)
        .catch((err) =>console.log(err))

        const blog = await Blog.create({
            title:req.body.title ,
            text:req.body.text , 
            author:req.userId,
            blogPicture: fileName,
            likes:0
        })
        if(!blog){
            throw produceError('blog can not create')
        }
        return res.status(201).json({blog})
    } catch (error) {
        next(error)
    }
}

exports.getBlogById = async (req , res , next) =>{
    try{
        if(!mongoose.isValidObjectId(req.params.id)){
            produceError('there is not any blog with this invalid id' , 404)
        }
        const blog = await Blog.findOne({_id:req.params.id})
        if(!blog){
            produceError('there is not any blog with this invalid id' , 404)
        }
        return res.status(200).json({blog , picture: `${process.env.URL}/uploads/blogs/${blog.blogPicture}`})
    }catch(error){
        next(error)
    }
}

exports.getDoctorBlogs = async (req , res , next) =>{
    try {
        const blogs = await Blog.find({author : req.userId}).select('-__v');
        if(blogs.length === 0){
            throw produceError('there is not any blog ' , 404);
        }
        const blogsWithPictureLink = blogs.map((item) => {
            let itemWithPictureLink = {};
            itemWithPictureLink._id = item._id
            itemWithPictureLink.title = item.title
            itemWithPictureLink.text = item.text
            itemWithPictureLink.author = item.author
            itemWithPictureLink.blogPicture = `http://116.203.220.194/uploads/blogs/${item.blogPicture}`
            itemWithPictureLink.likes = item.likes
            return itemWithPictureLink
        })
        return res.status(200).json({blogsWithPictureLink})
    } catch (error) {
        next(error)
    }
}
exports.likeBlog = async (req , res , next) =>{
    try{
        if(!mongoose.isValidObjectId(req.params.id)){
            produceError('there is not any blog with this invalid id' , 404)
        }
        const blog = await Blog.findOne({_id:req.params.id}).select()
        if(!blog){
            produceError('there is not any blog with this invalid id' , 404)
        }
        blog.likes = blog.likes+1
        await blog.save()
        return res.status(200).json({blog , picture: `${process.env.URL}/uploads/blogs/${blog.blogPicture}`})
    }catch(error){
        next(error)
    }
}