import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from './components/GlobalStyles';
import './mixins/chartjs';
import theme from './theme';
import routes from './routes';
import { messaging } from './firebase';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { USER_TOKEN, USER_DEVICE_TOKEN, RESPONSE_STATUS, ACCESS_TOKEN_FABRIC } from './common';
import API from './api/API';
import { ADMIN_ENDPOINT, HUB_MANAGER_ENDPOINT, PROFILE_ENDPOINT } from './api/endpoint';

const App = () => {
  const routing = useRoutes(routes);
  const navigate = useNavigate();

  messaging.onMessage(function (payload) {
    console.log("Message received. ", payload);
    // ...
  });

  useEffect(() => {
    const readCookie = async () => {
      const user = Cookies.get(USER_TOKEN);
      if (user) {
        const response = await API.post(`${PROFILE_ENDPOINT}`, {
          "access_token": user
        });

        if (response.status === RESPONSE_STATUS.FORBIDDEN) {
          Cookies.remove(USER_TOKEN);
          Cookies.remove(ACCESS_TOKEN_FABRIC);
          Cookies.remove(USER_DEVICE_TOKEN);
          navigate('/', { replace: true });
        }

        if (response.ok) {
          const fetchData = await response.json();
          const userData = fetchData.data;

          await messaging.requestPermission().then(() => {
            return messaging.getToken();
          }).then(async token => {
            const device_token = Cookies.get(USER_DEVICE_TOKEN);
            if (!device_token) {
              const data = {
                token: token
              }

              if (userData && userData.role === 'Admin') {
                await API.post(`${ADMIN_ENDPOINT}/${userData.id}/token`, data);
              } else if (userData && userData.role === 'Hub_Manager') {
                await API.post(`${HUB_MANAGER_ENDPOINT}/${userData.id}/token`, data);
              }
              Cookies.set(USER_DEVICE_TOKEN, token);
            }
          }).catch(error => {
            console.log('Error occured');
          });
        }
      }
    };
    readCookie();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
  );
};

export default App;
