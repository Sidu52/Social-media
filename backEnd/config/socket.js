module.exports.chatSockets = function (socketServer) {

    const io = require('socket.io')(socketServer, {
        cors: {
            origin: 'http://localhost:9000',
            methods: ['GET', 'POST'],
        },
    });

    module.exports = function (io) {
        io.on('connection', (socket) => {
            console.log('New connection received:', socket.id);

            socket.on('disconnect', () => {
                console.log('Socket disconnected:', socket.id);
            });

            socket.on('action_notification', async (data) => {
                // Save the notification to the database
                const newNotification = new Notification({
                    user: data.user,
                    post: data.post,
                    notificationType: data.notificationType,
                    status: false,
                });

                await newNotification.save();

                // Emit the new notification to all relevant users
                io.emit('receive_notification', newNotification);
            });
        });
    };

}