// require {dbName, chatCollection, userCollection, profileCollection, directMessageCollection, } from "./consts";

const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require("socket.io");
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const server = http.createServer(app);
const ObjectId = require('mongodb').ObjectId
const dotenv = require('dotenv');
const _ = require('lodash');
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
dotenv.config();
//Config variables
const port = process.env.PORT || 8000;
const secret = process.env.JWTSECRET;
const saltRounds = process.env.SALTROUNDS;
const mongoUrl = process.env.MONGODB;

//mongodb consts
const dbName = "chat";
const chatCollection = "messages";
const userCollection = "users";
const profileCollection = "profile";
const directMessageCollection = "directMessage";
const conversationCollection = "conversation"
const privateMessageCollection = "privateMessage";

//events
const eventUserNotFound = "userNotFound";
const eventLoginFailed = "login-fail";
const eventLoginSuccess = "login-success";
const conversationCreateSuccess = "conversationCreateSuccess";
const newPrivateMessage = "newPrivateMessage";


var messages = [];
// I'm maintaining all active connections in this object
const clients = {};
// This code generates unique userid for everyuser.
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

async function handleLogin(db, connection, data){
    console.log('handleLogin Called');
    //hash the incoming password
    //query database for username, compare hashes
    //return true or false
    const user = data.data;
    const query = {username : user.username};
    var profile = await getDocument(db, profileCollection, query);
    // console.log(profile);
    if(profile.length) {
        profile = profile[0];
        if (!profile.token) {
            //generate token
            const newToken = jwt.sign({user_id: profile._id}, secret);
            profile.token = newToken;
            const query = {_id: new ObjectId(profile._id)}
            const update = {$set: {token: newToken}};
            updateOneDocument(db, profileCollection, query, update).then(function (res) {
                // console.log(res);
            })
        }
        var hash = await getDocument(db, userCollection, {_id: profile.hashid});
        hash = hash[0];
        bcrypt.compare(user.password, hash.hash, function (err, res) {
            if (res) {
                console.log("it matches");
                const authenticatedUser = {
                    _id: profile._id,
                    username: profile.username,
                    token: profile.token
                }
                console.log(authenticatedUser);
                console.log('authenticated user');
                clients[profile._id] = connection;
                //connect socket to all rooms
                let obj = {
                    user: authenticatedUser
                }
                connectSocketToRooms(db, connection, obj);
                connection.emit("login-success", authenticatedUser);
            } else {
                connection.emit('login-fail');
                console.log('invalid password');
            }
        })
    } else {
        console.log('user not found');
        connection.emit('userNotFound');
    }
}
async function handleSignup(db, connection, data){
    console.log("handleSignup Called");
    console.log(data);
    const user = data.data;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(user.password, salt, async function(err, hash) {
            // Store hash in database here
            // console.log(hash);
            let hashKey = new ObjectId();
            let profileKey = new ObjectId();
            const obj = {
                _id: hashKey,
                hash: hash
            }
            var authenticatedUser = {};
            getDocument(db, 'profile',{username:user.username}).then(function(res){
                if(!res.length){
                    const token = jwt.sign({user_id: profileKey}, secret);
                    const profile = {
                        _id: profileKey,
                        hashid: hashKey,
                        username: user.username,
                        signupTime: new Date(),
                        token: token
                    }

                    insertNewMessage(db, 'users', obj)
                    insertNewMessage(db, 'profile', profile).then(function(res){
                            // console.log(res);
                            authenticatedUser._id = res.insertedId;
                            authenticatedUser.username = user.username;
                            authenticatedUser.token = token;
                            //just the socket
                            connection.emit('signup-success', authenticatedUser);
                    });

                }
            })
        });
    });
}
async function getDirectMessages(db, connection, data){
    console.log("getDirectMessages Called")
    //This is now deprecated probably
    const conversation_query = {recipients: new ObjectId(data.user._id)};
    const allUsers = await getDocument(db, profileCollection, {});
    connection.emit('returnAllUsers', allUsers);
    let conversations = await getDocument(db, 'conversation', conversation_query);
    // get all Conversations with

    const conversation = {
        _id: "",
        recipients: [],
        body: "",
        sendDate: ""
    }
}
async function handleCreateConversation(db, connection, data){
    console.log('handleCreateConversation Called');
    let conversationId = new ObjectId();
    // console.log(conversationId);
    const recipients = [...data.recipients,data.user._id];
    var ids = [];
    for(const item of recipients){
        // console.log(item);
        console.log('item flag');
        const itemId = new ObjectId(item)
        ids.push(itemId);
        if(clients[item]){
            // console.log(conversationId.toString());
            // console.log(clients[item]);
            // clients[item].emit("test-event", "heyyyyy");
            let sid = clients[item]
            const socketClient = sid;
            let obj = {
                t: 'heasdfjdsf'
            }
            // console.log(socketClient.id);
            const s = {id: socketClient.id};
            // io.in(s.id).emit('test-event', obj);
            // socketClient.emit('test-event', obj);
            socketClient.join(conversationId.toString(), function(){
                console.log("client: " + clients[item] + "Joined rooms: " + clients[item].rooms);
            })
        }

    }
    let conversation = {
        _id: conversationId,
        recipients: ids,
        created: new Date(),
    }
    insertNewMessage(db, conversationCollection, conversation).then(function(res){
        console.log(res);
        connection.join(conversationId.toString());
        connection.emit(conversationCreateSuccess, conversation);
    });
}
async function getMessagesByConversation(db, connection, data){
    console.log("getMessagesByConversation Called");
    // console.log(data);
    let id = new ObjectId(data.conversation._id);
    const query = {cid: id};
    const conversationQuery = {_id: id};
    // console.log(query);
    // console.log(new ObjectId(data.conversation._id))
    const messages = await getDocument(db, privateMessageCollection, query);
    const conversation = (await getDocument(db, conversationCollection, conversationQuery))[0];
    // console.log(conversation);
    const conversationUsers = await getDocument(db, profileCollection, {_id: {$in: conversation.recipients}});
    const usernameLookup = {};
    for(const user of conversationUsers){
        usernameLookup[user._id] = user.username;
    }
    connection.join(id.toString(), function(){
        console.log("now in rooms: " + connection.rooms);
    });
    const returnData = {
        messages: messages,
        usernameLookup: usernameLookup
    }
    // console.log(returnData);
    connection.emit('returnMessagesByConversation', returnData);
}
async function handleNewPrivateMessage(db, connection, data){
    console.log('handleNewPrivateMessage Called');
    // console.log(data);
    let privateMessage = {
        _id: new ObjectId(),
        author: new ObjectId(data.user._id),
        cid: new ObjectId(data.cid),
        body: data.message,
        created: new Date()
    }
    await insertNewMessage(db, privateMessageCollection, privateMessage);
    privateMessage.author_name = data.user.username;
    const room = privateMessage.cid.toString();
    io.to(room).emit('broadcastNewPrivateMessage',privateMessage);
    connection.to(room).emit('newPrivateMessageToast', privateMessage);
    // io.to('test').emit('broadcastNewPrivateMessage', privateMessage);
}
async function getConversationsByUser(db, connection, data){
    console.log('getConversationsByUser Called');
    let query = {recipients: new ObjectId(data.user._id)}
    let conversations = await getDocument(db, conversationCollection, query);
    var people = [];
    // console.log('conversations flag');
    // console.log(conversations);
    for(const item of conversations){
        // console.log(item);
        people.push(...item.recipients);
    }
    // console.log(people);
    const userQuery = {'_id': {$in: people}};
    let usersInContact = await getDocument(db, profileCollection, userQuery);
    // console.log(usersInContact);
    const nameLookup = {};
    for(const user of usersInContact){
        nameLookup[new ObjectId(user._id)] = user.username;
    }
    var newConvo = [];
    for(var item of conversations){
        const names = {};
        for(const person of item.recipients){
            names[person] = nameLookup[person]
        }
        item.names = names;
        newConvo.push(item);
    }
    // console.log(newConvo);
    connection.emit('recipients', newConvo);
    // console.log(nameLookup);
}
/*
* Takes a database and socket as usual
* For data it needs a user wrapped in an object*/
async function connectSocketToRooms(db, connection, data){
    // let conversations = getConversationsByUser(db, connection, data);
    let query = {recipients: new ObjectId(data.user._id)}
    let conversations = await getDocument(db, conversationCollection, query);
    for (const conversation of conversations){
        let id = conversation._id.toString();
        connection.join(id, function(){
            console.log('joined rooms: ' + connection.rooms)
        })

    }
}
async function determineTask(db, connection, data) {
    try {
        console.log(data);
        switch(data.action){
            case "sendMessage":
                let d = {
                    'body': data.body,
                    'author': data.user.username
                };
                messages.push(d);
                // await insertNewMessage(db, 'messages',d)
                io.emit('messageList', messages);
                //emit this to all connections because its general
                break;
            case "getMessages":
                //emit just to socket making the request
                connection.emit('messageList', messages);
                let list = await getDocument(db, 'messages', {});
                // io.emit('messageList', list);
                break;
            case "login":
                await handleLogin(db, connection, data);
                break;
            case "signup":
                await handleSignup(db, connection, data);
                break;
            case "getDirectMessages":
                await getDirectMessages(db, connection, data);
                break;
            case 'createConversation':
                console.log(data);
                await handleCreateConversation(db, connection, data);
                break;
            case 'newPrivateMessage':
                console.log('help')
                console.log(data);
                await handleNewPrivateMessage(db, connection, data);
                break;
            case 'getMessagesByConversation':
                await getMessagesByConversation(db, connection, data);
                break;
            case 'getConversationsByUser':
                await getConversationsByUser(db, connection, data);
                break;


        }
    } catch (error) {
        console.log(error);
    }
}

