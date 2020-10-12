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


const routes = [
  {
    path: 'app',
    // element: <LoginView/>,
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <AccountView /> },
      { path: 'shipper', element: <ShipperListView /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'invoices-list', element: <Invoices /> },
    ]
  },
  {
    path: '/',
    exact: true,
    element: <MainLayout />,
      // element: <LoginView/>,
      children: [
      { path: '/', element: <MainLayout /> },
      { path: 'register', element: <RegisterView /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
    ]
  }
];

export default routes;
