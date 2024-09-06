//for the chat functionality

import { Conversation } from "../model/conversation.model.js"
import { Message } from "../model/message.model.js"
import { getReceiverSocketId, io } from "../socket/socket.js"

//there is going to be two controls send and get message 

export const sendMessage = async (req, res) => {
    try {
        //getting the sender's id from the req(check if authenticated in message.routes)
        const senderId = req.id
        //getting the reciever's id from the params->
        const receiverId = req.params.id
        // You're not just extracting the value of textMessage from the req.body
        const { textMessage: message } = req.body
        console.log(message)
        //finding if the two users were talked previously
        let conversation = await Conversation.findOne({
            //checking return the conversation document if the participants array contains all the elements specified in the array
            participants: { $all: [senderId, receiverId] }
        })
        //establish the conversation if not started
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }
        //creating the message for the conversation
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        })
        //if the newMessage is here then push it in the messages array  of the conversation model
        if (newMessage) {
            //push the id
            conversation.messages.push(newMessage._id)
        }

        //save all the changes to see updated database
        await Promise.all([conversation.save(), newMessage.save()])

        //here will be the socket.io functionality for real tie message transfers->
        //for sending the message to the particular user we have to get the socketId of the userId(for real time interaction)
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }



        return res.status(201).json({
            success: true,
            newMessage
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: 'Server Error in sending message'
        });
    }
}
export const getMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants:{$all: [senderId, receiverId]}
        }).populate('messages');
        if(!conversation) return res.status(200).json({success:true, messages:[]});

        return res.status(200).json({success:true, messages:conversation?.messages});
        
    } catch (error) {
        console.log(error);
    }
}