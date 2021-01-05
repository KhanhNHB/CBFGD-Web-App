import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from '../../../components/Page';
import Profile from './Profile';
import ProfileDetails from './ProfileDetails';
import API from '../../../api/API';
import { PROFILE_ENDPOINT } from '../../../api/endpoint';
import {
  RESPONSE_STATUS,
  USER_DEVICE_TOKEN,
  USER_TOKEN
} from "../../../common";
import Cookies from 'js-cookie';
import { actLoadProfile } from '../../../actions/index';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  container: {
    display: 'flex',
    width: "100%",
    height: "80%",
    justifyContent: 'center',
    alignItems: 'center',
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    padding: "10px",
  },
}));

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();

  const user = useSelector(state => state.profile.profile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await API.post(`${PROFILE_ENDPOINT}`, {
        "access_token": Cookies.get(USER_TOKEN)
      });
      if (response.status === RESPONSE_STATUS.FORBIDDEN) {
        Cookies.remove(USER_TOKEN);
        Cookies.remove(USER_DEVICE_TOKEN);
        navigate('/', { replace: true });
      }
      if (response.ok) {
        const fetchData = await response.json();
        dispatch(actLoadProfile(fetchData.data));
        setLoading(false);
      }
    }

    fetchProfile();
  }, [dispatch, navigate]);

  return (
    <Page className={classes.root} title="Account">
      {loading
        ? (
          <>
            <div className={classes.container}>
              <CircularProgress />
            </div>
          </>
        )
        : (
          <>
            <Container maxWidth="lg">
              <Grid container spacing={3}>
                <Grid item lg={4} md={6} xs={12}>
                  <Profile user={user} />
                </Grid>
                <Grid item lg={8} md={6} xs={12}>
                  <ProfileDetails user={user} />
                </Grid>
              </Grid>
            </Container>
          </>
        )
      }
    </Page>
  );
};

export default Account;