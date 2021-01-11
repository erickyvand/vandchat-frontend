import React from 'react';
import { Form } from 'react-bootstrap';

const SearchUser = ({ handleSearch }) => {
	return (
		<div>
			<Form.Control
				type='text'
				placeholder='Search a user...'
				onChange={handleSearch}
			/>
		</div>
	);
};

export default SearchUser;
