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
  CircularProgress,
  Snackbar,
} from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import API from '../../../api/API';
import { ADMIN_ENDPOINT, HUB_MANAGER_ENDPOINT, INVOICE_ENDPOINT } from '../../../api/endpoint';
import { INVOICE_PRIORITY, ROLE } from '../../../common';
import ModalInvoiceDetail from '../../../components/ModalInvoiceDetail';
import { useSelector, useDispatch } from 'react-redux';
import { actLoadInvoices } from '../../../actions/index';
import ModalAssignHub from './ModalAssignHub';
import ModalAssignShipper from './ModalAssignShipper';
import Alert from '@material-ui/lab/Alert';

const columns = [
  { id: 'id', label: 'Id', minWidth: 120, align: 'left' },
  { id: 'code', label: 'Code Order', minWidth: 170, align: 'left' },
  { id: 'receiver_name', label: 'Receiver Order', minWidth: 240, align: 'left' },
  { id: 'customer_phone_number', label: 'Customer Phone Number', minWidth: 220, align: 'left' },
  { id: 'receiver_phone_number', label: 'Receiver Phone Number', minWidth: 220, align: 'left' },
  { id: 'address', label: 'Receiver Address', minWidth: 350, align: 'left' },
  { id: 'priority', label: 'Priority', minWidth: 80, align: 'left' },
  { id: 'is_active', label: 'Status Order', minWidth: 170, align: 'left' },
  { id: 'current_delivery_status', label: 'Current Delivery Status', minWidth: 220, align: 'left' },
  // { id: 'out_of_hub', label: 'Out Of Hub', minWidth: 170, align: 'left' },
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
  const { order, orderBy, user, onRequestSort } = props;
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
        {(user && user.roleId === ROLE.HUB_MANAGER)
          ? <TableCell align={"center"} style={{ minWidth: 200 }}>Assign Shipper</TableCell>
          : null
        }
        {(user && user.roleId === ROLE.ADMIN)
          ? <TableCell align={"center"} style={{ minWidth: 200 }}>Assign Hub</TableCell>
          : null
        }
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
    maxHeight: 700,
  },
  modal: {
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiCircularProgress-root': {
      outline: 'none'
    },
  },
}));

