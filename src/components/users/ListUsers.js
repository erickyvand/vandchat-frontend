import React, { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Badge, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import moment from 'moment';
import { makeChatService } from '../../services/chatService';
import Header from '../Layouts/Header';
import SearchUser from './SearchUser';
import { searchUserService, userService } from '../../services/user.service';

const ListUsers = ({
	loading,
	setLoading,
	notification,
	setNotification,
	count,
	setCount,
	userSocket,
	userUpdated,
}) => {
	if (!sessionStorage.getItem('token')) {
		return <Redirect to='/' />;
	}

	const history = useHistory();

	const [searchResults, setSearchResults] = useState([]);
	const [showResults, setShowResults] = useState(false);
	const [users, setUsers] = useState([]);

	const handleStartConversation = async userId => {
		setLoading(true);
		try {
			await makeChatService({
				receiverId: userId,
				message: '',
			});
		} catch (error) {
			console.log(error);
		}
		setLoading(false);

		if (notification.user === userId) {
			setNotification({});
			setCount(0);
		}

		history.push(`/chat/${userId}`);
	};

	const handleSearch = async e => {
		setLoading(true);
		const results = await searchUserService(e.target.value);
		setSearchResults(results.data.data);
		setLoading(false);

		if (e.target.value !== '') {
			setShowResults(true);
		} else {
			setShowResults(false);
		}
	};

	useEffect(async () => {
		document.title = 'VandChat | Home';
		setLoading(true);
		const reponse = await userService();
		setUsers(reponse.data.data);
		setLoading(false);
	}, [userSocket, userUpdated]);

	return (
		<div>
			<Container className='mt-2'>
				<Row>
					<Col>
						<Header />
					</Col>
				</Row>
				<Row>
					<Col>
						<h5 className='text-white'>All Friends</h5>
					</Col>
					<Col>
						<p className='text-white float-right'>
							{users.length > 0 &&
								users.filter(user => user.socket !== '').length}{' '}
							online
						</p>
					</Col>
				</Row>
				<Row>
					<Col>
						<SearchUser handleSearch={handleSearch} />
					</Col>
				</Row>
				<Row>
					{loading ? (
						<Col>
							<Card style={{ height: 500 }}>
								<Spinner
									animation='grow'
									style={{ margin: 'auto', width: 200, height: 200 }}
								/>
							</Card>
						</Col>
					) : users.length === 0 ? (
						<Col>
							<Card>
								<p className='p-2 text-center'>
									Oops you are the only one to this platform. Wait until we will
									get other registered users.
								</p>
							</Card>
						</Col>
					) : showResults ? (
						searchResults.length === 0 ? (
							<Col className='mt-2'>
								<Card>
									<p className='p-2 text-center'>No user found</p>
								</Card>
							</Col>
						) : (
							searchResults.map(user => (
								<Col key={user._id} xs={12} sm={12} md={4} className='mt-2'>
									<Card
										className='list-user-card'
										onClick={() => handleStartConversation(user._id)}
									>
										<Card.Body>
											<Card.Title>
												<Row>
													<Col xs={12} sm={12} md={12}>
														{user.fullName}{' '}
														{notification.user === user._id ? (
															<small className='float-right'>
																<Badge variant='primary'>{count}</Badge>
															</small>
														) : (
															''
														)}
													</Col>
													<Col xs={12} sm={12} md={12}>
														{user.socket !== '' ? (
															<small>
																<Badge pill variant='success'>
																	online
																</Badge>
															</small>
														) : (
															<small className='text-secondary'>
																{'disconnected ' +
																	moment(user.updatedAt).calendar({
																		sameDay: `[${moment(
																			user.updatedAt
																		).fromNow()}]`,
																		lastDay: `[${moment(
																			user.updatedAt
																		).fromNow()}]`,
																		lastWeek: `[${moment(
																			user.updatedAt
																		).fromNow()}]`,
																		sameElse: `[${moment(user.updatedAt).format(
																			'Do MMM YYYY'
																		)}]`,
																	})}
															</small>
														)}
													</Col>
												</Row>
											</Card.Title>
										</Card.Body>
									</Card>
								</Col>
							))
						)
					) : (
						users.map(user => (
							<Col key={user._id} xs={12} sm={12} md={4} className='mt-2'>
								<Card
									className='list-user-card'
									onClick={() => handleStartConversation(user._id)}
								>
									<Card.Body>
										<Card.Title>
											<Row>
												<Col xs={12} sm={12} md={12}>
													{user.fullName}{' '}
													{notification.user === user._id ? (
														<small className='float-right'>
															<Badge variant='primary'>{count}</Badge>
														</small>
													) : (
														''
													)}
												</Col>
												<Col xs={12} sm={12} md={12}>
													{user.socket !== '' ? (
														<small>
															<Badge pill variant='success'>
																online
															</Badge>
														</small>
													) : (
														<small className='text-muted'>
															{'disconnected ' +
																moment(user.updatedAt).calendar({
																	sameDay: `[${moment(
																		user.updatedAt
																	).fromNow()}]`,
																	lastDay: `[${moment(
																		user.updatedAt
																	).fromNow()}]`,
																	lastWeek: `[${moment(
																		user.updatedAt
																	).fromNow()}]`,
																	sameElse: `[${moment(user.updatedAt).format(
																		'Do MMM YYYY'
																	)}]`,
																})}
														</small>
													)}
												</Col>
												<Col xs={12} sm={12} md={12}>
													{notification.user === user._id && (
														<small className='text-primary'>
															{notification.message.length <= 26
																? notification.message +
																  ' . ' +
																  moment(notification.createdAt).format('HH:mm')
																: notification.message.substr(0, 25) +
																  '... ' +
																  moment(notification.createdAt).format(
																		'HH:mm'
																  )}
														</small>
													)}
												</Col>
											</Row>
										</Card.Title>
									</Card.Body>
								</Card>
							</Col>
						))
					)}
				</Row>
			</Container>
		</div>
	);
};

export default ListUsers;
