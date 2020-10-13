import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import Page from '../../components/Page';
import API from '../../api/API';
import { LOGIN_ENDPOINT } from '../../api/endpoint';
import { useDispatch } from 'react-redux';
import { actSignIn } from '../../actions';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = () => {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signIn = async (username, password) => {
    const response = await API.post(LOGIN_ENDPOINT, {
      username: username,
      password: password,
    });

    const json = await response.json();
    // if (json.message) {
    //      TODO: Show Alert or message login fail
    // }

    dispatch(actSignIn(json.data.access_token));
    navigate('/app/dashboard', { replace: true });
  }

  return (
    <Page className={classes.root} title="Login">
      <Box display="flex" flexDirection="column" height="100%" justifyContent="center">
        <Container maxWidth="sm">
          <Box mb={2}>
            <img style={{ height: 200, width: 200, marginLeft: 170 }} src={require("../../images/logo_gds.png")} />
          </Box>
          <TextField
            placeholder="Phone number or email"
            fullWidth
            margin="normal"
            name="username"
            onChange={event => {
              const { value } = event.target;
              setUsername(value);
            }}
            type="email"
            value={username}
            variant="outlined"
          />
          <TextField
            placeholder="Password"
            fullWidth
            margin="normal"
            name="password"
            onChange={event => {
              const { value } = event.target;
              setPassword(value);
            }}
            type="password"
            value={password}
            variant="outlined"
          />
          <Box my={2}>
            <Button
              color="primary"
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={() => signIn(username, password)}
            >
              Sign in now
                  </Button>
          </Box>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            Don&apos;t have an account?
                  {' '}
            <Link
              component={RouterLink}
              to="/register"
              variant="h6"
            >
              Sign up
                  </Link>
          </Typography>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
