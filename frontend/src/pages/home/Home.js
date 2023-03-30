import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');
const rooms = new Set();

function Home() {

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [room, setRoom] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");
  const [message, setMessage] = useState("");

  rooms.forEach((joinedRoom) => {
    socket.on(joinedRoom, (response, data) => {
      if(response === "message")
        console.log(`${joinedRoom} : ${data}`);
    })
  })

  useEffect(() => {

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });


    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);


  const handleRoomChange = (e) => {
    setRoom(e.target.value);
  }

  const emitJoinRoomEvent = () => {
    
    if(room.length === 0) return

    rooms.add(room);
    socket.emit("join", room);
        
    setRoom("");
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  }

  const handleEmitMessage = () => {
    if(message.length === 0) return;
    socket.emit('sendMessage', {room: currentRoom, message});
  }

  const handleCurrentRoomChange = (e) => {
    setCurrentRoom(e.target.value)
  }

  return (
    <div>
      <p>
        Connected: <span style={isConnected ? {color: "#0F0"} : {color: "#F00"}}>{ '' + isConnected }</span></p>

      <div>
        <span>Join a room - </span>
        <input type="text" value={room} onChange={handleRoomChange}/>
        <button onClick={() => {emitJoinRoomEvent()}}>Join Room</button>
      </div>

      <br />

      <div>
        <span>Send message - </span>
        <select value={currentRoom} onChange={handleCurrentRoomChange}>
          <option value=''>Select a room</option>
          {
            Array.from(rooms).map((roomOption) => (
              <option key={roomOption} value={roomOption} >{roomOption}</option>
            ))
          }
        </select>
        <input type="text" value={message} onChange={handleMessageChange}/>
        <button onClick={() => {handleEmitMessage()}}>Send Message</button>
      </div>

    </div>
  );
}

export default Home