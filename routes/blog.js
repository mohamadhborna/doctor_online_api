const {Router} = require('express');
const blogController = require("../controllers/blog")
const { authenticated } = require('../middlewares/auth');
const router = new Router();

//! CRUDS

router.post('/' , authenticated ,  blogController.createBlog)

router.get('/'  ,   blogController.getAllBlogs)

router.get('/:id' , blogController.getBlogById)
router.put('/:id/like' , blogController.likeBlog)

module.exports = router