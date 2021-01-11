import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { IconButton, Tooltip } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Card, Col, Row } from 'react-bootstrap';

const Header = ({ match }) => {
	const handleLogout = () => {
		sessionStorage.removeItem('id');
		sessionStorage.removeItem('fullName');
		sessionStorage.removeItem('token');
		location.href = '/email';
	};
	return (
		<div>
			<Row className='mt-2'>
				{match.path === '/chat/:userId' ? (
					''
				) : (
					<Col xs={12} sm={12}>
						<Card className='bg-info'>
							<Card.Body>
								<Row>
									<Col xs={5} sm={5} md={6}>
										<Card.Title className='text-white'>VandChat</Card.Title>
									</Col>
									<Col xs={7} sm={7} md={6}>
										<Card.Title className='float-right text-white'>
											{sessionStorage.getItem('fullName')}
											<Tooltip title='Exit Chat'>
												<IconButton color='inherit' onClick={handleLogout}>
													<ExitToAppIcon />
												</IconButton>
											</Tooltip>
										</Card.Title>
									</Col>
								</Row>
							</Card.Body>
						</Card>
					</Col>
				)}
			</Row>
		</div>
	);
};

export default withRouter(Header);
