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
  // Fade,
  // Paper
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import Logo from '../../components/Logo';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_FABRIC, USER_DEVICE_TOKEN, USER_TOKEN } from '../../common';

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
  // paper: {
  //   margin: theme.spacing(1),
  // },
  // svg: {
  //   width: 100,
  //   height: 100,
  // },
  // polygon: {
  //   fill: theme.palette.common.white,
  //   stroke: theme.palette.divider,
  //   strokeWidth: 1,
  // },
}));

const TopBar = ({
  className,
  onMobileNavOpen,
  ...rest
}) => {
  const classes = useStyles();
  const [notification, setNotification] = useState(false);
  // const [checked, setChecked] = React.useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    navigator.serviceWorker.addEventListener("message", (message) => {
      setNotification(true);
    });
  }, []);

  // const handleChange = () => {
  //   setChecked((prev) => !prev);
  // };

  const handleSignOut = () => {
    Cookies.remove(USER_TOKEN);
    Cookies.remove(ACCESS_TOKEN_FABRIC);
    Cookies.remove(USER_DEVICE_TOKEN);
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
              {/* <NotificationsIcon style={{ color: 'white' }} onClick={() => handleChange()} /> */}
              {/* <Fade in={checked}>
                <Paper elevation={4} className={classes.paper}>
                  <svg className={classes.svg}>
                    <polygon points="0,100 50,00, 100,100" className={classes.polygon} />
                  </svg>
                </Paper>
              </Fade> */}
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