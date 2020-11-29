import React, { useEffect, useState } from 'react';
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
  Modal,
  TableSortLabel,
} from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import ModalAssign from './ModalAssign';
import API from '../../../api/API';
import { INVOICE_ENDPOINT } from '../../../api/endpoint';
import { DELIVERIES_STATUS_ENDPOINT } from '../../../api/endpoint';
import { INVOICE_STATUS, INVOICE_PRIORITY } from '../../../common';
import ModalInvoiceDetail from '../../../components/ModalInvoiceDetail';
import { useSelector, useDispatch } from 'react-redux';
import { actLoadInvoices } from '../../../actions/index';

const columns = [
  { id: 'id', label: 'Id', minWidth: 200, align: 'center' },
  { id: 'code', label: 'Code', minWidth: 200, align: 'center' },
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

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const EnhancedTableHead = (props) => {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((headCell) => (
          <TableCell
            key={headCell.id}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            align={headCell.align}
            style={{ minWidth: headCell.minWidth }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align={"center"} style={{ minWidth: 200 }}>Status</TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  },
  container: {
    maxHeight: 440,
  },
  modal: {
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));

const InvoicesList = ({ ...rest }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  let data = rest.data;
  let totalPage = 0;
  const provider_name = useSelector(state => state.providers.provider_name);
  const keyword = useSelector(state => state.invoice.keyword);
  const [page, setPage] = useState(totalPage);
  const rowsPerPage = 50;
  const [visiableModal, setVisibleModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [visibleModalInvoiceDetail, setVisibleModalInvoiceDetail] = useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState({});
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  useEffect(() => {
    if (data.invoices) {
      totalPage = +data.meta.totalPages;
    }
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = async (event, newPage) => {
    if (provider_name !== 'NONE') {
      const response = await API.get(INVOICE_ENDPOINT + `/providers/${provider_name}?page=${newPage + 1}&limit=50`);
      if (response.ok) {
        const fetchData = await response.json();
        const dataByProvider = { invoices: fetchData.data.items, meta: fetchData.data.meta };
        dispatch(actLoadInvoices(data));
      }
    } else {
      const response = await API.get(INVOICE_ENDPOINT + `?page=${newPage + 1}&limit=50`);
      if (response.ok) {
        const fetchData = await response.json();
        const data = { invoices: fetchData.data.items, meta: fetchData.data.meta };
        dispatch(actLoadInvoices(data));
      }
      setPage(+newPage);
    }
    setPage(+newPage);
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
        return (<img alt="Product" style={{ height: 60, width: 60 }} src={value} />);
      case 'created_at':
        return datetimeUtils.DisplayDateTimeFormat(value);
      default:
        return value;
    }
  };

  const handleClickInvoiceItem = (invoice) => {
    setInvoiceDetail(invoice);
    handleVisibleModalInvoiceDetail();
  };

  // Search if have keyword.
  if (keyword) {
    data.invoices = data.invoices.filter((invoice) => {
      return invoice.code.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
    });
  }

  return (
    <>

      <Card className={clsx(classes.root)} {...rest} >
        <Box>
          <TableContainer className={classes.container}>
            <Table aria-label="sticky table">
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              {data.invoices && data.invoices.length
                ?
                <>
                  <TableBody>
                    {stableSort(data.invoices, getComparator(order, orderBy)).map((invoice, index) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={invoice.id}>
                          {columns.map((column, index) => {
                            const value = _hanleRowTableData(column.id, invoice[column.id]);
                            return (
                              <TableCell
                                key={index}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                                onClick={() => handleClickInvoiceItem(invoice)}
                              >
                                {value}
                              </TableCell>
                            );
                          })}
                          <TableCell key={index} align={"center"} >
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
                </>
                : null
              }
            </Table>
          </TableContainer>
        </Box>
        {data.invoices && data.invoices.length
          ?
          <TablePagination
            rowsPerPageOptions={[0]}
            component="div"
            count={data.meta.totalItems}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
          />
          : null
        }
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
        <div>
          <ModalInvoiceDetail
            invoice={invoiceDetail}
            onCloseModal={handleInvisibleModalInvoiceDetail}
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