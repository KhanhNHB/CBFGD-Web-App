import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  makeStyles,
  CircularProgress,
} from '@material-ui/core';
import Page from '../../components/Page';
import API from '../../api/API';
import { LOGIN_ENDPOINT, PROFILE_ENDPOINT } from '../../api/endpoint';
import { useDispatch } from 'react-redux';
import { actLoadProfile, actSignIn } from '../../actions';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_FABRIC, USER_TOKEN } from '../../common';

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
    const readCookie = async () => {
      const user = Cookies.get(USER_TOKEN);
      if (user) {
        const response = await API.post(`${PROFILE_ENDPOINT}`, {
          "access_token": user
        });

        if (response.ok) {
          const fetchData = await response.json();
          dispatch(actLoadProfile(fetchData.data));
          navigate('/app/invoices-list', { replace: true });
        }
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

    dispatch(actLoadProfile(json.data.user));

    Cookies.set(USER_TOKEN, json.data.access_token);
    Cookies.set(ACCESS_TOKEN_FABRIC, json.data.user.access_token_fabric);
    dispatch(actSignIn(json.data.access_token));
    navigate('/app/invoices-list', { replace: true });
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
              style={{ color: "white" }}
            >
              {
                isLoading
                  ? <CircularProgress size={26} />
                  : 'Sign in now'
              }
            </Button>
          </Box>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
