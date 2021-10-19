import React, {useEffect, useContext, useState} from 'react';
import UserContext from "../Auth/User";
import Select from 'react-select';
import {useHistory} from "react-router-dom";
import "./Direct.css";
import {Button} from "react-bootstrap";
import {MyConversations} from "./index";

const Direct = ({socket}) => {
    const {user, setUser} = useContext(UserContext);
    const [recipients, setRecipients] = useState([]);
    const [options, setOptions] = useState([]);
    const [key, setKey] = useState(0);
    const history = useHistory();
    useEffect(()=>{
        //get User's convos
        console.log('hi');
        console.log(user);
        socket.send({'action':'getDirectMessages', 'user': user});
        setKey((prevState => prevState + 1));
        return () => {

        }
    }, [user]);
    socket.on('returnAllUsers', (userList) => {
        // console.log(userList);
        // options = [];
        var list = [];
        for(const user of userList){
            // console.log(user);
            list.push({value: user._id, label: user.username});
        }
        setOptions(list);
    });
    socket.on("conversationCreateSuccess", (response) => {
        // console.log(response);
        const redirect = "/conversations/" + response._id;
        history.push(redirect);
    });
    socket.on('test-event', (res) => {
        console.log(res);
    })

    const handleChange = (e) => {
        setRecipients(Array.isArray(e) ? e.map(x => x.value) : []);
    }
    const createConversation = (e) => {
        socket.send({'action': 'createConversation', 'user': user, 'recipients': recipients})
    }

    return (
        <div>
            <p> select convo </p>
            <div>
                <MyConversations socket={socket} key={key}/>
            </div>
            <Select value={options.filter(obj => recipients.includes(obj.value))}
                    isMulti={true}
                    onChange={handleChange}
                    options={options}/>
            <Button onClick={createConversation} >Create Conversation</Button>

        </div>
    )
};
export default Direct;