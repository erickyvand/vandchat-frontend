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
import { emailService } from '../../services/authService';

const LoginEmail = () => {
	const [email, setEmail] = useState();
	const [error, setError] = useState();
	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState();
	const [redirect, setRedirect] = useState(false);

	let emailErr;
	let emailSuccess;

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

	const handleChangeEmail = async e => {
		setEmail(e.target.value);
		setError('');
	};

	const handleSubmit = async e => {
		e.preventDefault();

		setLoading(true);
		try {
			const results = await emailService({ email });
			setError('');
			setToken(results.data.data.token);
			setRedirect(true);
			setLoading(false);
		} catch (err) {
			setError(err.response.data.message);
			setLoading(false);
		}
	};

	if (redirect) {
		sessionStorage.setItem('accessToken', token);
		location.href = `/password?access=${token}`;
	}

	useEffect(() => {
		document.title = 'VandChat | Login';
	}, []);

	return (
		<div>
			<Container fluid='md'>
				<Row>
					<Col xs={12} sm={12} md={6} className='col-center'>
						<Card>
							<Card.Body>
								<Card.Title>Insert your email to proceed login</Card.Title>
								<Form onSubmit={handleSubmit}>
									<Form.Group>
										<Form.Control
											type='text'
											placeholder='Email'
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
									<Button
										type='submit'
										variant='primary'
										disabled={!email || emailErr || error || loading}
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
											'Submit'
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
};

export default LoginEmail;
