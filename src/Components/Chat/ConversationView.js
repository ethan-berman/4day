import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from "../Auth";
import { useParams } from 'react-router-dom';
import {Button, Form} from "react-bootstrap";
import {NewMessage, MessageItem, MyConversations} from ".";
import { Link } from "react-router-dom";

const ConversationView = ({socket}) => {
    // const socket = props.socket;
    const {user, setUser} = useContext(UserContext);
    const [messages, setMessages] = useState({});
    const [nameLookup, setNameLookup] = useState({});
    const [text, setText] = useState("");
    const { id } = useParams();
    useEffect(() => {
        //get messages;
        const request = {
            action: 'getMessagesByConversation',
            user: user,
            conversation: {
                _id: id
            }
        }
        const getMessagesListener = (messages) => {
            console.log(messages);
            setMessages(messages.messages);
            setNameLookup(messages.usernameLookup);
            console.log(messages.usernameLookup);
        }

        const getNewPrivateMessageListener = (privateMessage) => {
            if(privateMessage.cid == id){
                setMessages((prevMessages) => {
                    const newMessages = {...prevMessages}
                    newMessages[privateMessage._id] = privateMessage;
                    return newMessages;
                })
            }
        }
        socket.on('test-event', (obj) => {
            console.log(obj);
        })
        socket.on('returnMessagesByConversation', getMessagesListener);
        socket.on('broadcastNewPrivateMessage', getNewPrivateMessageListener);
        // socket.on('broadcastNewPrivateMessage', (privateMessage)=> {
        //     console.log(privateMessage);
        //     let temp = messages;
        //     temp.push(privateMessage)
        //     setMessages(temp);
        // });

        socket.send(request);
    },[socket, user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let request = {
            action: 'newPrivateMessage',
            user: user,
            message: {
                cid : id,
                body: text,
            }
        }
        socket.send(request);

    };
    const handleChange = (e) => {
        setText(e.target.value);
    };
    return(
        <div>

            <Link to='/direct'>
                Back
            </Link>
            <div>
                {/*{messages.map((message)=> (*/}
                {/*    <div>*/}
                {/*        {message.body};*/}
                {/*    </div>*/}
                {/*))*/}
                {/*}*/}
                <div className="message-list">
                    {[...Object.values(messages)]
                        .sort((a, b) => a.created - b.created)
                        .map((message) => (
                            <div>

                                <MessageItem message={message} key={message.id} name={nameLookup[message.author]}/>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div>
                <NewMessage socket={socket} action="newPrivateMessage" cid={id}/>
                {/*<Form onSubmit={handleSubmit}>*/}
                {/*    <Form.Group controlId="text">*/}
                {/*        <Form.Label>Message:</Form.Label>*/}
                {/*        <Form.Control*/}
                {/*            autoFocus*/}
                {/*            type="text"*/}
                {/*            value={text}*/}
                {/*            onChange={handleChange}*/}
                {/*        />*/}
                {/*        <Button type="submit">Send</Button>*/}
                {/*    </Form.Group>*/}

                {/*</Form>*/}

            </div>

        </div>
    )
};
export default ConversationView;