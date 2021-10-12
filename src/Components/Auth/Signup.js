import React, { useState, useContext } from 'react';
import Form from "react-bootstrap/Form";
import LoaderButton from "../LoaderButton";
import { useFormFields } from "../../lib/hooksLib";
import { useHistory } from "react-router-dom";
import "./Signup.css";
import UserContext from "./User";
const Signup = (props) => {
    const socket = props.socket;
    const [fields, handleFieldChange] = useFormFields({
        username: "",
        password: "",
        confirmPassword: ""
    });
    const {user, setUser} = useContext(UserContext);
    let history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    function handleSubmit(event){
        event.preventDefault();
        setIsLoading(true);
        console.log(fields);
        let obj = {
            action: "signup",
            data: fields
        }
        socket.send(obj);
        setIsLoading(false);

    };
    socket.on('signup-success', function(authenticatedUser){
        console.log(authenticatedUser);
        let token = authenticatedUser.token;
        window.localStorage.setItem('token', token);
        // console.log(socket);
        console.log('signup success');
        setUser(authenticatedUser);
        history.push('/');
    })
    function validateForm() {
        return (
            fields.username.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }

    const [newUser, setNewUser] = useState(null);
    



    return (
        <div className="Signup">
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username" size="lg">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    autoFocus
                    type="text"
                    value={fields.username}
                    onChange={handleFieldChange}
                />
            </Form.Group>
            <Form.Group controlId="password" size="lg">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    value={fields.password}
                    onChange={handleFieldChange}
                />
            </Form.Group>
            <Form.Group controlId="confirmPassword" size="lg">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    onChange={handleFieldChange}
                    value={fields.confirmPassword}
                />
            </Form.Group>
            <LoaderButton
                block
                size="lg"
                type="submit"
                variant="success"
                isLoading={isLoading}
                disabled={!validateForm()}
            >
                Signup
            </LoaderButton>
        </Form>
        </div>
    );
}
export default Signup;