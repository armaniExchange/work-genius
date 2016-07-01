// notifications
const notifications = [
  {
    event: 'lock device', 
    message: (data) => (data.user + ' Locked box ' + data.ip)
  },
  {
    event: 'release device', 
    message: (data) => (data.ip + ' Released ')
  },
  {
    event: 'apply pto',
    message: (data) => (data.user + ' Apply ' + data.days + ' PTO')
  },
  {
    event: 'cancel pto',
    message: (data) => (data.user + ' Cancel PTO on date' + data.date )
  },
  {
    event: 'approve pto',
    message: (data) => (data.manager + ' Approved ' + data.user + ' PTO on date' + data.date )
  },
  {
    event: 'publish article',
    message: (data) => (data.user + ' Published Article ' + data.title)
  }
];
export default (socket) => {
  console.log('Hi Notification');
  notifications.map((n) => {
    socket.on(n.event, function (data) {
      socket.emit(n.event, {
        message: n.message(data)
      });
    });
  });
};
