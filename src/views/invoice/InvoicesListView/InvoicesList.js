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
  Modal
} from '@material-ui/core';

import TableContainer from '@material-ui/core/TableContainer';
import ModalAssign from './ModalAssign';

const columns = [
  { id: 'id', label: 'Code', minWidth: 200, align: 'center' },
  { id: 'status', label: 'Status', minWidth: 200, align: 'center' },
  { id: 'receiver', label: 'Receiver', minWidth: 200, align: 'center' },
  { id: 'address', label: 'Address', minWidth: 170, align: 'center' },
  { id: 'phone_number', label: 'Phone', minWidth: 170, align: 'center' },
  { id: 'priority', label: 'Priority', minWidth: 170, align: 'center' },
  { id: 'shipping_fee', label: 'Shipping Fee', minWidth: 170, align: 'center' },
  { id: 'total_amount', label: 'Total Amount', minWidth: 120, align: 'center' },
  { id: 'total_price', label: 'Total Price', minWidth: 170, align: 'center' },
  { id: 'from_date', label: 'From Date', minWidth: 200, align: 'center' },
  { id: 'to_date', label: 'To Date', minWidth: 200, align: 'center' },
  { id: 'note', label: 'Note', minWidth: 200, align: 'center' },
];

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  },
  container: {
    maxHeight: 440,
  },
  modal: {
    width: '40%',
    height: '40%',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '10px',
  }
}));

const InvoicesList = ({ onReload, className, invoices, ...rest }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visiableModal, setVisibleModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelectedRow = (invoiceId) => {
    setSelectedInvoice(invoiceId);
    setVisibleModal(true);
  }

  const handleVisibleModal = () => {
    setVisibleModal(true);
  };

  const handleInvisibleModal = () => {
    setVisibleModal(false);
  };

  const handleAssignInvoice = (shipperId) => {
    console.log(shipperId);
    console.log(selectedInvoice);
    handleInvisibleModal();
  };

  return (
    <>
      <Card className={clsx(classes.root, className)} {...rest} >
        <Box>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align={"center"} style={{ minWidth: 200 }}>
                    Assign
                </TableCell>
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
                    <TableRow hover role="checkbox" tabIndex={-1} key={invoice.id} >
                      <TableCell align={"center"}>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => handleSelectedRow(invoice.id)}
                          style={{ color: 'white' }}
                        >
                          Assign
                        </Button>
                      </TableCell>
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
      <Modal open={visiableModal}>
        <div className={classes.modal}>
          <ModalAssign
            onInvisibleModel={handleInvisibleModal}
            onVisibleModal={handleVisibleModal}
            onHandleAssign={handleAssignInvoice}
          />
        </div>
      </Modal>
    </>
  );
};

InvoicesList.propTypes = {
  className: PropTypes.string,
  invoices: PropTypes.array.isRequired
};

export default InvoicesList;
