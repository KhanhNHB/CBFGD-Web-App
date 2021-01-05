import React, { useState, useEffect } from 'react';
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
  Modal,
  TableSortLabel,
  CircularProgress,
  Snackbar
} from '@material-ui/core';

import API from '../../../api/API';
import ModalAssign from './ModalAssign';
import { useDispatch } from 'react-redux';
import {
  RESPONSE_STATUS,
  ROLE,
  STATUS,
  USER_DEVICE_TOKEN,
  USER_TOKEN
} from '../../../common/index';
import { actLoadShipper } from '../../../actions';
import TableContainer from '@material-ui/core/TableContainer';
import ModalShipperAdd from '../../../components/ModalShipperAdd';
import { ADMIN_ENDPOINT, SHIPPER_ENDPOINT } from '../../../api/endpoint';
import ModalShipperDetail from '../../../components/ModalShipperDetail';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';

const columns = [
  { id: 'avatar', label: 'Avatar', minWidth: 120, align: 'left' },
  { id: 'last_name', label: 'Last name', minWidth: 200, align: 'left' },
  { id: 'first_name', label: 'First name', minWidth: 200, align: 'left' },
  { id: 'phone', label: 'Phone', minWidth: 200, align: 'left' },
  { id: 'is_active', label: 'Status', minWidth: 120, align: 'left' },
];

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
        <TableCell align={"left"} style={{ minWidth: 200 }}>Hub</TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {},
  boundary: {
    display: 'flex',
    flexDirection: 'column',
  },
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

