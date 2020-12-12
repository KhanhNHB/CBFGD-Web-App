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
  Modal,
  TableSortLabel,
  CircularProgress
} from '@material-ui/core';

import API from '../../../api/API';
import ModalAssign from './ModalAssign';
import { useDispatch } from 'react-redux';
import { STATUS } from '../../../common/index';
import { actLoadShipper } from '../../../actions';
import TableContainer from '@material-ui/core/TableContainer';
import ModalShipperAdd from '../../../components/ModalShipperAdd';
import { ADMIN_ENDPOINT, SHIPPER_ENDPOINT } from '../../../api/endpoint';
import ModalShipperDetail from '../../../components/ModalShipperDetail';

const columns = [
  { id: 'avatar', label: 'Avatar', minWidth: 120, align: 'left' },
  { id: 'last_name', label: 'Last name', minWidth: 200, align: 'left' },
  { id: 'first_name', label: 'First name', minWidth: 200, align: 'left' },
  { id: 'phone', label: 'Phone', minWidth: 200, align: 'left' },
  { id: 'status', label: 'Status', minWidth: 120, align: 'left' },
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

const ShipperList = ({ className, shippers, user, ...rest }) => {
  const rowsPerPage = 50;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [shipper, setShipper] = useState({});
  const [orderBy, setOrderBy] = useState('id');
  const [currentHub, setCurrentHub] = useState(null);
  const [modalOpenAdd, setModalOpenAdd] = useState(false);
  const [visiableModal, setVisibleModal] = useState(false);
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [visibleModalShipperDetail, setVisibleModalShipperDetail] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  const openModalFormAdd = () => {
    setModalOpenAdd(true);
  }

  const onCloseModalAdd = async () => {
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
    const patchData = await response.json();
    if (patchData.message) {
      alert(patchData.message);
    } else {
      API.get(SHIPPER_ENDPOINT)
        .then(async response => {
          if (response.ok) {
            const fetchData = await response.json();
            const shippersData = fetchData.data;
            if (shippersData.length > 0) {
              dispatch(actLoadShipper(shippersData));
            }
          }
          setLoadingModal(false);
        }).catch(err => {
          alert(err.message);
        });
    }
    setSelectedShipper(null);
    handleInvisibleModal();
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
      {value.toUpperCase()}
    </div>);
  }

  const _hanleRowTableData = (column, value) => {
    switch (column) {
      case 'status':
        return (value === STATUS.AVAILABLE
          ? _rowStatus("#1e8101", value)
          : value === STATUS.PENDING
            ? _rowStatus("#d9534f", value)
            : _rowStatus("#f0ad4f", value));
      case 'avatar':
        return (<img alt="User Avatar" style={{ height: 45, width: 60 }} src={value ? value : 'https://res.cloudinary.com/dvehkdedj/image/upload/v1598777976/269-2697881_computer-icons-user-clip-art-transparent-png-icon_yqpi0g.png'} />);
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

  return (
    <>
      <Box display="flex" justifyContent="flex-end">
        <Button
          color="primary"
          variant="contained"
          style={{ color: 'white' }}
          onClick={openModalFormAdd}
        >
          Add Shipper
        </Button>
      </Box>
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
                {shippers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((shipper, index) => {
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
                        {(user && user.role === 'Admin')
                          ?
                          <Button
                            color="primary"
                            variant="contained"
                            onClick={() => handleSelectedRow(shipper.phone, shipper.hub ? shipper.hub.id : null)}
                            style={{ color: 'white' }}
                          >
                            {shipper.hub ? 'Assigned' : 'Assign'}
                          </Button>
                          : <p>{shipper.hub.name}</p>
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <TablePagination
          rowsPerPageOptions={[0]}
          component="div"
          count={shippers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
        />
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
    </>
  );
};

ShipperList.propTypes = {
  className: PropTypes.string,
  shippers: PropTypes.array.isRequired
};

export default ShipperList;