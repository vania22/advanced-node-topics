const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const redis = require('../services/redis');

const Blog = mongoose.model('Blog');

module.exports = (app) => {
    app.get('/api/blogs/:id', requireLogin, async (req, res) => {
        const blog = await Blog.findOne({
            _user: req.user.id,
            _id: req.params.id,
        });
        res.send(blog);
    });

    app.get('/api/blogs', requireLogin, async (req, res) => {
        const cachedBlogs = await redis.get(req.user.id);

        if (cachedBlogs) {
            console.log('Serving from cache');
            return res.send(JSON.parse(cachedBlogs));
        }

        const blogs = await Blog.find({ _user: req.user.id });

        redis.set(req.user.id, JSON.stringify(blogs));

        console.log('Serving from DB, setting value to cache');

        res.send(blogs);
    });

    app.post('/api/blogs', requireLogin, async (req, res) => {
        const { title, content } = req.body;

        const blog = new Blog({
            title,
            content,
            _user: req.user.id,
        });

        try {
            await blog.save();
            res.send(blog);
        } catch (err) {
            res.send(400, err);
        }
    });
};
