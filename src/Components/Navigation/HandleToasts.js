import React, {useContext, useEffect} from "react";
import { UserContext } from "../Auth";
import { ConversationContext } from "../Chat"
import {useHistory, useLocation} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const HandleToasts = ({socket}) => {
    const {user, setUser} = useContext(UserContext);
    const {conversations, setConversations } = useContext(ConversationContext);
    const history = useHistory();
    const location = useLocation();
    useEffect(()=> {
        const newPrivateMessageToast = (message) => {
            let options = {
                onClick: props => {history.push('/conversations/'+message.cid)}
            }
            const path = '/conversations/'+message.cid
            if(location.pathname !== path){
                toast(message.body, options);
            }
        }
        socket.off('newPrivateMessageToast').on('newPrivateMessageToast', newPrivateMessageToast);
    }, [user, conversations, location]);

    return (
        <div>
            <ToastContainer>
            </ToastContainer>
        </div>
    )
}
export default HandleToasts;