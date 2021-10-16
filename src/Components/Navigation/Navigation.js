import React, {useContext} from 'react';
import {Link, NavLink, useHistory} from "react-router-dom";
import UserContext from "../Auth/User";

const Navigation = (props) => {
    const socket = props.socket;
    const { user, setUser} = useContext(UserContext);
    let history = useHistory();
    console.log(user);
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">

                <NavLink to="/" className="navbar-brand">
                    Home
                </NavLink>
                <div className=" navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/direct">
                                Direct
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/new">
                                New Room
                            </NavLink>
                        </li>


                    </ul>
                    <div className="my-2 my-lg-0">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <p>{user.username}</p>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to ="/login"> Login</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/signup"> Signup</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/logout"> Log out</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>

            </nav>
        </div>
    )
}
export default Navigation;
