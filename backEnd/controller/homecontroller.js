const Post = require('../models/post');
const Like = require('../models/like');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const { error } = require('console');
const User = require('../models/user');

//Create Post


createPost = async (req, res) => {
    try {
        const { content, user } = req.body;
        // Upload the image or video to Cloudinary
        if (req.file) {
            const { path, mimetype } = req.file;
            let uploadedFile;

            if (mimetype.startsWith("image/")) {
                // Upload image file
                uploadedFile = await cloudinary.uploader.upload(path, {
                    folder: "samples"
                });
            } else if (mimetype.startsWith("video/")) {
                // Upload video file
                uploadedFile = await cloudinary.uploader.upload(path, {
                    folder: "samples",
                    resource_type: "video"
                });
            } else {
                // Invalid file type
                fs.unlinkSync(path); // Delete the local file
                throw new Error("Invalid file type. Only image and video files are allowed.");
            }
            // Create a new post instance using the Post model
            const newPost = new Post({
                content: content,
                fileUrl: uploadedFile.secure_url,
                fileType: uploadedFile.format,
                saved: false,
                user: user
            });
            // Save the post to the database
            await newPost.save();
            // Delete the local file after upload
            fs.unlinkSync(path);
            return res.status(201).json({
                message: "Post upload Succesful",
                data: newPost,
                user: user
            });
        } else {
            // No file was uploaded
            const newPost = new Post({
                content: content,
                user: user
            });

            await newPost.save();

            return res.status(201).json({ data: newPost });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Error creating post",
            error: err.message
        });
    }
};
//Update user Avtar
updateUser = async (req, res) => {
    try {
        const { user } = req.body;

        const { path, mimetype } = req.file;
        let uploadedFile;


        // Upload image file
        uploadedFile = await cloudinary.uploader.upload(path, {
            folder: "samples"
        });

        const findUser = await User.findByIdAndUpdate(user);
        const post = await Post.find({ user })

        findUser.avatar = uploadedFile.secure_url
        // Save the post to the database
        await findUser.save();

        // Delete the local file after upload
        fs.unlinkSync(path);

        return res.status(201).json({
            message: "Post upload Succesful",
            user: findUser,
            data: post
        });

    } catch (err) {
        res.status(500).json({ error: err })
    }
}
//Get All Post
getPosts = async (req, res) => {
    try {
        const likes = await Like.find()
        const user = await User.find()
        const posts = await Post.find()
            .sort('-createdAt')

        return res.status(201).json({ data: posts, user: user, likes: likes });

    } catch (err) {
        return res.status(500).json({
            message: 'Post Not find',
            error: error
        });
    }
}

getpostByID = async (req, res) => {
    try {

        const { Id } = req.body;
        const post = await Post.find({ user: Id });

        return res.status(201).json({
            message: "Post find",
            data: post
        })

    } catch (err) {
        return res.status(500).json({
            message: 'Post Not find',
            error: error
        });
    }
}

//Get Videos

getReels = async (req, res) => {
    try {
        const user = await User.find()
        const posts = await Post.find({ fileType: "mp4" || "mov" || "avi" || "wmv" }).sort('-createdAt')

        return res.status(201).json({ data: posts, user: user });

    } catch (err) {
        return res.status(500).json({
            message: 'Post Not find',
            error: error
        });
    }
}

savepost = async (req, res) => {
    try {
        const { id } = req.body;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                id: id
            });
        }

        post.saved = true;
        await post.save();

        return res.status(201).json({
            message: "Post saved",
            data: post
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error',
            error: err
        });
    }
};


module.exports = { createPost, getPosts, getReels, updateUser, getpostByID, savepost }