const express = require("express")
const router = require("./router/mainRouter")
const mongoose = require("mongoose")
const cors = require('cors')
const app = express()
const {createServer} = require('node:http');
const {Server} = require('socket.io');

require("dotenv").config()

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});


const users = []
const cells = []

for (let i = 0; i < 25; i++) {
    cells.push({
        image: "",
        id: ""
    })
}

io.on('connection', (socket) => {
    console.log('a user connected');
    console.log(socket.id)

    socket.on("login", ({username, image}) => {
        users.push({
            username,
            image,
            id: socket.id
        })

        socket.emit("sendMap", cells)
    })

    socket.on("selectCell", index => {
        const {image, id} = users.find(x => x.id === socket.id)

        if(!cells[index].image) {
            cells[index].image = image
            cells[index].id = id
            io.emit("sendMap", cells)
        }
    })


    socket.on("delete", index => {
        // const {image, id} = users.find(x => x.id === socket.id)

        if(cells[index].id === socket.id) {
            cells[index] = {
                image: "",
                id: ""
            }

            io.emit("sendMap", cells)
        } else {
            io.to(cells[index].id).emit('request', index)
        }
    })

});

server.listen(3001, () => {
    console.log('server running at http://localhost:3001');
});


