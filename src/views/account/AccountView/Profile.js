import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100
  }
}));

const Profile = ({ user, className }) => {
  const classes = useStyles();
  return (
    <Card className={clsx(classes.root, className)}>
      <CardContent>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          <Avatar className={classes.avatar} src={user.avatar
            ? user.avatar
            : 'https://res.cloudinary.com/dvehkdedj/image/upload/v1598777976/269-2697881_computer-icons-user-clip-art-transparent-png-icon_yqpi0g.png'}
          />
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            {user.last_name} {user.first_name}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;