const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io")
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  let users = [];
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('user join', (user) => {
    if(users.length > 0){
      for(let i = 0; i < users.length; i++){
        if(users[i] == user['oldName']){
          users[i] = user['username'];
        }
      }
    }else{
      users.push(user['username']);
    }
    console.log(user['username'] + ' joined')
    io.emit('user join', users);
  });
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  socket.on('typing', (user) => {
    io.emit('typing', user)
  })
});
server.listen(3000, () => {
  console.log('listening on *:3000');
});