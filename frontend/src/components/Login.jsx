import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'

function Login() {
    const [input, setInput] = useState({
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const {user} = useSelector(store=>store.auth)
    const navigate = useNavigate()
    const dispatch  = useDispatch()
    //events handler advance way of handling the form
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }
    //signup handler on submit of form
    const loginHandler = async (e) => {
        e.preventDefault();
        //console.log(input)
        try {
            setLoading(true)
            //make a post request needs a serverurl , data , headers, WithCreadentials:true
            const res = await axios.post('https://insta-mern-tsir.onrender.com/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            if (res.data.success) {
                console.log(res.data)
                dispatch(setAuthUser(res.data.user))
                navigate('/')
                toast.success(res?.data?.message);

                setInput({

                    email: "",
                    password: ""

                })
                

            }


        } catch (error) {
            console.log(error)
            toast.error(error?.res?.data?.message)
        }
        finally {
            setLoading(false)
        }
        


    }
    useEffect(()=>{
        if(user){
            navigate("/")
        }

    },[])

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={loginHandler} className='shadow-lg flex flex-col gap-5 p-8'>
                <div className="my-4">
                    <h1 className='text-center font-bold text-xl'>SaravPost</h1>
                    <p className='text-sm text-center'>You need to signup to see profiles and posts of users</p>

                </div>

                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type='email'
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className='focus-visible:ring-transparent my-2'
                    />

                </div>
                <div className="">
                    <span className='font-medium'>Password</span>
                    <Input
                        type='password'
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className='focus-visible:ring-transparent my-2'
                    />

                </div>
                {
                    loading ? (
                        <Button><Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please Wait </Button>

                    ) : (
                        <Button type='submit' className=''> Login</Button>

                    )
                }

                <span className='text-center'>Donot have an account have an account?<Link className='text-blue-600 ml-1 underline' to='/signup'>signup</Link></span>

            </form>


        </div>
    )
}

export default Login
