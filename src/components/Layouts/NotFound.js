import React from 'react';
import { Col, Container, Jumbotron, Row } from 'react-bootstrap';

const NotFound = () => {
	return (
		<div className='mt-5'>
			<Container>
				<Row>
					<Col>
						<Jumbotron fluid>
							<Container>
								<h1>Page not found</h1>
								<p>
									The page you are trying to find does not exist, check again
								</p>
							</Container>
						</Jumbotron>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default NotFound;
