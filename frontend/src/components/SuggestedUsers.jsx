import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';

function SuggestedUsers() {
  const { suggestedUsers } = useSelector(store => store.auth);

  return (
    <div className='my-10'>
      <div className="flex items-center justify-between text-sm mb-4">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className='font-medium cursor-pointer'>See All</span>
      </div>
      {suggestedUsers.map((user) => (
        <div className="flex items-center justify-between my-5" key={user._id}>
          <div className="flex items-center gap-2">
            <Link to={`/profile/${user?._id}`}>
              <Avatar className='h-10 w-10'>
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <h1 className="font-semibold text-sm"><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
              <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
            </div>
          </div>
          <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>Follow</span>
        </div>
      ))}
    </div>
  );
}

export default SuggestedUsers;











// import React from 'react'
// import { useSelector } from 'react-redux'
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
// import { Link } from 'react-router-dom'

// function SuggestedUsers() {
//   const { suggestedUsers } = useSelector(store => store.auth)
//   return (
//     <div className='my-10'>
//       <div className="flex items-center justify-between text-sm">
//         <h1 className="font-semibold text-gray-600 ">Suggested for you</h1>
//         <span className='font-medium cursor-pointer'>See All</span>
//       </div>
//       {
//         suggestedUsers.map((user) => {
//           return (
//             <div className="flex items-center justify-between my-5" key={user._id}>
//               <div className="flex items-center gap-2">
//                 <Link to={`/profile/${user?._id}`}>
//                   <Avatar>
//                     <AvatarImage src={user?.profilePicture} />
//                     <AvatarFallback>CN</AvatarFallback>
//                   </Avatar>
//                 </Link>
//                 <div className="">
//                   <h1 className="font-semibold text-sm"><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
//                   <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
//                 </div>
//               </div>
//               <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>Follow</span>
//             </div>
//           )
//         })
//       }

//     </div>
//   )
// }

// export default SuggestedUsers
