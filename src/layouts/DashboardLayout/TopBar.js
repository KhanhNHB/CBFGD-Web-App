import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import Logo from '../../components/Logo';
import Cookies from 'js-cookie';
import { USER_DEVICE_TOKEN, USER_TOKEN } from '../../common';
import { actChangeKeyword, actLoadAssignHubStatus, actLoadAssignOrderToShipperStatus, actLoadProviderName } from '../../actions';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: { theme },
  avatar: {
    width: 60,
    height: 60
  },
  badge: {
    color: 'white',
    padding: 10,
    backgroundColor: 'red'
  },
}));

const TopBar = ({
  className,
  onMobileNavOpen,
  ...rest
}) => {
  const classes = useStyles();
  const [notification, setNotification] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    navigator.serviceWorker.addEventListener("message", (message) => {
      setNotification(true);
    });
  }, []);

  const handleSignOut = () => {
    Cookies.remove(USER_TOKEN);
    Cookies.remove(USER_DEVICE_TOKEN);
    dispatch(actLoadProviderName("NONE"));
    dispatch(actLoadAssignHubStatus("NONE"));
    dispatch(actLoadAssignOrderToShipperStatus("NONE"));
    dispatch(actChangeKeyword(''));
    navigate('/', { replace: true });
  }

  return (
    <AppBar
      className={clsx(classes.root, className)}
      elevation={0}
      {...rest}
    >
      <Toolbar>
        <RouterLink to="/app/invoices-list">
          <Logo />
        </RouterLink>
        <Box flexGrow={1} />
        <Hidden mdDown>
          <IconButton color="inherit">
            <Badge variant={notification ? 'dot' : 'standard'} color='error'>
              <NotificationsIcon style={{ color: 'white' }} />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <InputIcon style={{ color: 'white' }} onClick={() => handleSignOut()} />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

export default TopBar;