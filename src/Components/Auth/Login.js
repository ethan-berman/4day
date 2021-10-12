import React, { useState, useContext} from 'react';
import { useFormFields } from "../../lib/hooksLib";
import Form from "react-bootstrap/Form";
import LoaderButton from "../LoaderButton";
import "./Login.css";
import { useHistory } from "react-router-dom";
import UserContext from "./User";
const Login = (props) => {
    const socket = props.socket;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userNotFound, setUserNotFound] = useState(false);
    const [loginFail, setLoginFail] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        username: "",
        password: ""
    });
    const {user, setUser} = useContext(UserContext);
    let history = useHistory();
    socket.on('login-success', (authenticatedUser) => {
        setUser(authenticatedUser);
        let token = authenticatedUser.token;
        window.localStorage.setItem('token', token);

        console.log('login');
        console.log(authenticatedUser);

        history.push('/');
    })

    socket.on('userNotFound', () => {
       console.log('user not found');
       setUserNotFound(true);
    });

    socket.on('login-fail', () => {
        console.log('incorrect password');
        setLoginFail(true);

    });

    const changeUserName = (event) => {
        setUsername(event.target.value);
        setLoginFail(false);
        setUserNotFound(false);
    }
    const changePassword = (event) => {
        setPassword(event.target.value);
        setLoginFail(false);
        setUserNotFound(false);
    }

    const validateForm = () => {
        return username.length > 0 && password.length > 0 && !userNotFound && !loginFail;
    }

    function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);

        let obj = {
            action: "login",
            data: {
                username: username,
                password: password
            }
        }
        socket.send(obj);
        setIsLoading(false);
        // submit logic
    }
    return (
        <div>
            <div className="Login">
                <Form onSubmit={handleSubmit}>
                    <Form.Group size="lg" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            autoFocus
                            type="text"
                            value={username}
                            onChange={changeUserName}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={changePassword}
                        />
                    </Form.Group>
                    <LoaderButton
                        block
                        size="lg"
                        type="submit"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                    >
                        Login
                    </LoaderButton>
                </Form>
                {loginFail &&
                    (<div className="error card-container">
                        <div className="card">
                            <p>
                                Login fail
                            </p>
                        </div>
                    </div>)
                }
                {userNotFound &&
                (<div className="error card-container">
                    <div className="card">
                        <p>
                            User not found
                        </p>
                    </div>
                </div>)
                }
            </div>
        </div>
    )


}
export default Login;