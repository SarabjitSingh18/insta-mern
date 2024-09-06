import { createSlice } from "@reduxjs/toolkit";

const postSlice  = createSlice({
    name:"post",
    initialState:{
        posts:[],
        selectedPost:null

    },
    reducers:{
        //actions here
        setPost:(state,action)=>{
            state.posts = action.payload

        },
        setSelectedPost:(state,action)=>{
            state.selectedPost = action.payload
        }
    }
})

export const {setPost,setSelectedPost} = postSlice.actions
export default postSlice.reducer