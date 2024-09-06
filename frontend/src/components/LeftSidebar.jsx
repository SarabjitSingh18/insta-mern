// import { setAuthUser } from '@/redux/authSlice'
// import store from '@/redux/store'
// import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
// import axios from 'axios'
// import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
// import React, { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import { toast } from 'sonner'
// import CreatePost from './CreatePost'
// import { Menu } from 'lucide-react';

// function LeftSidebar() {
//     const navigate = useNavigate()
//     const {user} = useSelector(store=>store.auth)
//     const dispatch = useDispatch()
//     const [open,setOpen] = useState(false)

//     const sideBarItems = [
//         { icon: <Home />, text: "Home" },
//         { icon: <Search />, text: "Search" },
//         { icon: <TrendingUp />, text: "TrendingUp" },
//         { icon: <MessageCircle />, text: "Messages" },
//         { icon: <Heart />, text: "Notifications" },
//         { icon: <PlusSquare />, text: "Create" },
//         {
//             icon: (
//                 <Avatar>
//                     <AvatarImage className='rounded' width={30} src={user?.profilePicture} alt="@shadcn" />
//                     <AvatarFallback>{user?.username}</AvatarFallback>
//                 </Avatar>

//             ),
//             text: "Profile"
//         },
//         { icon: <LogOut />, text: "Logout" },
//     ]

//     const logoutHandler = async () => {
//         try {
//             const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true })
//             console.log(res)
//             if (res.data.success) {
//                 navigate('/login')
//                 toast.success(res.data.message)
//                 dispatch(setAuthUser(null))
//                 dispatch(setSelectedPost(null));
//                 dispatch(setPosts([]));



//             }

//         } catch (error) {
//             toast.error(error.response.data.message)

//         }

//     }
//     const sidebarHandler = (textType) => {
//         if (textType === "Logout") {
//             logoutHandler()
//         }
//         else if(textType==="Create"){
//            setOpen(true)
//         }
//         else if(textType==="Profile"){
//             navigate(`/profile/${user?._id}`)
//         }
//         else if(textType ==="Home"){
//             navigate(`/`)
//         }

//     }

//     return (
//         <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 lg:w-[16%] h-screen'>
//             <div className='flex flex-col'>
//                 <h1 className="my-4 pl-3 font-bold text-xl  ">Sarv</h1>
//                 <div>
//                     {
//                         sideBarItems.map((item,index)=>{
//                             return(
//                                 <div onClick={()=>sidebarHandler(item.text)} key={index} className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 ">
//                                     {item.icon}
//                                     <span className='hidden lg:inline-block'>{item.text}</span>

//                                 </div>
//                             )
//                         })
//                     }

//                 </div>


//             </div>
//             <CreatePost open={open} setOpen={setOpen}/>
//         </div>


//     )
// }

// export default LeftSidebar






import { Menu } from 'lucide-react';
import { setAuthUser } from '@/redux/authSlice';
import store from '@/redux/store';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import axios from 'axios';
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CreatePost from './CreatePost';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';

function LeftSidebar() {
    const navigate = useNavigate();
    const { user } = useSelector((store) => store.auth);
    const { likeNotification } = useSelector(store => store.realTimeNotification)
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Track sidebar visibility

    const sideBarItems = [
        {num:1, icon: <Home />, text: "Home" },

        {num:2, icon: <MessageCircle />, text: "Messages" },
        {num:3, icon: <Heart />, text: "Notifications" },
        {num:4, icon: <PlusSquare />, text: "Create" },
        {num:5,
            icon: (
                <Avatar>
                    <AvatarImage className='rounded' width={30} src={user?.profilePicture} alt="@shadcn" />
                    <AvatarFallback>{user?.username}</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        {num:6, icon: <LogOut />, text: "Logout" },
    ];

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                navigate('/login');
                toast.success(res.data.message);
                dispatch(setAuthUser(null));
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const sidebarHandler = (textType) => {
        if (textType === "Logout") {
            logoutHandler();
        } else if (textType === "Create") {
            setOpen(true);
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`);
        } else if (textType === "Home") {
            navigate(`/`);
        }
        else if (textType == "Messages") {
            navigate(`/chat`)

        }
    };

    return (
        <>
            <div className='fixed flex flex-col top-0 z-20 left-0 p-4 lg:hidden '>
                <Menu onClick={() => setIsSidebarVisible(!isSidebarVisible)} className="cursor-pointer" />


            </div>

            {isSidebarVisible && (
                <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 bg-gray-50 lg:w-[16%] h-screen transition-all duration- ease-in  '>
                    <div className='flex flex-col'>
                        <h1 className="my-4 pl-3 font-bold text-xl ml-5">Sarv</h1>


                        <div>
                            {sideBarItems.map((item) => (
                                <div
                                    onClick={() => sidebarHandler(item.text)}
                                    key={item.num}
                                    className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
                                >
                                    {item.icon}
                                    <span className=''>{item.text}</span>
                                    {
                                        item.text === "Notifications" && likeNotification.length > 0 && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification.length}</Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div>
                                                        {
                                                            likeNotification.length === 0 ? (<p>No new notification</p>) : (
                                                                likeNotification.map((notification) => {
                                                                    return (
                                                                        <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                            <Avatar>
                                                                                <AvatarImage className='w-9 rounded-md ' src={notification.userDetails?.profilePicture} />
                                                                                <AvatarFallback>CN</AvatarFallback>
                                                                            </Avatar>
                                                                            <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                        </div>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                </PopoverContent>
                                            </Popover>

                                        )
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                    <CreatePost open={open} setOpen={setOpen} />
                </div>
            )}
        </>
    );
}

export default LeftSidebar;
