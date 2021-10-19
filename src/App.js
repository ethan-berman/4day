import logo from './logo.svg';
import './App.css';

import {useState, createContext, useContext, useEffect} from "react";
import { Route, Switch} from "react-router-dom";
import {Chat, Direct, ConversationView, ConversationContext} from "./Components/Chat";
import {Login, Signup, Logout, UserContext} from "./Components/Auth";
import {Navigation, HandleToasts} from "./Components/Navigation";

const io = require('socket.io-client');
// const HOST = window.location.origin.replace(/^http/, 'ws');

const HOST = "ws://localhost:8000/";
// const HOST=process.env.SOCKETHOST;
const token = window.localStorage.getItem('token');
const _ = require('lodash');
// const socket = io(HOST, {
//   reconnectionDelayMax: 1000,
//   auth: {
//     token: token // localStorage.token or something
//   },
//   query: {
//     "my-key": "my-value"
//   }
// });
const options = {
  reconnectionDelayMax: 1000,
  auth: {
    token: token // localStorage.token or something
  },
  query: {
    "my-key": "my-value"
  }
}
// when socket tries to connect it checks for a token in storage
// if there is one then it joins with that token and then
// on connect there will be logic that checks if there is a token and if it's valid,
// if it is valid then it will emit an event to update the user. (without redirect)
function App() {
  const [user, setUser] = useState({});
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState(null);
  useEffect(()=> {
    const newSocket = io(HOST, options);
    setSocket(newSocket);
    newSocket.on('valid-token', function(authenticatedUser){
      // console.log(user);
      // console.log('valid token');
      setUser(authenticatedUser);
      const request = {
        action: 'getConversationsByUser',
        user: authenticatedUser
      }
      newSocket.send(request)
    })
    //callback for getting users
    const returnConversationsByUserListener = (convos) => {
      setConversations(convos);
    }
    const getNewMessageListener = (message) => {
      // add unread message to given conversation
      //   create toast of author and message, click toast to go to conversation
      //
      let conv = _.find(conversations, function (c){
        return c._id === message.cid;
      })
      setConversations((previousState)=>{

      })
      // conv.unread = message;
      if(message.author !== user._id){
        // toast(message.body);
      }
    }
    newSocket.on('recipients', returnConversationsByUserListener);
    newSocket.off('broadcastNewPrivateMessage').on('broadcastNewPrivateMessage', getNewMessageListener);

    return () => newSocket.close();
  }, [setSocket]);



  return (
      <div className="App">
        <UserContext.Provider value={{user, setUser}}>
          <ConversationContext.Provider value={{conversations, setConversations}}>
            <div className="container">
              {/*<ToastContainer />*/}
              <main>
                { socket ? (
                    <div>
                      <HandleToasts socket={socket} />
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
                          <Direct socket={socket} ></Direct>
                        </Route>
                        <Route path="/conversations/:id" children={<ConversationView socket={socket}/>}>

                        </Route>
                        <Route path="/login">
                          <Login socket={socket}></Login>
                        </Route>
                        <Route path="/signup">
                          <Signup socket={socket}></Signup>
                        </Route>
                        <Route path="/logout">
                          <Logout socket={socket}></Logout>
                        </Route>
                      </Switch>
                    </div>

                ) :(
                    <div> Not Connected </div>
                )}
              </main>
            </div>
          </ConversationContext.Provider>
        </UserContext.Provider>
      </div>
  );
}

export default App;
