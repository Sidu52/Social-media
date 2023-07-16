const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require('../models/comments');
const toggleLike = async function (req, res) {
    console.log(req.query)
    try {
        let likeable;
        let deleted = false;

        if (req.query.type == 'Post') {
            likeable = await Post.findById(req.query.id).populate('likes');
        } else {
            likeable = await Comment.findById(req.query.id).populate('likes');
        }
        // check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.query.userid
        })

        // if a like already exists then delete it
        if (existingLike) {
            likeable.likes.pull(existingLike._id);
            likeable.save();

            Like.findByIdAndDelete(existingLike._id)
                .then(() => {
                    // console.log("Existing like removed successfully");
                    deleted = true;
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            // else make a new like
            let newLike = await Like.create({
                // req.user._id
                user: req.query.userid,
                likeable: req.query.id,
                onModel: req.query.type
            });
            likeable.likes.push(newLike._id);
            likeable.save();
        }

        const like = await Like.find({
            likeable: req.query.id
        })



        return res.json(200, {
            message: "Request successfulsss!",
            data: "deleted",
            likes: like

        })

    } catch (err) {
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}

const toggleComment = async (req, res) => {
    try {
        const { id, userid, data } = req.query;

        const post = await Post.findById(id);
        let comment = await Comment.create({
            content: data,
            post: id,
            user: userid
        });
        post.comments.push(comment);
        post.save();

        // const commentsData = await Comment.find({ post: id });

        comment = await comment.populate('user', 'username email');

        return res.status(201).json({ message: "Comment Created", data: comment })
    } catch (err) {
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}

//Get All Comments
const getcomments = async (req, res) => {
    try {
        const { id } = req.query;
        const commentsData = await Comment.find({ post: id }).sort('-createdAt')
        return res.status(201).json({ message: "Comment Created", data: commentsData })
    } catch (err) {
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });

    }
}

module.exports = { toggleLike, toggleComment, getcomments };
