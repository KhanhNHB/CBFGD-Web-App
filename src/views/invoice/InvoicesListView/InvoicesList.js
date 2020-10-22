import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import datetimeUtils from '../../../utils/datetimeUtils';

import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  makeStyles,
  Button,
} from '@material-ui/core';

import TableContainer from '@material-ui/core/TableContainer';

const columns = [
  { id: 'id', label: 'Code', minWidth: 200, align: 'left' },
  { id: 'receiver', label: 'Receiver', minWidth: 200, align: 'left' },
  { id: 'address', label: 'Address', minWidth: 170, align: 'left' },
  { id: 'phone_number', label: 'Phone', minWidth: 170, align: 'left' },
  { id: 'priority', label: 'Priority', minWidth: 170, align: 'left' },
  { id: 'shipping_fee', label: 'Shipping Fee', minWidth: 170, align: 'left' },
  { id: 'total_amount', label: 'Total Amount', minWidth: 120, align: 'left' },
  { id: 'total_price', label: 'Total Price', minWidth: 170, align: 'left' },
  { id: 'from_date', label: 'From Date', minWidth: 200, align: 'left' },
  { id: 'to_date', label: 'To Date', minWidth: 200, align: 'left' },
  { id: 'note', label: 'Note', minWidth: 200, align: 'left' },
];

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  },
  container: {
    maxHeight: 440,
  }
}));

const InvoicesList = ({ onReload, className, invoices, ...rest }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest} >
      <Button onClick={() => onReload()} color="primary">Refresh</Button>
      <Box>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((invoice) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={invoice.id}>
                    {columns.map((column) => {
                      let value = invoice[column.id];

                      if (column.id === 'priority') {
                        value = !value ? 'Standard' : 'Express';
                      }

                      if (column.id === 'from_date') {
                        value = datetimeUtils.DisplayDateTimeFormat(new Date(value));
                      }

                      if (column.id === 'to_date') {
                        value = datetimeUtils.DisplayDateTimeFormat(new Date(value));
                      }
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={invoices.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Card>
  );
};

InvoicesList.propTypes = {
  className: PropTypes.string,
  invoices: PropTypes.array.isRequired
};

export default InvoicesList;
