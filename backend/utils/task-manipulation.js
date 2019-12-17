module.exports = {
    getTargetTask(tasks, targetTaskId) {
        return tasks.find(
            task => task._id.toString() === targetTaskId
        );
    },

    handleSuccessfulFlow({
        res,
        socket,
        socketMessage,
        resonseMessage,
        updatedTask,
        updatedTaskId
    }) {
        const updatedTaskData = {
            updatedTask,
            updatedTaskId
        };

        socket.emit(socketMessage, updatedTaskData);

        return res.status(201).json({
            message: resonseMessage,
            result: updatedTaskData
        });
    },

    handleFailedFlow(res, responseMessage, error) {
        return res.status(500).json({
            message: responseMessage,
            error
        })
    }
    
}