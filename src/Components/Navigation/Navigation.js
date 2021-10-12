import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import UserContext from "../Auth/User";

const Navigation = (props) => {
    const socket = props.socket;
    const { user, setUser} = useContext(UserContext);
    console.log(user)
    const logOut = () => {
        socket.send('logOut')
        setUser({});
        window.localStorage.setItem('token', '');
    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">

                <Link to="/" className="navbar-brand">
                    Home
                </Link>
                <div className=" navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/direct">
                                Direct
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/new">
                                New Room
                            </Link>
                        </li>


                    </ul>
                    <div className="my-2 my-lg-0">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <p>{user.username}</p>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to ="/login"> Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/signup"> Signup</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/" onClick={logOut}> Log out</Link>
                            </li>
                        </ul>
                    </div>
                </div>

            </nav>
        </div>
    )
}
export default Navigation;
