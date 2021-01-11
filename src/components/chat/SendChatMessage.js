import React, { useRef, useState, useEffect } from 'react';
import {
	ClickAwayListener,
	IconButton,
	makeStyles,
	MenuList,
	Popper,
	TextField,
} from '@material-ui/core';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { makeChatService } from '../../services/chatService';

const useStyles = makeStyles(() => ({
	notchedOutline: {
		borderWidth: '1px',
		borderColor: 'lightgray !important',
		borderRadius: '20px 0px 0px 20px',
		position: 'absolute',
	},
	emojiButton: {
		width: '40px',
		height: '40px',
		border: 'lightgray !important',
		backgroundColor: 'lightgray',
		color: 'rgb(87, 87, 21)',
		borderRadius: '0 20px 20px 0',
	},
}));
const SendChatMessage = ({
	message,
	setMessage,
	sendMessage,
	allowNextLine,
	handleChange,
}) => {
	const classes = useStyles();

	const [open, setOpen] = useState(false);
	const anchorRef = useRef(null);

	const addEmoji = e => {
		if (message === undefined) {
			setMessage(e.native);
		} else {
			setMessage(message + e.native);
		}
	};

	const handleToggle = () => {
		setOpen(prevOpen => !prevOpen);
	};

	const handleClose = event => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}

		setOpen(false);
	};

	return (
		<div>
			<div className='input-wrap'>
				<TextField
					variant='outlined'
					fullWidth
					autoFocus
					size='small'
					multiline={allowNextLine}
					rowsMax={4}
					value={message === undefined ? '' : message}
					InputProps={{
						classes: {
							notchedOutline: classes.notchedOutline,
						},
					}}
					placeholder='Type a message...'
					onKeyDown={sendMessage}
					onChange={handleChange}
				/>
				<IconButton
					ref={anchorRef}
					onClick={handleToggle}
					className={classes.emojiButton}
				>
					<InsertEmoticonIcon />
				</IconButton>
				<Popper open={open} anchorEl={anchorRef.current}>
					<ClickAwayListener onClickAway={handleClose}>
						<MenuList
							style={{ float: 'right' }}
							autoFocusItem={open}
							id='menu-list-grow'
						>
							<Picker onSelect={addEmoji} />
						</MenuList>
					</ClickAwayListener>
				</Popper>
			</div>
		</div>
	);
};

export default SendChatMessage;
