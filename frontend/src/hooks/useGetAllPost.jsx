import { setPost } from '@/redux/postSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

function useGetAllPost() {
    const dispatch= useDispatch()
    useEffect(()=>{
        const fetchAllPost = async()=>{
            try {
                const res = await axios.get('https://insta-mern-tsir.onrender.com/api/v1/post/all',{withCredentials:true});
                if (res.data.success) {
                    console.log(res.data)
                    dispatch(setPost(res.data.posts))
                    console.log(res?.data)                    
                }
                
            } catch (error) {
                console.log(error)
                
            }
        }
        fetchAllPost()

    },[])
}

export default useGetAllPost
