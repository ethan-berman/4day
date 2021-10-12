import logo from './logo.svg';
import './App.css';
import {useState, createContext, useContext} from "react";
import { Route, Switch} from "react-router-dom";
import Chat from "./Components/Chat/Chat";
import Signup from "./Components/Auth/Signup";
import Login from "./Components/Auth/Login";
import Navigation from "./Components/Navigation/Navigation";
import UserContext from './Components/Auth/User';

const io = require('socket.io-client');
// const HOST = window.location.origin.replace(/^http/, 'ws');

const HOST = "ws://localhost:8000/";
const token = window.localStorage.getItem('token');
const socket = io(HOST, {
  reconnectionDelayMax: 1000,
  auth: {
    token: token // localStorage.token or something
  },
  query: {
    "my-key": "my-value"
  }
});
// when socket tries to connect it checks for a token in storage
// if there is one then it joins with that token and then
// on connect there will be logic that checks if there is a token and if it's valid,
// if it is valid then it will emit an event to update the user. (without redirect)
function App() {
  const [user, setUser] = useState({});
  // const {user, setUser} = useContext(UserContext);
  // function updateUser(authenticatedUser){
  //   setUser(authenticatedUser);
  // }
  socket.on('valid-token', function(authenticatedUser){
    console.log(user);
    console.log('valid token');
    setUser(authenticatedUser);
  })

  return (
    <div className="App">
      <UserContext.Provider value={{user, setUser}}>
      <div className="container">
      <main>
        <Navigation socket={socket}/>
        <Switch>

          <Route exact path="/">
            <Chat socket={socket}/>
          </Route>
          <Route path="/new">
            <div> <p>unfinished</p></div>
          </Route>
          <Route path="/direct">
            <div> <p>unfinished</p></div>
          </Route>
          <Route path="/login">
            <Login socket={socket}></Login>
          </Route>
          <Route path="/signup">
            <Signup socket={socket}></Signup>
          </Route>
        </Switch>
      </main>
      </div>
      </UserContext.Provider>
    </div>
  );
}

export default App;
