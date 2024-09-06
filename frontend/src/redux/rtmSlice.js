import { createSlice } from "@reduxjs/toolkit"

const rtmSlice = createSlice({
    name:"realTimeNotification",
    initialState:{
        likeNotification:[]
    },
    reducers:{
        setLikeNotification:(state,action)=>{
            if (action.payload.type==='like') {
                state.likeNotification.push(action.payload)
                
            }else if(action.payload.type==='dislike'){
                state.likeNotification=state.likeNotification.filter((item)=>item.userId!==action.payload.userId)
            }

        }
    }
})
export const {setLikeNotification} = rtmSlice.actions;
export default rtmSlice.reducer;