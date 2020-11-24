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
import { STATUS } from '../../../common/index';
import { HUB_ENDPOINT } from '../../../api/endpoint';
import API from '../../../api/API';
import ModalShipperDetail from '../../../components/ModalShipperDetail';

const columns = [
  // { id: 'id', label: 'Id', minWidth: 100, align: 'center' },
  { id: 'avatar', label: 'Avatar', minWidth: 200, align: 'center' },
  { id: 'last_name', label: 'Last name', minWidth: 200, align: 'center' },
  { id: 'first_name', label: 'First name', minWidth: 500, align: 'center' },
  { id: 'phone', label: 'Phone', minWidth: 200, align: 'center' },
  // { id: 'created_at', label: 'Created at', minWidth: 200, align: 'center' },
  { id: 'status', label: 'status', minWidth: 120, align: 'center' },
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
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));

const ShipperList = ({ onReload, className, shippers, ...rest }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visiableModal, setVisibleModal] = useState(false);
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [visibleModalShipperDetail, setVisibleModalShipperDetail] = useState(false);
  const [shipper, setShipper] = useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelectedRow = (shipperPhone) => {
    setSelectedShipper(shipperPhone);
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

  const handleAssignHub = async (hub_id) => {
    const data = {
      shipper_phone: selectedShipper
    };

    const response = await API.patch(HUB_ENDPOINT + "/" + hub_id + "/assign_shipper", data);

    onReload();
    setSelectedShipper(null);
    handleInvisibleModal();
  };

  const _rowStatus = (backgroundColor, value) => {
    return (<div style={{
      backgroundColor: backgroundColor,
      color: 'white',
      padding: 6,
      borderRadius: 5
    }}>
      {value}
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
      default:
        return value;
    }
  };

  const handleClickShipperItem = (shipper) => {
    setShipper(shipper);
    handleVisibleModalShipperDetail();
  };

  return (
    <>
      <Card className={clsx(classes.root, className)} {...rest} >
        <Box>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell
                      key={index}
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
                {shippers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((shipper) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={shipper.phone} onClick={() => handleClickShipperItem(shipper)}>
                      {columns.map((column, index) => {
                        const value = _hanleRowTableData(column.id, shipper[column.id]);
                        return (
                          <TableCell align={column.align} id={index}>
                            {value}
                          </TableCell>
                        );
                      })}
                      <TableCell align={"center"}>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => handleSelectedRow(shipper.phone)}
                          style={{ color: 'white' }}
                          disabled={shipper.hub ? true : false}
                        >
                          {shipper.hub ? 'Assigned' : 'Assign'}
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
          count={shippers.length}
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
            onHandleAssign={handleAssignHub}
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
    </>
  );
};

ShipperList.propTypes = {
  className: PropTypes.string,
  shippers: PropTypes.array.isRequired
};

export default ShipperList;
