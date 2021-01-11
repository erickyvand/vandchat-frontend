import React from 'react';
import { Form } from 'react-bootstrap';

const SearchChatUser = ({ handleSearchUser }) => {
	return (
		<div>
			<Form.Control
				type='text'
				placeholder='Search a user...'
				onChange={handleSearchUser}
			/>
		</div>
	);
};

export default SearchChatUser;
