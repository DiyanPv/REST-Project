let io;
module.exports = {
  init: (httpServer) => {
    require(`socket.io`)(httpServer);
    return io;
  },
  getio: () => {
    if (!io) {
      throw new Error(`Socket.io is not initialized`);
    }
    return io;
  },
};