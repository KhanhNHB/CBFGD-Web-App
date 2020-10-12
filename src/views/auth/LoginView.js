import React,{useState} from 'react';
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
import {LOGIN_ENDPOINT} from '../../api/endpoint';
import {useDispatch} from 'react-redux';
import {actSignIn} from '../../actions';
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
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const signIn = (username, password) => {
      API.post(LOGIN_ENDPOINT, {
        username: username,
        password: password,
      })
        .then(async response=>{
          console.log(response)
          if(response.ok){
            const fetchData = await response.json();
            dispatch(actSignIn(fetchData.userToken));
            navigate('/app/dashboard', { replace: true });
          }
        });
  }

  return (
    <Page className={classes.root} title="Login">
      <Box display="flex" flexDirection="column" height="100%" justifyContent="center">
        <Container maxWidth="sm">
                <Box mb={2}>
                  <img style={{height: 200, width: 200, marginLeft: 170}} src={require("../../images/logo_gds.png")}/>
                </Box>
                <TextField
                  placeholder="Email Address"
                  fullWidth
                  margin="normal"
                  name="username"
                  onChange={() => setUsername()}
                  type="email"
                  value={username}
                  variant="outlined"
                />
                <TextField
                  placeholder="Password"
                  fullWidth
                  margin="normal"
                  name="password"
                  onChange={() => setPassword()}
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
                    onClick={() => signIn(username,password)}
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
