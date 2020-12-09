import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from './components/GlobalStyles';
import './mixins/chartjs';
import theme from './theme';
import routes from './routes';
// import { messaging } from './firebase';

const App = () => {
  const routing = useRoutes(routes);

  useEffect(() => {
    // messaging.requestPermission().then(() => {
    //   console.log('Have permission');
    //   return messaging.getToken();
    // }).then(token => {
    //   console.log(token);
    // }).catch(error => {
    //   console.log('Error occured');
    // });

    // messaging.onMessage((payload) => {
    //   console.log('onMessage: ' + payload.toString());
    // });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
  );
};

export default App;
