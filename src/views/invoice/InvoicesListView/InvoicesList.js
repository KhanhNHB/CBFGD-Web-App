import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
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
  CircularProgress
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const InvoicesList = ({ onReload, className, invoices, ...rest }) => {
  const classes = useStyles();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  return (<Card
    className={clsx(classes.root, className)}
    {...rest}
  >
    <Button onClick={() => onReload()} color="primary">
      Load
        </Button>
    <PerfectScrollbar>
      <Box minWidth={1050}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>
                Receiver
                </TableCell>
              <TableCell>
                Address
                </TableCell>
              <TableCell>
                Phone Number
                </TableCell>
              <TableCell>
                Priority
                </TableCell>
              <TableCell>
                Shipping Fee
                </TableCell>
              <TableCell>
                Total Amount
                </TableCell>
              <TableCell>
                Total Price
                </TableCell>
              <TableCell>
                From Date
                </TableCell>
              <TableCell>
                To Date
                </TableCell>
              <TableCell>
                Note
                </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow
                hover
                key={invoice.id}
              >
                <TableCell>
                  {invoice.receiver}
                </TableCell>
                <TableCell>
                  {invoice.address}
                </TableCell>
                <TableCell>
                  {invoice.phone_number}
                </TableCell>
                <TableCell>
                  {invoice.priority ? 'Express' : 'Standard'}
                </TableCell>
                <TableCell>
                  {invoice.shipping_fee}
                </TableCell>
                <TableCell>
                  {invoice.total_amount}
                </TableCell>
                <TableCell>
                  {invoice.total_price}
                </TableCell>
                <TableCell>
                  {invoice.from_date}
                </TableCell>
                <TableCell>
                  {invoice.to_date}
                </TableCell>
                <TableCell>
                  {invoice.note}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </PerfectScrollbar>
    <TablePagination
      component="div"
      // count={customers.length}
      // onChangePage={handlePageChange}
      // onChangeRowsPerPage={handleLimitChange}
      page={page}
      rowsPerPage={limit}
      rowsPerPageOptions={[5, 10, 25]}
    />
  </Card>
  );
};

InvoicesList.propTypes = {
  className: PropTypes.string,
  invoices: PropTypes.array.isRequired
};

export default InvoicesList;