async function constructWebSocketServer(db) {
    app.use(express.static(path.join(__dirname, 'build')));
    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
    // db.collection('profile').createIndex({ username: 1 }, { unique: true })


    io.on('connection', (socket) => {
        const token = socket.handshake.auth.token;
        if(token) {
            jwt.verify(token, secret, async function (err, decoded) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(decoded);
                    if (decoded) {
                        const user_id = new ObjectId(decoded.user_id)
                        clients[decoded.user_id] = socket;
                        let query = {_id: user_id};
                        getDocument(db, 'profile', query).then(function (res) {
                            console.log(res);
                            res = res[0];
                            let obj = {
                                user: res
                            }
                            connectSocketToRooms(db, socket, obj);
                            delete res.hashid;
                            socket.emit('valid-token', res);
                        });
                    }
                }
            })
        }
        // console.log(socket.handshake.headers);
        socket.on('message', (data) => {
            determineTask(db, socket, data)
        });
        socket.on("disconnect", () => {
            delete clients[socket.id];
        });
    });

    server.listen(port, function () {
        console.log((new Date()) + 'Server is listening on port: ' + port);
    });
}

async function insertNewMessage(databaseName, collectionName, documentInformation){
    var promise = new Promise(function(resolve, reject){
        databaseName.collection(collectionName).insertOne(documentInformation, function(err, result){
            if(err){
                throw err;
            }else {
                if(collectionName.toString().trim() == 'messages'){
                    console.log('Message inserted');
                }else if(collectionName.toString().trim() == 'profile'){
                    console.log('profile inserted');
                } else if(collectionName.toString().trim() == 'users'){
                    console.log('user inserted');
                }
            }
            resolve(result);
        });
    });
    return promise;
};
async function getDocument(databaseName, collectionName, query){
    var promise = new Promise(function(resolve, reject){
        databaseName.collection(collectionName).find(query).toArray(function(err,result){
            if(err){
                throw err;
                //reject();
            }else{
                console.log(result);
                resolve(result);
            }
        });
    });
    return promise;
};
async function updateOneDocument(databaseName, collectionName, filter, update){
    var promise = new Promise(function(resolve, reject){
        console.log(filter, "QUERY");
        console.log(update, "UPDATE");
        databaseName.collection(collectionName).findOneAndUpdate(filter, update ,function(err,result){
            if(err){
                throw err;
                //reject();
            }else{
                console.log(result);
                resolve(result);
            }
        });
    });
    return promise;
}

async function connectToMongoDB() {
    const url = mongoUrl;
    const client = new MongoClient(url);
    client.connect(function(err, db){
        if(err){
            console.log("Unable to connect to the MongoDB server. Error: ",err);
        }else{
            console.log("Succesfully Connected to the MongoDB server.");
            constructWebSocketServer(db.db("chat"));

            return new Promise(function(resolve, reject){
                resolve(db.db('chat'));
            })
        }
    })
};
async function main() {
    const database = connectToMongoDB()
};
main().catch(console.error);