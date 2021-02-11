//import express 和 ws 套件
const express = require('express')
const SocketServer = require('ws').Server

var net = require('net')
var HOST = '127.0.0.1'; //parameterize the IP of the Listen

//指定開啟的 port
const PORT = 3000
const PORT2 = 6969
//創建 express 的物件，並綁定及監聽 3000 port ，且設定開啟後在 console 中提示
const server = express()
    .listen(PORT, () => console.log(`Listening on ${PORT}`))
//將 express 交給 SocketServer 開啟 WebSocket 的服務
const wss = new SocketServer({ server })


//當 WebSocket 從外部連結時執行
//Sends data to the frontend webpage
wss.on('connection', ws => {

    //連結時執行此 console 提示
    console.log('Client connected')

    //固定送最新時間給 Client
    const sendNowTime = setInterval(()=>{ws.send(String(new Date()))},1000)

    //對 message 設定監聽，接收從 Client 發送的訊息
    ws.on('message', data => {
        console.log('Sending '+data)
        //data 為 Client 發送的訊息，現在將訊息原封不動發送出去
        ws.send(data)
    })

    //當 WebSocket 的連線關閉時執行
    ws.on('close', () => {
        console.log('Close connected')
    })
})

//Handles the incoming message from the bluetooth
net.createServer(function(sock){
    //Receives a connection - a socket object is assosciated to the connection automatically
    console.log('Connected: '+sock.remoteAddress+':'+sock.remotePort);

    //Add a 'data' - "event handler" in this socket instance
    sock.on('data',function(data){
       //data was received in the socket
       //writes the received message back to the socket (echo)
       console.log('Received '+data);
       sock.write(data);
    });

    //Add a 'close' - "event handler" in this socket instance
    sock.on('close',function(data){
       //close connection
       console.log('CLOSED '+sock.remoteAddress+' '+sock.remotePort);
    });
}).listen(PORT2,HOST);

console.log('Server listening on '+HOST+":"+PORT2);