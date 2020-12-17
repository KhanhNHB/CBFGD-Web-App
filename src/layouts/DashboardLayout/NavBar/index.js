import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  Users as UsersIcon,
  MapPin as MapIcon,
  Octagon,
} from 'react-feather';
import NavItem from './NavItem';
import { useSelector } from 'react-redux';

const itemsAdmin = [
  {
    href: '/app/invoices-list',
    icon: ShoppingBagIcon,
    title: 'Invoices'
  },
  {
    href: '/app/shipper',
    icon: UsersIcon,
    title: 'Shipper'
  },
  {
    href: '/app/account',
    icon: UserIcon,
    title: 'Account'
  },
  {
    href: '/app/shipping-area',
    icon: MapIcon,
    title: 'Shipping Area'
  },
  {
    href: '/app/hub-manager',
    icon: Octagon,
    title: 'Hub Manager'
  }
];

const itemsHubManager = [
  {
    href: '/app/invoices-list',
    icon: ShoppingBagIcon,
    title: 'Invoices'
  },
  {
    href: '/app/shipper',
    icon: UsersIcon,
    title: 'Shipper'
  },
  {
    href: '/app/account',
    icon: UserIcon,
    title: 'Account'
  },
  {
    href: '/app/shipping-area',
    icon: MapIcon,
    title: 'Shipping Area'
  }
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const profile = useSelector(state => state.profile.profile);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={2}
      >
        <Typography
          className={classes.name}
          color="textPrimary"
          variant="h5"
        >
          {
            profile && `${profile.last_name} ${profile.first_name}`
          }
        </Typography>
        <Typography
          className={classes.name}
          color="textPrimary"
          variant="h5"
        >
          {
            profile && `${profile.role}`
          }
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {
            (profile && profile.role === 'Admin')
              ? itemsAdmin.map((item) => (
                <NavItem
                  href={item.href}
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                />
              ))
              : itemsHubManager.map((item) => (
                <NavItem
                  href={item.href}
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                />
              ))
          }
        </List>
      </Box>
      <Box flexGrow={1} />
      <Box
        p={2}
        m={2}
        bgcolor="background.dark"
      >
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false
};

export default NavBar;