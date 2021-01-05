import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  makeStyles,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
} from '@material-ui/core';
import Page from '../../components/Page';
import API from '../../api/API';
import {
  LOGIN_ENDPOINT,
  PROFILE_ENDPOINT,
  ADMIN_ENDPOINT,
  HUB_MANAGER_ENDPOINT
} from '../../api/endpoint';
import { useDispatch } from 'react-redux';
import { actLoadProfile, actSignIn } from '../../actions';
import Cookies from 'js-cookie';
import { ROLE, USER_DEVICE_TOKEN, USER_TOKEN } from '../../common';
import { messaging } from '../../init-fcm';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  formControl: {
    width: '100%'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
  }, [dispatch, navigate]);

  const signIn = async (username, password, role) => {
    if (!username) {
      alert('Please input phone number');
      return;
    }
    if (!username) {
      alert('Please input password');
      return;
    }
    if (!role) {
      alert('Please select role');
      return;
    }

    setIsLoading(true);

    const dataBody = {
      phone: username,
      password: password,
      role: +role
    };

    const response = await API.post(LOGIN_ENDPOINT, dataBody);
    const json = await response.json();

    if (json.message) {
      setIsLoading(false);
      alert(json.message);
      return;
    }

    const initPermission = async () => {
      messaging.requestPermission()
        .then(async function () {
          const token = await messaging.getToken();
          if (token) {
            const data = {
              token: token
            };

            const userData = json.data;
            if (userData.user && userData.user.roleId === ROLE.ADMIN) {
              await API.post(`${ADMIN_ENDPOINT}/${userData.user.id}/token`, data);
            } else if (userData.user && userData.user.roleId === ROLE.HUB_MANAGER) {
              await API.post(`${HUB_MANAGER_ENDPOINT}/${userData.user.id}/token`, data);
            }
            Cookies.set(USER_DEVICE_TOKEN, token);
          }
        })
        .catch(function (err) {
          console.log("Unable to get permission to notify.", err);
        });
    }

    initPermission();

    dispatch(actLoadProfile(json.data.user));
    setIsLoading(false);

    Cookies.set(USER_TOKEN, json.data.access_token);
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
            placeholder="Phone number"
            fullWidth
            margin="normal"
            name="username"
            onChange={event => {
              const { value } = event.target;
              setUsername(value);
            }}
            style={{
              backgroundColor: 'white',
              border: 'hidden'
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
            style={{
              backgroundColor: 'white',
              border: 'hidden'
            }}
            type="password"
            value={password}
            variant="outlined"
          />
          <FormControl
            variant="outlined"
            className={classes.formControl}
            fullWidth
            margin="normal"
            style={{
              backgroundColor: 'white',
              border: 'hidden'
            }}
          >
            <InputLabel htmlFor="outlined-role-native-simple">Role</InputLabel>
            <Select
              native
              value={role}
              onChange={event => {
                const { value } = event.target;
                setRole(value);
              }}
              label="Role"
              inputProps={{
                name: 'role',
                id: 'outlined-role-native-simple',
              }}
            >
              <option aria-label="Select Role" value="" />
              <option value={1}>Administrator</option>
              <option value={2}>Hub Manager</option>
            </Select>
          </FormControl>
          <Box my={2}>
            <Button
              disabled={isLoading}
              color="primary"
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={() => signIn(username, password, role)}
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
