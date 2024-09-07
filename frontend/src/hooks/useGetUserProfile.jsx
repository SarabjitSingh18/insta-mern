import { setUserProfile } from "@/redux/authSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchUserProfile = async () => {

            try {
                const res = await axios(`https://insta-mern-tsir.onrender.com/api/v1/user/${userId}/profile`, { withCredentials: true })
                if (res.data.success) {
                    console.log(res.data)
                    console.log(res.data.user)
                    dispatch(setUserProfile(res.data.user))
                    console.log(res.data.user)

                }

            } catch (error) {
                console.log(error)

            }

        }
        fetchUserProfile()
    }, [userId])


}
export default useGetUserProfile