const ShipperList = ({ className, data, user, ...rest }) => {
  let totalPage = 0;
  const rowsPerPage = 50;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [page, setPage] = useState(totalPage);
  const [order, setOrder] = useState('asc');
  const [shipper, setShipper] = useState({});
  const [orderBy, setOrderBy] = useState('id');
  const [currentHub, setCurrentHub] = useState(null);
  const [modalOpenAdd, setModalOpenAdd] = useState(false);
  const [visiableModal, setVisibleModal] = useState(false);
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [visibleModalShipperDetail, setVisibleModalShipperDetail] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (data.shippers) {
      totalPage = +data.meta.totalPages;
      setPage(0);
    }
  }, [data]);

  const openModalFormAdd = () => {
    setModalOpenAdd(true);
  }

  const onCloseModalAdd = async (isChanged) => {
    if (isChanged) {
      const response = await API.get(`${SHIPPER_ENDPOINT}?page=1&limit=50&hub_manager_phone=none`);
      if (response.ok) {
        const fetchData = await response.json();
        const data = { shippers: fetchData.data.items, meta: fetchData.data.meta };
        setMessageSuccess("Create Shipper Sucess!");
        setOpenSnackbar(true);
        dispatch(actLoadShipper(data));
      }
      if (response.status === RESPONSE_STATUS.FORBIDDEN) {
        Cookies.remove(USER_TOKEN);
        Cookies.remove(USER_DEVICE_TOKEN);
        navigate('/', { replace: true });
      }
    }
    setModalOpenAdd(false);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelectedRow = (shipperPhone, shipperHub) => {
    setSelectedShipper(shipperPhone);
    setCurrentHub(shipperHub);
    setVisibleModal(true);
  }

  const handleVisibleModal = () => {
    setVisibleModal(true);
  };

  const handleInvisibleModal = () => {
    setVisibleModal(false);
  };

  const handleVisibleModalShipperDetail = () => {
    setVisibleModalShipperDetail(true);
  };

  const handleInvisibleModalShipperDetail = () => {
    setVisibleModalShipperDetail(false);
  };

  // For Admin assign shipper to hub
  const handleAssignHub = async (hub_id) => {
    setLoadingModal(true);
    const data = {
      shipper_phone: selectedShipper,
      hub_id: hub_id
    };

    const response = await API.patch(`${ADMIN_ENDPOINT}/${user.phone}/assign-shipper-to-hub`, data);
    if (response.ok) {
      const repsonseShipper = await API.get(`${SHIPPER_ENDPOINT}?page=1&limit=50&hub_manager_phone=none`);
      if (repsonseShipper.ok) {
        const fetchData = await repsonseShipper.json();
        const data = { shippers: fetchData.data.items, meta: fetchData.data.meta };
        setMessageSuccess(`Assign Shipper ${selectedShipper} To Hub ${hub_id} Sucess!`);
        setOpenSnackbar(true);
        dispatch(actLoadShipper(data));
      }
    } else {
      const patchData = await response.json();
      if (patchData.message) {
        alert(patchData.message);
      }
    }
    setSelectedShipper(null);
    handleInvisibleModal();
    setLoadingModal(false);
  };

  const _rowStatus = (backgroundColor, value) => {
    return (<div style={{
      backgroundColor: backgroundColor,
      color: 'white',
      width: 105,
      padding: 8,
      borderRadius: 3,
      textAlign: 'center'

    }}>
      {value ? 'ACTIVE' : 'DEACTIVE'}
    </div>);
  }

  const _hanleRowTableData = (column, value) => {
    switch (column) {
      case 'is_active':
        return (value
          ? _rowStatus("#1e8101", value)
          : _rowStatus("#f0ad4f", value));
      case 'avatar':
        return (<img alt="User Avatar" style={{ height: 45, width: 60 }} src={value
          ? value
          : 'https://res.cloudinary.com/dvehkdedj/image/upload/v1598777976/269-2697881_computer-icons-user-clip-art-transparent-png-icon_yqpi0g.png'} />
        );
      case 'created_at':
        return datetimeUtils.DisplayDateTimeFormat(value);
      case 'updated_at':
        return value ? datetimeUtils.DisplayDateTimeFormat(value) : '';
      default:
        return value;
    }
  };

  const handleClickShipperItem = (shipper) => {
    setShipper(shipper);
    handleVisibleModalShipperDetail();
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className={classes.boundary}>
      <div style={{ marginBottom: 10 }}>
        {
          (user && user.roleId === ROLE.ADMIN)
          && <Button
            color="primary"
            variant="contained"
            style={{ color: 'white' }}
            onClick={openModalFormAdd}
          >
            Add Shipper
          </Button>
        }
      </div>
      <Card className={clsx(classes.root, className)} {...rest} >
        <Box>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {(data && data.shippers && data.shippers.length)
                  ? data.shippers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((shipper, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={shipper.phone}>
                        {columns.map((column, index) => {
                          const value = _hanleRowTableData(column.id, shipper[column.id]);
                          return (
                            <TableCell
                              align={column.align}
                              id={index}
                              key={index}
                              onClick={() => handleClickShipperItem(shipper)}
                            >
                              {value}
                            </TableCell>
                          );
                        })}
                        <TableCell align={"left"}>
                          {(user && user.roleId === ROLE.ADMIN)
                            ?
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={() => handleSelectedRow(shipper.phone, shipper.hub ? shipper.hub.id : null)}
                              style={{ color: 'white' }}
                            >
                              {shipper.hub ? 'Assigned' : 'Assign'}
                            </Button>
                            : <p>{shipper.hub ? shipper.hub.name : ''}</p>
                          }
                        </TableCell>
                      </TableRow>
                    );
                  })
                  : null
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {(data && data.shippers && data.shippers.length)
          ? <TablePagination
            rowsPerPageOptions={[0]}
            component="div"
            count={data.shippers.length}
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
            onHandleAssign={handleAssignHub}
            onCurrentHub={currentHub}
          />
        </div>
      </Modal>
      <Modal open={visibleModalShipperDetail}>
        <div>
          <ModalShipperDetail
            shipper={shipper}
            onCloseModal={handleInvisibleModalShipperDetail}
          />
        </div>
      </Modal>
      <Modal open={modalOpenAdd}>
        <div className={classes.modal}>
          <ModalShipperAdd onCloseModal={onCloseModalAdd} />
        </div>
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
          {messageSuccess}
        </Alert>
      </Snackbar>
    </div>
  );
};

ShipperList.propTypes = {
  className: PropTypes.string,
};

export default ShipperList;