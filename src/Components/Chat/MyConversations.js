import React, {useState, useContext, useEffect} from "react";
import {UserContext} from "../Auth";
import {ConversationItem} from "./index";

const MyConversations = ({socket}) => {
    const {user, setUser} = useContext(UserContext);
    const [conversations, setConversations] = useState([]);
    useEffect(() => {
        console.log('mount');
        console.log(user);
        const request = {
            action: 'getConversationsByUser',
            user: user
        }


        const returnConversationsByUserListener = (convos) => {
            console.log(convos);
            setConversations(convos);
        }

        socket.on('recipients', returnConversationsByUserListener)
        socket.send(request);
        return () => {

        }
    }, [user, socket]);

    return (
        <div>
            {
            conversations.map((convo) => (
                <ConversationItem conversation={convo}/>
            ))
            }
        </div>
    )
};
export default MyConversations;