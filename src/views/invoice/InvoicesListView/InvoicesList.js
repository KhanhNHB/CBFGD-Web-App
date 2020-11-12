import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import datetimeUtils from '../../../utils/datetimeUtils';
import formatPrice from '../../../utils/formatPrice';
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
import API from '../../../api/API';
import { DELIVERIES_STATUS_ENDPOINT } from '../../../api/endpoint';
import { INVOICE_STATUS, INVOICE_PRIORITY } from '../../../common';
import ModalInvoiceDetail from '../../../components/ModalInvoiceDetail';

const columns = [
  { id: 'id', label: 'Code', minWidth: 200, align: 'center' },
  { id: 'receiver_name', label: 'Receiver', minWidth: 200, align: 'center' },
  { id: 'address', label: 'Address', minWidth: 500, align: 'center' },
  { id: 'customer_phone_number', label: 'Customer Phone Number', minWidth: 200, align: 'center' },
  { id: 'receiver_phone_number', label: 'Receiver Phone Number', minWidth: 200, align: 'center' },
  { id: 'priority', label: 'Priority', minWidth: 170, align: 'center' },
  { id: 'note', label: 'Note', minWidth: 200, align: 'center' },
  { id: 'product_name', label: 'Product Name', minWidth: 200, align: 'center' },
  { id: 'product_image', label: 'Phoduct Image', minWidth: 200, align: 'center' },
  { id: 'status', label: 'Available', minWidth: 200, align: 'center' },
  { id: 'total_amount', label: 'Total Amount', minWidth: 170, align: 'center' },
  { id: 'quantity', label: 'Quantity', minWidth: 170, align: 'center' },
  { id: 'shipping_fee', label: 'Shipping Fee', minWidth: 170, align: 'center' },
  { id: 'from_date', label: 'From Date', minWidth: 200, align: 'center' },
  { id: 'to_date', label: 'To Date', minWidth: 200, align: 'center' },
  { id: 'created_at', label: 'Created At', minWidth: 200, align: 'center' },
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
    height: '20%',
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
  const [visibleModalInvoiceDetail, setVisibleModalInvoiceDetail] = useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState({});
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



  const handleVisibleModalInvoiceDetail = () => {
    setVisibleModalInvoiceDetail(true);
  };

  const handleInvisibleModalInvoiceDetail = () => {
    setVisibleModalInvoiceDetail(false);
  };





  const handleAssignInvoice = async (shipper_id) => {
    const data = {
      shipper_id: shipper_id,
      invoice_id: selectedInvoice
    };

    const response = await API.post(DELIVERIES_STATUS_ENDPOINT, data);
    const json = await response.json();

    const message = json.message;
    if (message) {
      alert(message);
      return;
    }

    onReload();
    setSelectedInvoice(null);
    handleInvisibleModal();
  };

  const _hanleRowTableData = (column, value) => {
    switch (column) {
      case 'priority':
        return value ? INVOICE_PRIORITY.EXPRESS : INVOICE_PRIORITY.STANDARD;
      case 'from_date':
        return datetimeUtils.DisplayDateTimeFormat(new Date(value));
      case 'to_date':
        return datetimeUtils.DisplayDateTimeFormat(new Date(value));
      case 'total_amount':
        return formatPrice.format(value) + " VND";
      case 'shipping_fee':
        return formatPrice.format(value) + " VND";
      case 'status':
        return value ? INVOICE_STATUS.ACTIVE : INVOICE_STATUS.DEACTIVE;
      case 'product_image':
        return (<img alt="Product Image" style={{ height: 60, width: 60 }} src={value} />);
      case 'created_at':
        return datetimeUtils.DisplayDateTimeFormat(new Date(value));
      default:
        return value;
    }
  };


  const handleClickInvoiceItem = (invoice) =>{
   setInvoiceDetail(invoice);
   handleVisibleModalInvoiceDetail();
  };


  return (
    <>
      <Card className={clsx(classes.root, className)} {...rest} >
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
                  <TableCell align={"center"} style={{ minWidth: 200 }}>
                    Status
                </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((invoice) => {
                  return (

                    <TableRow hover role="checkbox" tabIndex={-1} key={invoice.id} onClick={()=> handleClickInvoiceItem(invoice)}>
                      {columns.map((column) => {
                        const value = _hanleRowTableData(column.id, invoice[column.id]);
                        return (
                          <TableCell align={column.align}>
                            {value}
                          </TableCell>
                        );
                      })}
                      <TableCell align={"center"}>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => handleSelectedRow(invoice.id)}
                          style={{ color: 'white' }}
                          disabled={invoice.is_assign ? true : false}
                        >
                          {invoice.is_assign ? 'Assigned' : 'Assign'}
                        </Button>
                      </TableCell>
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
      <Modal open={visibleModalInvoiceDetail}>
             <ModalInvoiceDetail
             invoice={invoiceDetail}
             closeModal={handleInvisibleModalInvoiceDetail}   
             />
               
      </Modal>
    </>
  );
};

InvoicesList.propTypes = {
  className: PropTypes.string,
  invoices: PropTypes.array.isRequired
};

export default InvoicesList;
