import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout/index';
import AccountView from './views/account/AccountView/index';
import ShipperListView from './views/shipper/ShipperListView/index';
import LoginView from './views/auth/LoginView';
import Invoices from './views/invoice/InvoicesListView/index';
import ShippingArea from './views/hub';
import HubManager from './views/hub_manager';

const routes = [
  {
    path: 'app',
    element: <LoginView />,
    // eslint-disable-next-line
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <AccountView /> },
      { path: 'shipper', element: <ShipperListView /> },
      { path: 'shipping-area', element: <ShippingArea /> },
      { path: 'invoices-list', element: <Invoices /> },
      { path: 'hub-manager', element: <HubManager /> },
    ]
  },
  {
    path: '/',
    exact: true,
    element: <LoginView />,
    children: [
      { path: '/', element: <Navigate to="/app/invoices-list" /> },
    ]
  },
];

export default routes;
