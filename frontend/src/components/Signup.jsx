import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'

function Signup() {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [loading,setLoading] = useState(false)
    const {user} = useSelector(store=>store.auth)
    const navigate = useNavigate()
    //events handler advance way of handling the form
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }
    //signup handler on submit of form
    const signupHandler = async (e) => {
        e.preventDefault();
        //console.log(input)
        try {
            setLoading(true)
            //make a post request needs a serverurl , data , headers, WithCreadentials:true
            const res = await axios.post('http://localhost:8000/api/v1/user/register', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            if (res.data.success) {
                navigate("/")
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: ""

                })

            }


        } catch (error) {
            console.log(error)
            toast.error(error.res.data.message)
        }
        finally{
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
            <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
                <div className="my-4">
                    <h1 className='text-center font-bold text-xl'>SaravPost</h1>
                    <p className='text-sm text-center'>You need to signup to see profiles and posts of users</p>

                </div>
                <div className="">
                    <span className='font-medium'>Username</span>
                    <Input
                        type='text'
                        name="username"
                        value={input.username}
                        onChange={changeEventHandler}
                        className='focus-visible:ring-transparent my-2'
                    />

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
                        <Button type='submit' className=''> SignUp</Button>

                    )
                }
                <span className='text-center'>Already have an account?<Link className='text-blue-600 ml-1 underline' to='/login'>Login</Link></span>
            </form>


        </div>
    )
}

export default Signup
