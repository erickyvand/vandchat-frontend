import React from 'react';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import LoginEmail from './components/auth/LoginEmail';
import LoginPassword from './components/auth/LoginPassword';
import Signup from './components/auth/Signup';
import Chat from './components/chat/Chat';
import NotFound from './components/Layouts/NotFound';
import ListUsers from './components/users/ListUsers';
import { onlineUserService, userService } from './services/user.service';

// import useSound from 'use-sound';
function App() {
	const [socket, setSocket] = React.useState(null);
	const [connectedUsers, setConnectedUsers] = React.useState([]);
	const [loading, setLoading] = React.useState(false);
	const [messages, setMessages] = React.useState([]);
	const [users, setUsers] = React.useState([]);
	const [typing, setTyping] = React.useState();
	const [notification, setNotification] = React.useState({});
	const [count, setCount] = React.useState(0);
	const [userSocket, setUserSocket] = React.useState();
	const [userUpdated, setUserUpdated] = React.useState();
	// const [playNotificationSound, setPlayNotificationSound] = React.useState();

	// For future reference I have to comment all audio codes
	// const [play] = useSound(`${process.env.PUBLIC_URL}/swift.mp3`);

	// const playSound = () => {
	// 	setPlayNotificationSound(playNotificationSound);
	// 	play();
	// };

	const setUpSocket = () => {
		const token = sessionStorage.getItem('token');
		if (token && !socket) {
			const newSocket = io(process.env.REACT_APP_API_URL, {
				query: { id: sessionStorage.getItem('id') },
				path: '/socket.io',
				transports: ['websocket'],
				secure: true,
			});

			newSocket.on('disconnect', () => {
				setSocket(null);
				setTimeout(setUpSocket, 3000);
			});

			newSocket.on('connect', () => {
				// console.log('Socket connected');
				newSocket.emit('user_connected', {
					id: sessionStorage.getItem('id'),
					name: sessionStorage.getItem('fullName'),
				});

				newSocket.on('connected_users', async data => {
					setUserSocket(data.socket);
					setUserUpdated(data.updatedAt);
				});

				newSocket.on('display_messages', data => {
					setMessages(data);
					setTyping('');
				});

				newSocket.on('typing', data => {
					if (data.value !== '') {
						setTyping(data.text);
					} else {
						setTyping('');
					}
				});

				newSocket.on('notification', data => {
					setNotification(data);
					setCount(prev => prev + 1);
				});
			});

			setSocket(newSocket);
		}
	};

	React.useEffect(() => {
		setUpSocket();
	}, []);

	return (
		<Router>
			<Switch>
				<Route exact path='/' component={Signup} />
				<Route exact path='/email' component={LoginEmail} />
				<Route
					exact
					path='/password'
					render={() => <LoginPassword setUpSocket={setUpSocket} />}
				/>
				<Route
					exact
					path='/chat/:userId'
					render={() => (
						<Chat
							socket={socket}
							messages={messages}
							users={users}
							setTyping={setTyping}
							typing={typing}
							setNotification={setNotification}
							notification={notification}
							setCount={setCount}
							count={count}
							userSocket={userSocket}
							userUpdated={userUpdated}
							// playSound={playSound}
						/>
					)}
				/>
				<Route
					exact
					path='/friends'
					render={() => (
						<ListUsers
							socket={socket}
							connectedUsers={connectedUsers}
							loading={loading}
							setLoading={setLoading}
							allUsers={users}
							setNotification={setNotification}
							notification={notification}
							setCount={setCount}
							count={count}
							userSocket={userSocket}
							userUpdated={userUpdated}
						/>
					)}
				/>
				<Route component={NotFound} />
			</Switch>
		</Router>
	);
}

export default App;
