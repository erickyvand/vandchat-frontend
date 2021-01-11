import React, { useEffect, useState } from 'react';
import {
	Button,
	Card,
	Col,
	Container,
	Form,
	Row,
	Spinner,
} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { passwordService } from '../../services/authService';

function LoginPassword() {
	if (!sessionStorage.getItem('accessToken')) {
		return <Redirect to='/email' />;
	}

	const [password, setPassword] = useState();
	const [error, setError] = useState();
	const [loading, setLoading] = useState(false);
	const [redirect, setRedirect] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	let passErr;
	let passSuccess;

	if (password === '') {
		passErr = 'Password is not allowed to be empty';
	} else if (password !== undefined && password.length < 6) {
		passErr = 'Password length must be at least 6 characters long';
	} else if (password === undefined) {
		passSuccess = '';
	} else {
		passSuccess = 'Password looks good';
	}

	const handleChangePassword = e => {
		setPassword(e.target.value);
		setError('');
	};

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleSubmit = async e => {
		e.preventDefault();

		setLoading(true);

		try {
			const results = await passwordService({ password });
			setLoading(false);
			setRedirect(true);

			sessionStorage.setItem('id', results.data.data.user._id);
			sessionStorage.setItem('fullName', results.data.data.user.fullName);
			sessionStorage.setItem('token', results.data.data.token);
			sessionStorage.removeItem('accessToken');
		} catch (err) {
			setError(err.response.data.message);
			setLoading(false);
		}
	};

	if (redirect) {
		location.href = '/friends';
	}

	useEffect(() => {
		document.title = 'VandChat | Login';
	}, []);

	return (
		<div>
			<Container>
				<Row>
					<Col xs={12} sm={12} md={6} className='col-center'>
						<Card>
							<Card.Body>
								<Card.Title>Provide your password to login</Card.Title>
								<Form onSubmit={handleSubmit}>
									<Form.Group>
										<div className='show-password'>
											<Form.Control
												type={showPassword ? 'text' : 'password'}
												placeholder='Password'
												value={password || ''}
												className={
													passErr
														? 'is-invalid'
														: error
														? 'is-invalid'
														: passSuccess
														? 'is-valid'
														: ''
												}
												onChange={handleChangePassword}
											/>
											<div onClick={handleShowPassword}>
												{showPassword ? 'Hide' : 'Show'}
											</div>
										</div>
										<small className='text-danger'>{error && error}</small>
										{passErr ? (
											<Form.Text className='invalid-feedback'>
												{passErr}
											</Form.Text>
										) : error ? (
											<Form.Text className='invalid-feedback'>
												{error}
											</Form.Text>
										) : (
											<Form.Text className='valid-feedback'>
												{passSuccess}
											</Form.Text>
										)}
									</Form.Group>
									<Button
										type='submit'
										variant='primary'
										disabled={!password || passErr || loading}
									>
										{loading ? (
											<>
												<Spinner
													as='span'
													animation='grow'
													size='sm'
													role='status'
													aria-hidden='true'
												/>
												Loading...
											</>
										) : (
											'Login'
										)}
									</Button>
								</Form>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default LoginPassword;
