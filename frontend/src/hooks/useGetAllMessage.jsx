
import { setMessages } from '@/redux/chatSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function useGetAllMessage() {
    const dispatch = useDispatch()
    const { selectedUser } = useSelector(store => store.auth)

    useEffect(() => {

        const fetchAllMessage = async () => {
            try {
                const res = await axios.get(`https://insta-mern-tsir.onrender.com/api/v1/message/all/${selectedUser?._id}`, { withCredentials: true });
                console.log("API response:", res.data.messages); 
                if (res.data.success) {

                   console.log( res.data.messages)
                    dispatch(setMessages(res.data.messages))

                }

            } catch (error) {
                console.log(error)

            }
        }
        fetchAllMessage()

    }, [selectedUser])
}

export default useGetAllMessage
