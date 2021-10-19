import React, {useState, useContext, useEffect} from "react";
import {UserContext} from "../Auth";
import {ConversationItem} from "./index";
import {ConversationContext } from ".";
const MyConversations = ({socket}) => {
    const {user, setUser} = useContext(UserContext);
    const {conversations, setConversations} = useContext(ConversationContext);
    useEffect(() => {
        console.log('mount');
        console.log(user);
        const request = {
            action: 'getConversationsByUser',
            user: user
        }

        // call back
        const returnConversationsByUserListener = (convos) => {
            console.log(convos);
            setConversations(convos);
        }

        socket.on('recipients', returnConversationsByUserListener)
        // socket.send(request);
        return () => {

        }
    }, [user, socket]);

    return (
        <div>
            {
                conversations ? (
            conversations.map((convo) => (
                <ConversationItem conversation={convo}/>
            ))
                ) : (
                    <div> No Conversations </div>
                )
            }
        </div>
    )
}
export default MyConversations;