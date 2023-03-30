
import  express  from "express";
import { Server } from "http";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";


const app = express();
const http = new Server(app);

const io = new SocketIOServer(http, 
  {
    cors: {
      origin: "*",
      credentials: true,
    }
  }
);

io.on('connection', (socket) => {
  console.log('New User Connected\n');

  socket.on("join", async (room) => {
    await socket.join(room);
    io.sockets.in(room).emit(room, "Room Joined", {"message": "hello"});
  });

  socket.on("sendMessage", (data) => {
    const {room, message} = data;
    io.sockets.in(room).emit(room, "message", message);
  } )

  socket.on('disconnect', function () {
    console.log('A user disconnected\n');
 });  
});

const broadcast = (message) => {
  io.sockets.emit('EVENT', message)
}


app.use(cors())

app.get('/', function(req, res) {
  res.sendFile('index.html', { root: '.' });
});


http.listen(3000, function() {
  console.log('listening on  port - 3000');
});