//bussiness logic about the posts
import sharp from "sharp"
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../model/post.model.js";
import { User } from "../model/user.model.js";
import { Comment } from "../model/comment.model.js"
import { getReceiverSocketId,io } from "../socket/socket.js";


//comments to addNewPost controls of post
export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) return res.status(400).json({ message: 'Image required' });

        // image upload 
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        // buffer to data uri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: 'New post added',
            post,
            success: true,
        })

    } catch (error) {
        console.log(error);
    }
}
//comments to getAllPost controls of post
export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            })
        return res.status(200).json({
            posts,
            success: true
        })

    } catch (error) {
        console.log(error)

    }
}
//comments to getUserPost controls of post
export const getUserPost = async (req, res) => {
    try {
        //getting the id from the  auth middleware
        const authorId = req.id;
        //getting the post with a condition { author: authorId } passsing a object
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
            .populate({
                path: 'author',
                select: 'username , profilePicture'

            }).populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username, profilePicture'
                }
            })
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error)

    }
}
//comments to LikePOST controls of post
export const likePost = async (req, res) => {
    try {
        //userWhoLiked id needed to fill up the array 
        const userWhoLiked = req.id;
        //postId from the params
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({
            message: 'Post not found', success: false
        })

        //logic if post is here
        await post.updateOne({ $addToSet: { likes: userWhoLiked } })
        //likes updated
        await post.save();
        //here we will use the socket.io for the real-time response notifications->
        const user = await User.findById(userWhoLiked).select(' username profilePicture')
        const PostOwnerId = post.author.toString();
        if (PostOwnerId !== userWhoLiked) {
            //emit notification
            const notification = {
                type: 'like',
                userId: userWhoLiked,
                userDetails: user,
                postId,
                message: "Your post was Liked "
            }
            const PostOwnerSocketId = getReceiverSocketId(PostOwnerId)
            io.to(PostOwnerSocketId).emit('notification', notification)

        }
        return res.status(200).json({
            message: "Post liked ",
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}
//comments to DislikePOST controls of post
export const dislikePost = async (req, res) => {
    try {
        const userWhoDisliked = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        //if post is not there
        if (!post) return res.status(404).json({
            message: "Post donot exists",
            success: false
        })

        //logic for dislike
        await post.updateOne({ $pull: { likes: userWhoDisliked } })
        //save post
        await post.save();

        //here will be the code of socket.io
        //here we will use the socket.io for the real-time response notifications->
        const user = await User.findById(userWhoDisliked).select('username profilePicture')
        const PostOwnerId = post.author.toString();
        if (PostOwnerId !== userWhoDisliked) {
            //emit notification
            const notification = {
                type: 'dislike',
                userId: userWhoDisliked,
                userDetails: user,
                postId,
                message: "Your post was Disliked "
            }
            const PostOwnerSocketId = getReceiverSocketId(PostOwnerId)
            io.to(PostOwnerSocketId).emit('notification', notification)

        }

        return res.status(200).json({
            message: "Post disliked",
            success: true
        })

    } catch (error) {
        console.log(error)

    }
}
//comments to addComment controls of post
export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userWhoCommented = req.id;

        const { text } = req.body;

        const post = await Post.findById(postId);
        //text check->
        if (!text) return res.status(400).json({
            message: "text is missing",
            success: false
        })

        const comment = await Comment.create({
            text,
            author: userWhoCommented,
            post: postId
        })
        //populating the commentor's information in it
        await comment.populate({
            path: 'author',
            select: 'username profilePicture'
        });

        post.comments.push(comment._id)
        await post.save();


        return res.status(201).json({
            message: 'Comment added ',
            comment,
            success: true
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'An error occurred while adding the comment',
            success: false
        });

    }
}
//comments to getCommentsOfPost controls of post
export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({ post: postId }).populate('author', 'username profilePicture');

        if (!comments) return res.status(404).json({
            message: "No comments for this Post",
            success: false
        })

        return res.status(200).json({
            success: true,
            comments
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'An error occurred while fetching comments',
            success: false
        });

    }

}
//comments to deletePost controls of post
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        // check if the logged-in user is the owner of the post
        if (post.author.toString() !== authorId) return res.status(403).json({ message: 'Unauthorized' });

        // delete post
        await Post.findByIdAndDelete(postId);

        // remove the post id from the user's post
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        // delete associated comments
        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            success: true,
            message: 'Post deleted'
        })

    } catch (error) {
        console.log(error);
    }
}
//comments to bookmarkPost controls of post
export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId)
        //check for post
        if (!post) {
            return res.status(404).json({
                message: 'Cannot find the post',
                success: false
            });
        }


        const user = await User.findById(authorId);
        //checking if the bookmarks array includes the post._id
        // if not then add
        // if had then remove simple
        if (user.bookmarks.includes(post._id)) {
            //if exists then pulling the id from the  bookmarks array 
            await user.updateOne({ $pull: { bookmarks: post._id } })
            await user.save();
            return res.status(200).json({
                type: 'unsaved',
                message: "Post is removed from bookmarks",
                success: true

            })
        }
        else {
            //if already not bookmarked the make it->
            await user.updateOne({ $addToSet: { bookmarks: post._id } })
            await user.save()
            return res.status(200).json({
                type: 'saved',
                message: "Post is added to bookmarks",
                success: true

            })


        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'An error occurred while bookmarking the post',
            success: false
        });

    }
}