//Working on this function Component 

import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const socket = socketIOClient('http://localhost:9000'); // Connect to the server

        socket.on('connect', () => {
            console.log('Connected to the Socket.IO server.');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from the Socket.IO server.');
        });

        // Listen for the 'receive_notification' event from the server
        socket.on('receive_notification', (data) => {
            // Update the notifications state when a new notification is received
            setNotifications([...notifications, data]);
            // Show the popup notification
            notify(data.message);
        });

        return () => {
            socket.disconnect(); // Clean up the socket connection when the component is unmounted
        };
    }, [notifications]);

    const notify = (message) => {
        toast(message);
    };

    return (
        <div>
            <h3>Notifications</h3>
            <ul>
                {notifications.map((notification) => (
                    <li key={notification.id}>{notification.message}</li>
                ))}
            </ul>
            <ToastContainer />
        </div>
    );
};

export default Notifications;
