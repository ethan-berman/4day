import React, {Component, useEffect, useContext} from 'react';
import UserContext from "../Auth/User";
import Form from "react-bootstrap/Form";
import "./Chat.css";
const Chat = (props) => {
    const {user} = useContext(UserContext);
    const [text, setText] = React.useState("");
    const [messages, setMessages] = React.useState([]);
    const socket = props.socket;

    useEffect(() => {
        socket.emit('message', {'action': "getMessages"});
    }, [])

    socket.on('messageList', function(msgList) {
        setMessages(msgList);
        console.log(messages);
    })

    const changeMessageBody = (event) => {
        setText(event.target.value);
    };

    const sendMessage = () => {
        socket.emit('message', {"action": "sendMessage", "body" : text, "user": user});
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        sendMessage();
        setText("");
    }
    if (!messages){
        return null;
    }
    return (
        <div>

            <div>
                <ul className="chatList">
                    {
                        messages.map((msg, index) => (
                            <div className="card-container" key={index}>
                                <div className="card">
                                    <li className="row" >
                                        <div className="floatLeft col-4">
                                            {msg.author}
                                        </div>
                                        <div className="col-8">
                                            {msg.body}
                                        </div>
                                    </li>
                                </div>
                            </div>
                        ))
                    }
                </ul>
            </div>
            <Form onSubmit={handleSubmit}>
                <input type="textarea" onChange={changeMessageBody} value={text} />

                <button type="submit"> Send </button>

            </Form>
        </div>


    );
};
export default Chat;