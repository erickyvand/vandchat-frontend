import React from 'react';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';
import { userService } from '../../services/user.service';

const ChatMessages = ({ messages, receiverId }) => {
	const [users, setUsers] = React.useState([]);
	let messagesEnd = React.useRef(null);

	const thread = messages.filter(
		message =>
			(message.receiverId === receiverId &&
				message.user === sessionStorage.getItem('id')) ||
			(message.receiverId === sessionStorage.getItem('id') &&
				message.user === receiverId)
	);

	// scroll to bottom inside element
	const scrollToBottom = () => {
		messagesEnd.current.scrollIntoView({ behavior: 'smooth' });
	};

	React.useEffect(async () => {
		try {
			const results = await userService();
			setUsers(results.data.data);
		} catch (error) {}

		scrollToBottom();
	}, [messages, receiverId]);

	return (
		<div
			style={{ width: '100%' }}
			className='overflow-auto mobile-height-body chat-container-height'
		>
			{thread.length === 0
				? ''
				: thread.map(message => {
						const user = users.find(user => user._id === receiverId);

						if (user !== undefined && message.user === user._id) {
							return (
								<Row key={message._id} className='m-2'>
									<Col>
										<div className='float-left'>
											<h6 className='color-users-title'>{user.fullName}</h6>
											<p className='bg-right text-white p-2 border-left-radius'>
												{message.message} <br />
												<small className='text-white'>
													{moment(message.createdAt).calendar({
														sameDay: `[${moment(message.createdAt).format(
															'HH:mm'
														)}]`,
														lastWeek: `[${moment(message.createdAt).format(
															'Do MMM YYYY HH:mm'
														)}]`,
														sameElse: `[${moment(message.createdAt).format(
															'Do MMM YYYY HH:mm'
														)}]`,
													})}
												</small>
											</p>
										</div>
									</Col>
								</Row>
							);
						} else {
							return (
								<Row key={message._id} className='m-1'>
									<Col>
										<div className='float-right'>
											<h6>{sessionStorage.getItem('fullName')}</h6>
											<p className='bg-info border-right-radius p-2 text-white'>
												{message.message} <br />
												<small className='text-white'>
													{moment(message.createdAt).calendar({
														sameDay: `[${moment(message.createdAt).format(
															'HH:mm'
														)}]`,
														lastWeek: `[${moment(message.createdAt).format(
															'Do MMM YYYY HH:mm'
														)}]`,
														sameElse: `[${moment(message.createdAt).format(
															'Do MMM YYYY HH:mm'
														)}]`,
													})}
												</small>
											</p>
										</div>
									</Col>
								</Row>
							);
						}
				  })}
			<div ref={messagesEnd}></div>
		</div>
	);
};

export default ChatMessages;
