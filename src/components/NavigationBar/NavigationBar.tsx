import React from 'react';
import { useLocation, useHistory } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Theme, makeStyles, Menu, MenuItem } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { NavLink} from "react-router-dom"
import {SignOut} from 'aws-amplify-react'

// import { ROUTES } from '../../common/constants';
// import Logo from '../../assets/images/logo.png';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    flexGrow: 1,
  },
  toolbarButtons: {
    marginLeft: 'auto',
  },
}));

const NavigationBar: React.FC = () => {

  const location = useLocation();
  const classes = useStyles();
  const history = useHistory();

  const handleMap = () => {
    if (location.pathname !== "/") {
      history.push("/");
    }
  }

  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };


  return (
    <AppBar position="fixed">
        <Toolbar>
            <Typography variant="h6" className={classes.title}>
              <NavLink activeStyle={{color: 'white', textDecoration: 'none'}} to="/">KISCO Towerview</NavLink>
            </Typography>
          
            <div className={classes.toolbarButtons}>
            <NotificationsIcon />
            </div>
          <div className={classes.toolbarButtons}>
            <Button color="inherit" onClick={()=> handleMap()}>Map</Button>
          </div>
          <SignOut />
          {/* <div className={classes.toolbarButtons}>
            <MoreVertIcon aria-controls="more" aria-haspopup="true" onClick={handleClick} />
            <Menu
              id="more"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </div> */}
        </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;
