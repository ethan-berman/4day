import React, { useState, useContext} from 'react';
import {UserContext} from "../Auth";
const NewMessage = ({socket, action, cid}) => {
    const [value, setValue] = useState('');
    const { user } = useContext(UserContext);
    const submitForm = (e) => {
        e.preventDefault();
        //refactor to take action from props
        socket.emit('message',{action: action,user: user, message: value, cid: cid});
        setValue('');
    };

    return (
        <form onSubmit={submitForm}>
            <input
                autoFocus
                value={value}
                placeholder="Type your message"
                onChange={(e) => {
                    setValue(e.currentTarget.value);
                }}
            />
        </form>
    );
};

export default NewMessage;