import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  makeStyles,
  CircularProgress,
} from '@material-ui/core';
import Page from '../../components/Page';
import API from '../../api/API';
import { LOGIN_ENDPOINT } from '../../api/endpoint';
import { useDispatch } from 'react-redux';
import { actSignIn } from '../../actions';
import Cookies from 'js-cookie';
import { USER_TOKEN } from '../../common';

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
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const readCookie = () => {
      const user = Cookies.get(USER_TOKEN);
      if (user) {
        navigate('/app/dashboard', { replace: true });
      }
    };

    readCookie();
  }, [navigate]);

  const signIn = async (username, password) => {
    setIsLoading(true);
    const response = await API.post(LOGIN_ENDPOINT, {
      phone: username,
      password: password,
    });

    const json = await response.json();

    if (json.message) {
      setIsLoading(false);
      alert(json.message);
      return;
    }
    setIsLoading(false);
    Cookies.set(USER_TOKEN, json.data.access_token);
    dispatch(actSignIn(json.data.access_token));
    navigate('/app/dashboard', { replace: true });
  }

  return (
    <Page className={classes.root} title="Login">
      <Box display="flex" flexDirection="column" height="100%" justifyContent="center">
        <Container maxWidth="sm">
          <Box mb={2}>
            <img style={{ height: 200, width: 200, marginLeft: 170 }} src={require("../../images/logo_gds.png")} alt="" />
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
              disabled={isLoading}
              color="primary"
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={() => signIn(username, password)}
            >
              {
                isLoading
                  ? <CircularProgress size={26} />
                  : 'Sign in now'
              }
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