const InvoicesList = ({ data, user }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  let totalPage = 0;
  const provider_name = useSelector(state => state.providers.provider_name);
  const keyword = useSelector(state => state.invoice.keyword);
  const [page, setPage] = useState(totalPage);
  const rowsPerPage = 50;
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [visibleModalInvoiceDetail, setVisibleModalInvoiceDetail] = useState(false);
  const [visibleModalAssignHub, setVisibleModalAssignHub] = useState(false);
  const [visibleModalAssignShipper, setVisibleModalAssignShipper] = useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState({});
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [loadingModal, setLoadingModal] = useState(false);
  const [currentHub, setCurrentHub] = useState(null);
  const [currentShipper, setCurrentShipper] = useState(null);
  const selectAssignHubStatus = useSelector(state => state.assignHubStatus.selectAssignHubStatus);
  const selectAssignOrderToShipperStatus = useSelector(state => state.assignOrderToShipperStatus.selectAssignOrderToShipperStatus);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (data.invoices) {
      totalPage = +data.meta.totalPages;
      setPage(0);
    }
  }, [data]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = async (event, newPage) => {
    setLoadingModal(true);
    if (provider_name !== 'NONE') {
      let query = null;
      if (user && user.roleId === ROLE.ADMIN) {
        query = 'hub_id=none';
      } else {
        query = `hub_id=${user.hubId}`
      }
      const response = await API.get(`${INVOICE_ENDPOINT}/providers/${provider_name}?page=${newPage + 1}&limit=50&${query}`);
      if (response.ok) {
        const fetchData = await response.json();
        const dataByProvider = {
          invoices: fetchData.data.items,
          meta: fetchData.data.meta
        };
        dispatch(actLoadInvoices(dataByProvider));
        setPage(+newPage);
      }
    } else {
      let query = null;
      if (user && user.roleId === ROLE.ADMIN) {
        query = 'hub_id=none';
      } else {
        query = `hub_id=${user.hubId}`
      }
      const response = await API.get(`${INVOICE_ENDPOINT}?page=${newPage + 1}&limit=50&${query}`);
      if (response.ok) {
        const fetchData = await response.json();
        const data = {
          invoices: fetchData.data.items,
          meta: fetchData.data.meta
        };
        dispatch(actLoadInvoices(data));
        setPage(+newPage);
      }
    }
    setPage(+newPage);
    setLoadingModal(false);
  };

  const handleSelectedRowForAssignShipper = (invoiceId, shipperId) => {
    setSelectedInvoice(invoiceId);
    setCurrentShipper(shipperId);
    setVisibleModalAssignShipper(true);
  }

  const handleSelectedRowForAssignHub = (invoiceId, hubId) => {
    setSelectedInvoice(invoiceId);
    setCurrentHub(hubId);
    setVisibleModalAssignHub(true);
  }

  const handleVisibleModalAssignHub = () => {
    setVisibleModalAssignHub(true);
  };

  const handleInvisibleModalAssignHub = () => {
    setVisibleModalAssignHub(false);
  };

  const handleVisibleModalAssignShipper = () => {
    setVisibleModalAssignShipper(true);
  };

  const handleInvisibleModalAssignShipper = () => {
    setVisibleModalAssignShipper(false);
  };

  const handleVisibleModalInvoiceDetail = () => {
    setVisibleModalInvoiceDetail(true);
  };

  const handleInvisibleModalInvoiceDetail = () => {
    setVisibleModalInvoiceDetail(false);
  };

  const handleAssignShipper = async (shipper_id) => {
    setLoadingModal(true);
    const dataBody = {
      order_id: selectedInvoice,
      shipper_id: shipper_id
    };
    const response = await API.patch(`${HUB_MANAGER_ENDPOINT}/${user.phone}/assign-shipper`, dataBody);
    if (response.ok) {
      setMessage(`Assign Order ${selectedInvoice} for Shipper ${shipper_id} success`);
      setOpenSnackbar(true);
      if (provider_name !== 'NONE') {
        const query = `hub_id=${user.hubId}`;
        const response = await API.get(`${INVOICE_ENDPOINT}/providers/${provider_name}?page=${page + 1}&limit=50&${query}`);
        if (response.ok) {
          const fetchData = await response.json();
          const dataByProvider = { invoices: fetchData.data.items, meta: fetchData.data.meta };
          dispatch(actLoadInvoices(dataByProvider));
          setPage(+page);
        }
        setLoadingModal(false);
      } else {
        const query = `hub_id=${user.hubId}`;
        const response = await API.get(`${INVOICE_ENDPOINT}?page=${page + 1}&limit=50&${query}`);
        if (response.ok) {
          const fetchData = await response.json();
          const data = { invoices: fetchData.data.items, meta: fetchData.data.meta };
          dispatch(actLoadInvoices(data));
          setPage(+page);
        }
        setLoadingModal(false);
      }
      setPage(+page);
    }
    const json = await response.json();

    setLoadingModal(false);

    const message = json.message;
    if (message) {
      alert(message);
      return;
    }

    let cloneRestData = data;
    for (let i = 0; i < cloneRestData.invoices.length; i++) {
      const element = cloneRestData.invoices[i];
      if (element.id === selectedInvoice) {
        element.is_assign = true;
        break;
      }
    }
    data = cloneRestData;
    setSelectedInvoice(null);
    handleInvisibleModalAssignShipper();
  };

  const _rowStatus = (backgroundColor, value) => {
    return (
      <div style={{
        backgroundColor: backgroundColor,
        color: 'white',
        width: 85,
        padding: 8,
        borderRadius: 3,
        textAlign: 'center',
      }}>
        {value ? 'ACTIVE' : 'DEACTIVE'}
      </div>
    );
  }

  const _rowOutOfHub = (backgroundColor, value) => {
    return (
      <div style={{
        backgroundColor: backgroundColor,
        color: 'white',
        width: 85,
        padding: 8,
        borderRadius: 3,
        textAlign: 'center',
      }}>
        {value ? 'OUT HUB' : 'IN HUB'}
      </div>
    );
  }

  const _rowPriority = (backgroundColor, value) => {
    return (<div style={{
      backgroundColor: backgroundColor,
      color: 'white',
      width: 90,
      padding: 8,
      borderRadius: 3,
      textAlign: 'center',
    }}>
      {value ? INVOICE_PRIORITY.EXPRESS : INVOICE_PRIORITY.STANDARD}
    </div>);
  }

  const _hanleRowTableData = (column, value) => {
    switch (column) {
      case 'priority':
        return (value ? _rowPriority("#d9534f", value) : _rowPriority("#1e8101", value));
      case 'from_date':
        return datetimeUtils.DisplayDateTimeFormat(new Date(value));
      case 'to_date':
        return datetimeUtils.DisplayDateTimeFormat(new Date(value));
      case 'total_amount':
        return formatPrice.format(value) + " VND";
      case 'shipping_fee':
        return formatPrice.format(value) + " VND";
      case 'is_active':
        return (value ? _rowStatus("#1e8101", value) : _rowStatus("#d9534f", value));
      case 'product_image':
        return (<img alt="Product" style={{ height: 60, width: 60 }} src={value} />);
      case 'created_at':
        return datetimeUtils.DisplayDateTimeFormat(value);
      case 'current_delivery_status':
        return (
          <div style={{
            width: 120,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00aff0',
            color: 'white',
            height: 36,
            borderRadius: 3,
            fontWeight: 'bold'
          }}>
            {value}
          </div>
        );
      case 'out_of_hub':
        return (value ? _rowOutOfHub("#d9534f", value) : _rowOutOfHub("#1e8101", value));
      default:
        return value;
    }
  };

  const handleClickInvoiceItem = (invoice) => {
    setInvoiceDetail(invoice);
    handleVisibleModalInvoiceDetail();
  };

  const handleAssignHub = async (hub_id) => {
    setLoadingModal(true);
    const data = {
      order_id: selectedInvoice,
      hub_id: +hub_id
    };

    await API.patch(`${ADMIN_ENDPOINT}/${user.phone}/assign-order-to-hub`, data)
      .then(async res => {
        if (res.ok) {
          setMessage(`Assign Order ${selectedInvoice} for Hub ${hub_id} success`);
          setOpenSnackbar(true);
          if (provider_name !== 'NONE') {
            let query = null;
            if (user && user.roleId === ROLE.ADMIN) {
              query = 'hub_id=none';
            } else {
              query = `hub_id = ${user.hubId} `
            }
            const response = await API.get(`${INVOICE_ENDPOINT}/providers/${provider_name}?page=${page + 1}&limit=50&${query}`);
            if (response.ok) {
              const fetchData = await response.json();
              const dataByProvider = { invoices: fetchData.data.items, meta: fetchData.data.meta };
              dispatch(actLoadInvoices(dataByProvider));
              setPage(+page);
            }
            setLoadingModal(false);
          } else {
            let query = null;
            if (user && user.roleId === ROLE.ADMIN) {
              query = 'hub_id=none';
            } else {
              query = `hub_id = ${user.hubId} `
            }
            const response = await API.get(`${INVOICE_ENDPOINT}?page=${page + 1}&limit=50&${query}`);
            if (response.ok) {
              const fetchData = await response.json();
              const data = { invoices: fetchData.data.items, meta: fetchData.data.meta };
              dispatch(actLoadInvoices(data));
              setPage(+page);
            }
            setLoadingModal(false);
          }
          setPage(+page);
        }
      });

    setSelectedInvoice(null);
    handleInvisibleModalAssignHub();
  };

  // Search if have keyword.
  let filterData = data.invoices;
  if (keyword) {
    filterData = filterData.filter((invoice) => {
      return invoice.code.toLowerCase().indexOf(keyword.trim().toLowerCase()) !== -1;
    });
  }

  if (selectAssignHubStatus === 'NOT ASSIGN') {
    filterData = filterData.filter((invoice) => {
      return invoice.hub === null;
    });
  } else if (selectAssignHubStatus === 'ASSIGNED') {
    filterData = filterData.filter((invoice) => {
      return invoice.hub !== null;
    });
  }

  if (selectAssignOrderToShipperStatus === 'NOT ASSIGN') {
    filterData = filterData.filter((invoice) => {
      return invoice.is_assign === false;
    });
  } else if (selectAssignOrderToShipperStatus === 'ASSIGNED') {
    filterData = filterData.filter((invoice) => {
      return invoice.is_assign === true;
    });
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <Card className={clsx(classes.root)}>
        <Box>
          <TableContainer className={classes.container}>
            <Table aria-label="sticky table">
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                user={user}
                onRequestSort={handleRequestSort}
              />
              {filterData && filterData.length
                ?
                <>
                  <TableBody>
                    {stableSort(filterData, getComparator(order, orderBy)).map((invoice, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={invoice.id}
                          style={{ backgroundColor: invoice.is_assign && 'whitesmoke' }}
                        >
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
                          {(user && user.roleId === ROLE.ADMIN)
                            ?
                            <TableCell key={index} align={"center"} >
                              <Button
                                color="primary"
                                variant="contained"
                                onClick={() => handleSelectedRowForAssignHub(invoice.id, invoice.hub ? invoice.hub.id : null)}
                                style={invoice.is_assign
                                  ? {
                                    backgroundColor: (invoice.available && invoice.is_active && !invoice.is_invalid_address)
                                      ? (invoice.current_delivery_status === 'IN_WAREHOUSE' || invoice.current_delivery_status === 'FAIL_1' || invoice.current_delivery_status === 'FAIL_2') ? '#E69403' : '#aeb0b6'
                                      : '#aeb0b6',
                                    color: 'white'
                                  }
                                  : { color: 'white' }
                                }
                                disabled={
                                  (invoice.available && invoice.is_active && !invoice.is_invalid_address)
                                    ? (invoice.current_delivery_status === 'IN_WAREHOUSE' || invoice.current_delivery_status === 'FAIL_1' || invoice.current_delivery_status === 'FAIL_2') ? false : true
                                    : true
                                }
                              >
                                {invoice.hub ? 'Assigned' : 'Assign'}
                              </Button>
                            </TableCell>
                            : null
                          }
                          {(user && user.roleId === ROLE.HUB_MANAGER)
                            ? (
                              <TableCell key={index} align={"center"} >
                                <Button
                                  color="primary"
                                  variant="contained"
                                  onClick={() => handleSelectedRowForAssignShipper(invoice.id, invoice.shipper_id ? invoice.shipper_id : null)}
                                  style={invoice.is_assign
                                    ? {
                                      backgroundColor: (invoice.available && invoice.is_active && !invoice.is_invalid_address)
                                        ? (invoice.current_delivery_status === 'IN_WAREHOUSE' || invoice.current_delivery_status === 'FAIL_1' || invoice.current_delivery_status === 'FAIL_2') ? '#E69403' : '#aeb0b6'
                                        : '#aeb0b6',
                                      color: 'white'
                                    }
                                    : { color: 'white' }
                                  }
                                  disabled={
                                    (invoice.available && invoice.is_active && !invoice.is_invalid_address)
                                      ? (invoice.current_delivery_status === 'IN_WAREHOUSE' || invoice.current_delivery_status === 'FAIL_1' || invoice.current_delivery_status === 'FAIL_2') ? false : true
                                      : true
                                  }
                                >
                                  {invoice.is_assign ? 'Assigned' : 'Assign'}
                                </Button>
                              </TableCell>
                            )
                            : null
                          }
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
        {filterData && filterData.length
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
      <Modal open={visibleModalAssignHub}>
        <div className={classes.modal}>
          <ModalAssignHub
            onInvisibleModel={handleInvisibleModalAssignHub}
            onVisibleModal={handleVisibleModalAssignHub}
            onHandleAssign={handleAssignHub}
            onSelectedInvoice={selectedInvoice}
            onCurrentHub={currentHub}
          />
        </div>
      </Modal>
      <Modal open={visibleModalAssignShipper}>
        <div className={classes.modal}>
          <ModalAssignShipper
            onInvisibleModel={handleInvisibleModalAssignShipper}
            onVisibleModal={handleVisibleModalAssignShipper}
            onHandleAssign={handleAssignShipper}
            user={user}
            onCurrentShipper={currentShipper}
          />
        </div>
      </Modal>
      <Modal open={visibleModalInvoiceDetail} style={{
        overflowX: 'auto'
      }}>
        <ModalInvoiceDetail
          invoice={invoiceDetail}
          onCloseModal={handleInvisibleModalInvoiceDetail}
        />
      </Modal>
      <Modal open={loadingModal} className={classes.loadingModal}>
        <CircularProgress />
      </Modal>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={`Import Sucess!`}
      >
        <Alert onClose={handleCloseSnackbar} severity='success'>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

InvoicesList.propTypes = {
  className: PropTypes.string,
  invoices: PropTypes.array.isRequired
};

export default InvoicesList;