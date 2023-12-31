const Post = require('../models/post');
const Like = require('../models/like');
const User = require('../models/user');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const { error } = require('console');

//Create Post
const createPost = async (req, res) => {
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
            // Create a new post using the Post model
            const newPost = new Post({
                content: content,
                fileUrl: uploadedFile.secure_url,
                fileType: uploadedFile.format,
                saved: false,
                user: user,
                comments: [],
                likes: [],
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
                user: user,
                comments: [],
                likes: [],
            });
            await newPost.save();
            return res.status(201).json({ message: "Post upload Succesful", data: newPost, user: user });
        }
    } catch (err) {
        return res.status(500).json({
            message: "Error creating post",
            error: err.message
        });
    }
};
// Delete post
const deltePost = async (req, res) => {
    try {
        const { PostID } = req.body;
        const data = await Post.findByIdAndDelete(PostID);
        res.status(200).json({ message: "Post Delete Successful", data: data });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err });
    }
}

//Update Post Content
const updatePost = async (req, res) => {
    try {
        const { PostID } = req.body;
        console.log(req.body);
        const data = await Post.findByIdAndUpdate(PostID, { ...req.body });
        res.status(200).jsonjson({ message: "Post Upddate Succesful", data: data });
    } catch (err) {
        res.status(500).jsonjson({ message: "Server Error", err });
    }
}


const updateUserAvatar = async (req, res) => {
    try {
        const { id } = req.body;
        let uploadedFileUrl = null;

        if (req.file) {
            const { path } = req.file;
            const uploadedFile = await cloudinary.uploader.upload(path, {
                folder: "samples"
            });
            uploadedFileUrl = uploadedFile.secure_url;

            fs.unlinkSync(path); // Remove the temporary file after upload
        }

        // Prepare data for update, considering whether req.file exists
        const updateData = req.file ? { avatar: uploadedFileUrl } : { ...req.body };

        // Update user data in the database based on the condition
        const data = await User.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(201).json({
            message: "User update successful",
            user: data,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// const updateUserAvatar = async (req, res) => {
//     try {
//         const { id, ...updateData } = req.body;
//         const { path } = req.file;
//         let uploadedFile;
//         // Upload image file
//         uploadedFile = await cloudinary.uploader.upload(path, {
//             folder: "samples"
//         });

//         // const findUser = await User.findByIdAndUpdate(id);
//         const data = await User.findByIdAndUpdate(id,
//             {
//                 updateData,
//                 avatar: uploadedFile.secure_url
//             },
//             { new: true }); // Use updateData separately for updates
//         // findUser.avatar = uploadedFile.secure_url
//         // await findUser.save();// Save the post to the database
//         // Delete the local file after upload
//         fs.unlinkSync(path);

//         return res.status(201).json({
//             message: "User update Succesful",
//             user: data,
//             // data: post
//         });
//     } catch (err) {
//         res.status(500).json({ error: err })
//     }
// }


//Get Post For android new way
const getFeeds = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user')
            .populate('comments')
            .populate('likes');

        return res.status(200).json({ data: posts });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
}



//Get All Post
const getPosts = async (req, res) => {
    try {
        const { id } = req.query;
        let post = [];
        const user = await User.find();
        const localuser = await User.findById(id);//find local User for fillter post according following

        //If user not login than show all Post
        if (!localuser) {
            post = await Post.find();//Find all Post
            return res.status(201).json({ data: post, user: user });
        }
        const like = await Like.find({ user: id });
        //filter post according to following
        for (let i = 0; i < localuser.following.length; i++) {
            const posts = await Post.find({ user: localuser.following[i] })
            post = [...post, ...posts]; // Store posts inside post array
        }

        const posts = await Post.find({ user: id });
        post = [...post, ...posts];

        // Randomly shuffle the post array
        for (let i = post.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [post[i], post[j]] = [post[j], post[i]];
        }

        return res.status(201).json({ data: post, user, like });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Post Not find',
            error: error
        });
    }
}

//Find Post according to ID for Profile Page
const getpostanduserByID = async (req, res) => {
    try {
        const { Id } = req.body;
        const post = await Post.find({ user: Id });
        const user = await User.findById(Id);
        return res.status(201).json({
            message: "Post find",
            data: post,
            user: user,
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Post Not find',
            error: error
        });
    }
}

//Get Videos
const getReels = async (req, res) => {
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

const savepost = async (req, res) => {
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


module.exports = { createPost, getFeeds, updateUserAvatar, getPosts, getReels, getpostanduserByID, savepost, deltePost, updatePost }