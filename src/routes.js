import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout/index';
import MainLayout from './layouts/MainLayout/index';
import AccountView from './views/account/AccountView/index';
import ShipperListView from './views/shipper/ShipperListView/index';
import DashboardView from './views/reports/DashboardView/index';
import LoginView from './views/auth/LoginView';
import Invoices from './views/invoice/InvoicesListView/index';
import RegisterView from './views/auth/RegisterView';
import ShippingArea from './views/shippingarea';


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
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'invoices-list', element: <Invoices /> },
    ]
  },
  {
    path: '/',
    exact: true,
    element: <MainLayout />,
    // eslint-disable-next-line
    element: <LoginView />,
    children: [
      { path: '/', element: <MainLayout /> },
      { path: 'register', element: <RegisterView /> },
      { path: '/', element: <Navigate to="/app/invoices-list" /> },
    ]
  }
];

export default routes;
