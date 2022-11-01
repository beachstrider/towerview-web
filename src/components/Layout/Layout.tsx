import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme, makeStyles } from '@material-ui/core';

// import NavigationBar from '../NavigationBar/NavigationBar';
import MiniDrawer from '../MiniDrawer/MiniDrawer';

const useStyles = makeStyles((theme: Theme) => ({
	appBody: {
		flexGrow: 1,
		height: '100vh',
		overflow: 'auto',
	}
}));

const Layout: React.FC = (props) => {

	const classes = useStyles();

	return(
		<Box>
			<MiniDrawer />
			<div className={classes.appBody}>
				{ props.children }
			</div>
		</Box>
	);	
}

export default Layout;