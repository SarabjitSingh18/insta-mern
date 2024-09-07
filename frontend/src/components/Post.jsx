
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import store from '@/redux/store'
import { setPost, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'




function Post({ post }) {

    const [text, setText] = useState('')
    const [open, setOpen] = useState(false)
    const { user } = useSelector(store => store.auth)
    const { posts } = useSelector(store => store.post)
    const dispatch = useDispatch()
    const [postLike, setPostLike] = useState(post.likes.length)
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false)
    const [comment, setComment] = useState(post?.comments)


    const changeEventHandler = (e) => {

        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText)
        }
        else {
            setText("")
        }
    }
    const deleteHandler = async () => {
        try {
            const res = await axios.delete(`https://insta-mern-tsir.onrender.com/api/v1/post/delete/${post._id}`, { withCredentials: true })
            console.log(res)
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id)
                dispatch(setPost(updatedPostData))
                toast.success(res.data.message)
            }


        } catch (error) {
            toast.error(error.response.data.message)

        }
    }
    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : "like";
            const res = await axios.get(`https://insta-mern-tsir.onrender.com/api/v1/post/${post._id}/${action}`, { withCredentials: true })
            console.log(res.data)
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1
                setPostLike(updatedLikes)
                setLiked(!liked)
                //post updation is required or your likes will fade on refresh
                const updatedPostData = posts.map(newPost => newPost._id === post._id ? {
                    ...newPost, likes: liked ? newPost.likes.filter(id => id !== user._id) : [...newPost.likes, user._id]
                }
                    : newPost
                )
                dispatch(setPost(updatedPostData))
                toast.success(res.data.message)
            }

        } catch (error) {
            console.log(error)

        }

    }
    const commentHandler = async () => {
        try {
            const res = await axios.post(`https://insta-mern-tsir.onrender.com/api/v1/post/${post?._id}/comment`, { text }, {
                headers: {
                    "Content-Type": 'application/json'
                },
                withCredentials: true
            })
            console.log(res.data)
            if (res.data.success) {

                const updatedCommentData = [...comment, res.data.comment]
                setComment(updatedCommentData)

                const updatedPostData = posts?.map(newPost =>
                    newPost?._id === post?.id ? { ...newPost, comments: updatedCommentData }
                        : newPost
                )
                dispatch(setPost(updatedPostData))
                toast.success(res.data.message)
                setText("")
            }

        } catch (error) {
            console.log(error)
        }

    }
    const bookmarkHandler=async()=>{
        try {
            const res = await axios.get(`https://insta-mern-tsir.onrender.com/api/v1/post/${post?._id}/bookmark`,{withCredentials:true});
            if(res.data?.success){
                toast.success(res.data.message);
            }



            
        } catch (error) {
            console.log(error)
            
        }

    }
    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={post?.author?.profilePicture} alt="post_image" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  
                    <div className="flex items-center gap-3">
                        <h1>{post.author.username}</h1>
                      {user?._id===post.author._id &&  <Badge variant='secondary'>Author</Badge>}

                    </div>
                </div>
                <Dialog className=''>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className='flex flex-col items-center text-sm text-center'>
{                  user&& user?._id !==post.author?._id     &&  <Button variant='ghost' className='cursor-pointer w-fit text-red-500 font-bold'>Unfollow</Button>}
                        <Button onClick={bookmarkHandler} variant='ghost' className='cursor-pointer w-fit  font-bold'>Add to favourites</Button>
                        {
                            user && user._id === post.author._id && <Button variant='ghost' onClick={deleteHandler} className='cursor-pointer w-fit  font-bold'>Delete</Button>

                        }
                    </DialogContent>
                </Dialog>
            </div>
            <img
                className='rounded-md my-2 w-full aspect-square object-cover'
                src={post?.image}
                alt="post"
            />
            <div className="flex items-center justify-between my-2">
                <div className="flex items-center gap-3">
                    {liked ? <FaHeart className='cursor-pointer text-red-600' onClick={likeOrDislikeHandler} size={'22px'} /> : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} />}
                    <MessageCircle onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true)
                    }} />
                    <Send className='cursor-pointer hover:text-gray-600' />

                </div>
                <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-medium block mb-2'>{postLike} Likes</span>
            <p>
                <span className='font-medium mr-2'>{post.author.username}</span>
                <span className='font-normal '>{post?.caption}</span>

            </p>
            <span onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true)
            }} className='cursor-pointer text-sm text-gray-600'>View all  comments</span>
            <CommentDialog open={open} setOpen={setOpen} />
            <div className="flex items-center justify-between">
                <input
                    type="text"
                    placeholder='add a comment...'
                    value={text}
                    onChange={changeEventHandler}
                    className='outline-none  border-[1px] p-1 rounded text-sm w-full'
                />
                {
                    text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer hover: ml-1 hover:text-blue-600'>Post</span>

                }

            </div>
        </div>



    )
}

export default Post
