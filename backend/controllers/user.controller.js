import { User } from "../model/user.model.js";
import { Post } from "../model/post.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
//controls for the registration of user
export const register = async (req, res) => {
    try {
        //destructuring the given data to register
        const { username, password, email } = req.body;
        //check if all fields are provided or not
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "something is missing ,please check !!",
                success: false
            })
        }
        //check if user already exists or not 
        const user = await User.findOne({ email });
        if (user) {
            //if exists then tell use another account
            return res.status(401).json({
                message: "try differnt email you already have account",
                success: false,
            })
        }
        //if user is not found then register him

        //hashing the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPassword,
        })

        return res.status(201).json({
            message: "Account created sucessfully",
            success: true
        })


    } catch (error) {
        console.log(error)

    }

}
//controls for the login of user
// export const login = async (req, res) => {
//     try {
//         //getting the data from the form
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(401).json({
//                 message: "Something is missing please fill up carefully",
//                 success: false
//             })
//         }
//         let user = await User.findOne({ email })
//         if (!user) {
//             return res.status(401).json({
//                 message: "Invalid Credentials",
//                 success: false
//             })

//         }
//         //matching the given and hashed password using bcrypt.compare()
//         const isPasswordMatch = await bcrypt.compare(password, user.password)
//         //if wrong password
//         if (!isPasswordMatch) {
//             return res.status(401).json({
//                 message: "Invalid password",
//                 success: false
//             })
//         }

//         //if password is also correct then provide the tokens
//         const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' })
//         //populating the posts of user in the posts array
//         const populatedPosts = await Promise.all(
//             user.posts.map(async (postId) => {
//                 const post = await Post.findById(postId);
//                 if (post.author.equals(user._id)) {
//                     return post;

//                 }
//                 return null
//             })
//         )
//         //creating a user object from the found user in db to pass in response
//         user = {
//             _id: user._id,
//             username: user.username,
//             email: user.email,
//             profilePicture: user.profilePicture,
//             bio: user.bio,
//             followers: user.followers,
//             following: user.following,
//             posts: populatedPosts
//         }
//         //
       

//         //returning the response inside the cookies
//         return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
//             user,
//             message: `Welcome back ${user.username}`,
//             success: true,
            
//         })



//     } catch (error) {
//         console.log(error)

//     }
// }
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        };

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        // populate each post if in the posts array
        const populatedPosts = await Promise.all(
            user.posts.map( async (postId) => {
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts
        }
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};
//controls for the logout of user
export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        })

    } catch (error) {
        console.log(error)

    }

}
//controls for the getProfile of user
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks');
        return res.status(200).json({
            user,
            
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};
//controls for the editprofile of user
export const editProfile = async (req, res) => {
    try {
        //getting the userId from the cookies 
        //using isAuthenticated middleware
        const userId = req.id;
        //getting the data from req.body
        const { bio, gender } = req.body;
        //getting the file from req.file
        const profilePicture = req.file;

        let cloudResponse;

        //checking for profilePicture
        if (profilePicture) {
            //converting the given image to a url
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri)
        }
        //finding the user
        const user = await User.findById(userId).select('-password')
        if (!user) {
            return res.status(404).json({
                message: "user not found ",
                success: false
            })

        }
        //updating the values-->
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        console.log(cloudResponse)
        //this new url is provided by cloudinary
        if (profilePicture) user.profilePicture = cloudResponse.secure_url
        //saving the done changes in object
        await user.save();


        //returning final response->
        return res.status(200).json({
            message: "Profile Updated",
            success: true,
            user
        })


    } catch (error) {
        console.log(error)

    }
}
//controls for the getSuggestedUsers of user
export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(404).json({
                message: "you do not have any suggestions now",
                success: false
            })

        }
        return res.status(200).json({

            success: true,
            users: suggestedUsers
        })


    } catch (error) {
        console.log(error)

    }
}
export const followOrUnfollow = async (req, res) => {
    try {
        const followerId = req.id; /// The ID of the user who is following
        const targetUserId = req.params.id; //The ID of the user being followed
        if (followerId === targetUserId) {
            return res.status(404).json({
                message: "You cannot follow / unfollow yourself",
                success: false
            })
        }
        //finding the ID of the user who is following->
        const user = await User.findById(followerId)
        const targetUser = await User.findById(targetUserId)

        if (!user || !targetUser) {
            return res.status(400).json({
                message: "User is not there",
                success: false
            })
        }
        //checking if already followed or we have to
        const isFollowing = user.following.includes(targetUserId);
        if (isFollowing) {
            //unfollow logic here
            await Promise.all([
                User.updateOne({ _id: followerId }, { $pull: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $pull: { followers: followerId } }),
            ])
            //returning the unfollow response 
            return res.status(200).json({
                message: "unfollowed successfully",
                success: true
            })

        } else {
            //follow logic here
            await Promise.all([
                User.updateOne({ _id: followerId }, { $push: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $push: { followers: followerId } }),
            ])
            //returning the unfollow response 
            return res.status(200).json({
                message: "followed successfully",
                success: true
            })


        }




    } catch (error) {
        console.log(error)

    }
}