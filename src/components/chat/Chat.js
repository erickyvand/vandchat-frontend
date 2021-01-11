import React, { useEffect, useState } from 'react';
import { Redirect, withRouter } from 'react-router';
import { Card, Col, Container, Row, Spinner, Table } from 'react-bootstrap';
import moment from 'moment';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ChatMessages from './ChatMessages';
import SendChatMessage from './SendChatMessage';
import Header from '../Layouts/Header';
import ChatUsers from './ChatUsers';
import SearchChatUser from '../users/SearchChatUser';
import { IconButton, Tooltip } from '@material-ui/core';
import { userService } from '../../services/user.service';

const Chat = ({
	match,
	history,
	socket,
	messages,
	setTyping,
	typing,
	setNotification,
	notification,
	setCount,
	count,
	playSound,
	userSocket,
	userUpdated,
}) => {
	if (!sessionStorage.getItem('token')) {
		return <Redirect to='/' />;
	}
	const userId = match.params.userId;
	const [message, setMessage] = useState('');
	const [allowNextLine, setAllowNextLine] = useState(false);
	const [chatUsers, setChatUsers] = useState([]);
	const [chatResults, setChatResults] = useState([]);
	const [diplayResults, setDiplayResults] = useState(false);
	const [users, setUsers] = useState([]);

	let user;
	if (users.length > 0) {
		user = users.find(u => u._id === userId);
	}

	const sendMessage = async e => {
		if (e.keyCode === 13 && !e.shiftKey) {
			if (message !== '') {
				socket.emit('send_message', { userId, message }, () => setMessage(''));

				if (notification.user === userId) {
					setNotification({});
					setCount(0);
				}
			}
			setAllowNextLine(false);
			setMessage('');
			e.preventDefault();
		} else {
			setAllowNextLine(true);
		}
	};

	const handleChange = e => {
		setMessage(e.target.value);
		socket.emit('typing', { text: 'typing...', userId, value: e.target.value });

		if (e.target.value === '') {
			setTyping('');
		}
	};

	const getData = data => {
		setChatResults(data);
	};

	const handleSearchUser = e => {
		if (chatResults.length > 0) {
			const res = chatResults.filter(
				user => user.fullName.indexOf(e.target.value) !== -1
			);
			setChatUsers(res);
		}

		if (e.target.value !== '') {
			setDiplayResults(true);
		} else {
			setDiplayResults(false);
		}
	};

	useEffect(async () => {
		document.title = 'VandChat | Chat';
		const reponse = await userService();
		setUsers(reponse.data.data);
	}, [userId, userSocket, userUpdated]);

	return (
		<div>
			<Container>
				<Header />
				<Row>
					<Col>
						<Card>
							<Table bordered responsive='xs' responsive='sm' className='table'>
								<tbody>
									<tr className='bg-dark'>
										<td style={{ width: 373 }} className='hide-column'>
											<SearchChatUser handleSearchUser={handleSearchUser} />
										</td>
										<td className='maximize-width'>
											<div style={{ display: 'flex' }}>
												<Tooltip title='Back'>
													<IconButton onClick={() => history.push('/friends')}>
														<ArrowBackIosIcon className='text-white' />
													</IconButton>
												</Tooltip>
												<div>
													<span className='font-weight-bold text-white'>
														{user !== undefined ? (
															user.fullName
														) : (
															<Spinner animation='grow' />
														)}
													</span>
													<br />
													<small>
														{typing ? (
															<em className=' text-white'>{typing}</em>
														) : (
															<span className='text-white'>
																{user !== undefined && user.socket === ''
																	? 'last seen ' +
																	  moment(user.updatedAt).calendar({
																			sameDay: `[${moment(
																				user.updatedAt
																			).format('HH:mm')}]`,
																			lastWeek: `[${moment(
																				user.updatedAt
																			).format('Do MMM YYYY HH:mm')}]`,
																			sameElse: `[${moment(
																				user.updatedAt
																			).format('Do MMM YYYY HH:mm')}]`,
																	  })
																	: 'online'}
															</span>
														)}
													</small>
												</div>
											</div>
										</td>
									</tr>
									<tr>
										<td
											rowSpan='2'
											style={{ width: 373 }}
											className='chat-container-height hide-column'
										>
											<ChatUsers
												setNotification={setNotification}
												notification={notification}
												setCount={setCount}
												count={count}
												playSound={playSound}
												onlineUser={user}
												receiverId={userId}
												sendDataToParent={getData}
												chatUsers={chatUsers}
												diplayResults={diplayResults}
												userSocket={userSocket}
												userUpdated={userUpdated}
											/>
										</td>
										<td className='chat-container-height mobile-height-body maximize-width'>
											<ChatMessages
												receiverId={userId}
												messages={messages}
												users={users}
											/>
										</td>
									</tr>
									<tr>
										<td className='maximize-width'>
											<SendChatMessage
												receiverId={userId}
												message={message}
												setMessage={setMessage}
												sendMessage={sendMessage}
												allowNextLine={allowNextLine}
												handleChange={handleChange}
											/>
										</td>
									</tr>
								</tbody>
							</Table>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default withRouter(Chat);
