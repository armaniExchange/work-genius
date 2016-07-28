// Notification webSocket
import SocketIo from 'socket.io-client';
import {SERVER_HOST} from '../constants/config';


const socket = SocketIo.connect( SERVER_HOST + ':3000');
socket.on('connect', function(){
	console.log('connected to notificate center');
});

const notificate = (title, body) => {
    const _notify = () => {
      let no = new Notification(title,{body: body});
      setTimeout(() => {no.close(); }, 3000);
      return no;
    };

    if (window.Notification){
        if (Notification.Permission==='granted') {
            _notify();
        } else {
            Notification.requestPermission(_notify);
        };
    } else {
      console.log('Notification disabled');
    }
};

const notifications = [
	{
		event: 'lock device',
		title: 'KB Locked device'
	},
	{
		event: 'release device',
		title: 'KB Unlocked device'
	},
	{
		event: 'apply pto',
		title: 'KB Apply PTO'
	},
	{
		event: 'cancel pto',
		title: 'KB Cancel PTO'
	},
	{
		event: 'approve pto',
		title: 'KB Approved PTO'
	},
	{
		event: 'publish article',
		title: 'KB Publish Article'
	}
];

export const registerNotificatons = () => {
	notifications.map((n) => {
		socket.on(n.event, (data) => {notificate(n.title, data.message);});
	});
};

export const notify = (event, data) => {
	console.log(event, data);
	socket.emit(event, data);
};





