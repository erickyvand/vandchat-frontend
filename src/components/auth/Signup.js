import React, { useState } from 'react';
import {
	Container,
	Row,
	Col,
	Card,
	Form,
	Button,
	Spinner,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { signupService } from '../../services/authService';

const Signup = () => {
	const [fullName, setFullName] = useState();
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();
	const [redirect, setRedirect] = useState(false);

	let nameErr;
	let nameSuccess;
	let emailErr;
	let emailSuccess;
	let passErr;
	let passSuccess;

	if (fullName === '') {
		nameErr = 'Full Name is not allowed to be empty';
	} else if (fullName !== undefined && fullName.length < 2) {
		nameErr = 'Full Name length must be at least 2 characters long';
	} else if (fullName === undefined) {
		nameSuccess = '';
	} else {
		nameSuccess = 'Name looks good';
	}

	if (email === '') {
		emailErr = 'Email is not allowed to be empty';
	} else if (
		email !== undefined &&
		!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
			email
		)
	) {
		emailErr = 'Email must be a valid email';
	} else if (email === undefined) {
		emailSuccess = '';
	} else {
		emailSuccess = 'Email looks good';
	}

	if (password === '') {
		passErr = 'Password is not allowed to be empty';
	} else if (password !== undefined && password.length < 6) {
		passErr = 'Password length must be at least 6 characters long';
	} else if (password === undefined) {
		passSuccess = '';
	} else {
		passSuccess = 'Password looks good';
	}

	const handleChangeFullName = e => {
		setFullName(e.target.value);
	};

	const handleChangeEmail = e => {
		setEmail(e.target.value);
	};

	const handleChangePassword = e => {
		setPassword(e.target.value);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setLoading(true);
		try {
			const results = await signupService({ fullName, email, password });

			sessionStorage.setItem('id', results.data.data.user._id);
			sessionStorage.setItem('fullName', results.data.data.user.fullName);
			sessionStorage.setItem('token', results.data.data.token);

			setLoading(false);
			setRedirect(true);
		} catch (err) {
			setError(err.response.data.message);
			setLoading(false);
		}
	};

	if (redirect) {
		location.href = '/friends';
	}

	return (
		<div>
			<Container fluid='md'>
				<Row>
					<Col xs={12} sm={12} md={6} className='col-center'>
						<Card>
							<Card.Body>
								<Card.Title>Signup Here</Card.Title>
								<Form onSubmit={handleSubmit}>
									<Form.Group>
										<Form.Control
											type='text'
											placeholder='Full Name'
											value={fullName || ''}
											className={
												nameErr ? 'is-invalid' : nameSuccess ? 'is-valid' : ''
											}
											onChange={handleChangeFullName}
										/>
										{nameErr ? (
											<Form.Text className='invalid-feedback'>
												{nameErr}
											</Form.Text>
										) : (
											<Form.Text className='valid-feedback'>
												{nameSuccess}
											</Form.Text>
										)}
									</Form.Group>
									<Form.Group>
										<Form.Control
											type='text'
											placeholder='Email'
											value={email || ''}
											className={
												emailErr
													? 'is-invalid'
													: error
													? 'is-invalid'
													: emailSuccess
													? 'is-valid'
													: ''
											}
											onChange={handleChangeEmail}
										/>
										{emailErr ? (
											<Form.Text className='invalid-feedback'>
												{emailErr}
											</Form.Text>
										) : error ? (
											<Form.Text className='invalid-feedback'>
												{error}
											</Form.Text>
										) : (
											<Form.Text className='valid-feedback'>
												{emailSuccess}
											</Form.Text>
										)}
									</Form.Group>
									<Form.Group>
										<Form.Control
											type='password'
											placeholder='Password'
											value={password || ''}
											className={
												passErr ? 'is-invalid' : passSuccess ? 'is-valid' : ''
											}
											onChange={handleChangePassword}
										/>
										{passErr ? (
											<Form.Text className='invalid-feedback'>
												{passErr}
											</Form.Text>
										) : (
											<Form.Text className='valid-feedback'>
												{passSuccess}
											</Form.Text>
										)}
									</Form.Group>
									<Form.Group>
										<Button
											type='submit'
											variant='primary'
											disabled={
												!fullName ||
												!email ||
												!password ||
												nameErr ||
												emailErr ||
												passErr ||
												loading
											}
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
												'Signup'
											)}
										</Button>
									</Form.Group>
								</Form>
								<div>
									Already have an account? <Link to='/email'>Login</Link>
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Signup;
