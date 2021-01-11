import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Badge, Col, ListGroup, Row, Spinner } from 'react-bootstrap';
import moment from 'moment';
import {
	deleteEmptyChat,
	threadChatMessagesService,
} from '../../services/chatService';

const ChatUsers = ({
	setNotification,
	notification,
	setCount,
	count,
	receiverId,
	sendDataToParent,
	chatUsers,
	diplayResults,
	userSocket,
	userUpdated,
}) => {
	const history = useHistory();
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [deletedMessage, setDeletedMessage] = useState();

	const handleClickUser = async userId => {
		const deleted = await deleteEmptyChat();
		setDeletedMessage(deleted.data.message);

		if (notification.user === userId) {
			setNotification({});
			setCount(0);
		}
		history.push(`/chat/${userId}`);
	};

	// remove duplicate in array of object
	let uniq = {};

	const usersFilter = messages.filter(
		obj => !uniq[obj.id] && (uniq[obj.id] = true) && uniq[obj.id]
	);

	const users = usersFilter.filter(
		user => user.id !== sessionStorage.getItem('id')
	);

	useEffect(async () => {
		setLoading(true);

		const response = await threadChatMessagesService(
			sessionStorage.getItem('id')
		);
		setMessages(response.data.data);
		sendDataToParent(users);

		setLoading(false);
	}, [deletedMessage, userSocket, userUpdated]);
	return (
		<div>
			<ListGroup className='overflow-auto mobile-height chat-container-height'>
				{loading ? (
					<Spinner
						animation='grow'
						style={{ margin: 'auto', width: 200, height: 200 }}
					/>
				) : users.length === 0 ? (
					<p className='text-center'>No messages</p>
				) : diplayResults ? (
					chatUsers.length === 0 ? (
						<p className='text-center'>
							No user found <br /> This search is case sensitive check well and
							retype again.
						</p>
					) : (
						chatUsers.map(user => {
							if (notification.user === user.id) {
								return (
									<ListGroup.Item
										key={user.id}
										action
										onClick={() => handleClickUser(user.id)}
										className='bg-info text-white font-weight-bold'
									>
										<Row>
											<Col md={10}>{user.fullName}</Col>
											<Col>
												<Badge variant='light'>{count}</Badge>
											</Col>
										</Row>
									</ListGroup.Item>
								);
							} else if (user.id === receiverId) {
								return (
									<ListGroup.Item
										key={user.id}
										action
										onClick={() => handleClickUser(user.id)}
										className='bg-light font-weight-bold'
									>
										{user.fullName}
										{' - '}
										{user.socket !== '' ? (
											<small>
												<Badge variant='success'>online</Badge>
											</small>
										) : (
											<small className='text-secondary'>
												{moment(user.updatedAt).calendar({
													sameDay: `[${moment(user.updatedAt).fromNow()}]`,
													lastDay: `[${moment(user.updatedAt).fromNow()}]`,
													lastWeek: `[${moment(user.updatedAt).fromNow()}]`,
													sameElse: `[${moment(user.updatedAt).format(
														'Do MMM YYYY'
													)}]`,
												})}
											</small>
										)}
									</ListGroup.Item>
								);
							} else {
								return (
									<ListGroup.Item
										key={user.id}
										action
										onClick={() => handleClickUser(user.id)}
									>
										{user.fullName}
										{' - '}
										{user.socket !== '' ? (
											<small>
												<Badge variant='success'>online</Badge>
											</small>
										) : (
											<small className='text-secondary'>
												{moment(user.updatedAt).calendar({
													sameDay: `[${moment(user.updatedAt).fromNow()}]`,
													lastDay: `[${moment(user.updatedAt).fromNow()}]`,
													lastWeek: `[${moment(user.updatedAt).fromNow()}]`,
													sameElse: `[${moment(user.updatedAt).format(
														'Do MMM YYYY'
													)}]`,
												})}
											</small>
										)}
									</ListGroup.Item>
								);
							}
						})
					)
				) : (
					users.map(user => {
						if (notification.user === user.id) {
							return (
								<ListGroup.Item
									key={user.id}
									action
									onClick={() => handleClickUser(user.id)}
									className='bg-info text-white font-weight-bold'
								>
									<Row>
										<Col md={10}>{user.fullName}</Col>
										<Col>
											<Badge variant='light'>{count}</Badge>
										</Col>
										<Col md={12}>
											<small className='font-weight-bold'>
												{notification.message.length <= 40
													? notification.message +
													  ' . ' +
													  moment(notification.createdAt).format('HH:mm')
													: notification.message.substr(0, 40) +
													  '... ' +
													  moment(notification.createdAt).format('HH:mm')}
											</small>
										</Col>
									</Row>
								</ListGroup.Item>
							);
						} else if (user.id === receiverId) {
							return (
								<ListGroup.Item
									key={user.id}
									action
									onClick={() => handleClickUser(user.id)}
									className='bg-light font-weight-bold'
								>
									{user.fullName}
								</ListGroup.Item>
							);
						} else {
							return (
								<ListGroup.Item
									key={user.id}
									action
									onClick={() => handleClickUser(user.id)}
								>
									{user.fullName}
									{' - '}
									{user.socket !== '' ? (
										<small>
											<Badge variant='success'>online</Badge>
										</small>
									) : (
										<small className='text-secondary'>
											{moment(user.updatedAt).calendar({
												sameDay: `[${moment(user.updatedAt).fromNow()}]`,
												lastDay: `[${moment(user.updatedAt).fromNow()}]`,
												lastWeek: `[${moment(user.updatedAt).fromNow()}]`,
												sameElse: `[${moment(user.updatedAt).format(
													'Do MMM YYYY'
												)}]`,
											})}
										</small>
									)}
								</ListGroup.Item>
							);
						}
					})
				)}
			</ListGroup>
		</div>
	);
};

export default ChatUsers;
