import React, {useContext, useEffect} from 'react';
import {useHistory} from "react-router-dom";
import UserContext from "../Auth/User";

const Logout = (props) => {
    const socket = props.socket;
    const { user, setUser } = useContext(UserContext);
    const history = useHistory();
    useEffect(()=>{
        socket.send('logOut');
        setUser({});
        window.localStorage.setItem('token', '');
        history.push('/');
    }, []);
    return (
        <div>
            
        </div>
    );
};
export default Logout;