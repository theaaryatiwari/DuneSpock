import React, { useEffect, useState, useRef } from 'react';
import Popup from 'reactjs-popup';
import { io } from 'socket.io-client';
import './Mainframe.css';

function Mainframe() {
    const [message, setMessage] = useState('');
    const [array, setArray] = useState([]);
    const [naam, setNaam] = useState('');
    const listRef = useRef(null);
    const socketRef = useRef(null);  

    useEffect(() => {
        socketRef.current = io('http://192.168.4.10:4008');  

        socketRef.current.on('recieve-message', (message, naam) => {
            console.log(message);
            setArray((prev) => [...prev, { text: message, sender: 'recieve', namee: naam}]);
        });

        
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        listRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [array]);  

    const handleType = (event) => {
        setMessage(event.target.value);
    };
    const [IsPopOpen, setIsPopOpen] = useState(false);
    useEffect(()=>{
        setIsPopOpen(true);
    },[])
    const handleSend = (event) => {
        event.preventDefault();
        if (message.trim()) {
            setArray((prev) => [...prev, { text: message, sender: 'sent', namee: naam}]);
            socketRef.current.emit('send-message', message, naam);
            setMessage('');
        }
    };
    const typeNaam = (eve) =>{
        if(eve.target.value.trim()){
            setNaam(eve.target.value)
        }
    }
    const handleNaam = (e) =>{
        e.preventDefault();
        if(naam.length>8){
            setNaam(naam.substring(0,8)+"...")
        }
    }

    return (
        <>
        <div>
            <Popup open={IsPopOpen} onclose={()=>{setIsPopOpen(false)}} modal>
                <form className='nameform' onSubmit={handleNaam}>
                <input
                    className='messagebox'
                    placeholder='Type your name...'
                    value={naam}
                    type='text'
                    onChange={typeNaam}
                />
                <button type='submit' className='buttonsend' onClick={()=>setIsPopOpen(false)}>Enter</button>
                </form>
            </Popup>
        </div>
        <div className='whiteSQR'>
            <form onSubmit={handleSend} className='inputBox'>
                <input
                    className='messagebox'
                    placeholder='Type your message..'
                    value={message}
                    type='text'
                    onChange={handleType}
                />
                <button type='submit' className='buttonsend'>Send</button>
            </form>
            <div className='commspace'>
                {array.map((msg, index) => (
                    <div key={index} className={msg.sender}>
                        <div className= {"name"+ msg.sender} >
                            {msg.namee}
                        </div>
                        {msg.text}
                    </div>
                ))}
                <div ref={listRef}></div>
            </div>
        </div>
        </>
    );
}

export default Mainframe;
