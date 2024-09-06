import React from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

function RightSidebar() {
  const { user } = useSelector(store => store.auth);

  return (
    <div className='w-full lg:w-[25%] lg:pl-10 my-10 hidden  lg:block'>
      <div className="flex items-center gap-2 mb-4">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className='h-12 w-12'>
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
          <span className='text-gray-600 text-sm'>{user?.bio || "bio here..."}</span>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  );
}

export default RightSidebar;













// import React from 'react'
// import { Avatar, AvatarImage } from './ui/avatar'
// import { AvatarFallback } from '@radix-ui/react-avatar'
// import { useSelector } from 'react-redux'
// import { Link } from 'react-router-dom'
// import SuggestedUsers from './SuggestedUsers'

// function RightSidebar() {
//   const { user } = useSelector(store => store.auth)
//   return (
//     <div className='w-fit my-10 pr-32'>
//       <div className="flex items-center gap-2">
//         <Link to={`/profile/${user?._id}`}>
//           <Avatar>
//             <AvatarImage src={user?.profilePicture} />
//             <AvatarFallback>CN</AvatarFallback>
//           </Avatar>
//         </Link>
//       </div>
//       <div >
//         <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username} </Link></h1>
//         <span className='text-gray-600 text-sm'>{user?.bio || "bio here..."}</span>
//       </div>
//       <SuggestedUsers/>

//     </div>
//   )
// }

// export default RightSidebar
