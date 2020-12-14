import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import datetimeUtils from '../../utils/datetimeUtils';
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

import API from '../../api/API';
import { useDispatch } from 'react-redux';
import { STATUS } from '../../common/index';
import TableContainer from '@material-ui/core/TableContainer';
import ModalHubManagerAdd from '../../components/ModalHubManagerAdd';

const columns = [
    { id: 'avatar', label: 'Avatar', minWidth: 120, align: 'left' },
    { id: 'last_name', label: 'Last name', minWidth: 200, align: 'left' },
    { id: 'first_name', label: 'First name', minWidth: 200, align: 'left' },
    { id: 'phone', label: 'Phone', minWidth: 200, align: 'left' },
    { id: 'status', label: 'Status', minWidth: 120, align: 'left' },
    { id: 'hub', label: 'Hub', minWidth: 120, align: 'left' },
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

const HubManagerList = ({ className, hubmanagers, ...rest }) => {
    const rowsPerPage = 50;
    const classes = useStyles();
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [hubmanager, setHubmanager] = useState({});
    const [orderBy, setOrderBy] = useState('id');
    const [currentHub, setCurrentHub] = useState(null);
    const [modalOpenAdd, setModalOpenAdd] = useState(false);
    const [visiableModal, setVisibleModal] = useState(false);
    const [selectedHubManager, setSelectedHubManager] = useState(null);
    const [visibleModalHubManagerDetail, setVisibleModalHubManagerDetail] = useState(false);
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
        setSelectedHubManager(shipperPhone);
        setCurrentHub(shipperHub);
        setVisibleModal(true);
    }

    const handleVisibleModal = () => {
        setVisibleModal(true);
    };

    const handleInvisibleModal = () => {
        setVisibleModal(false);
    };

    const handleVisibleModalHubManagerDetail = () => {
        setVisibleModalHubManagerDetail(true);
    };

    const handleInvisibleModalShipperDetail = () => {
        setVisibleModalHubManagerDetail(false);
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
            default:
                return value;
        }
    };

    const handleClickHubManagerItem = (shipper) => {
        setHubmanager(shipper);
        handleVisibleModalHubManagerDetail();
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <div className={classes.boundary}>
            <div style={{ marginBottom: 10 }}>
                <Button
                    color="primary"
                    variant="contained"
                    style={{ color: 'white' }}
                    onClick={openModalFormAdd}
                >
                    Add Hub Manager
                </Button>
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
                                {hubmanagers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((hubmanager, index) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={hubmanager.phone}>
                                            {columns.map((column, index) => {
                                                let value;
                                                if (column.id === 'hub') {
                                                    value = _hanleRowTableData(column.id, hubmanager.hub.name);
                                                } else {
                                                    value = _hanleRowTableData(column.id, hubmanager[column.id]);
                                                }
                                                return (
                                                    <TableCell
                                                        align={column.align}
                                                        id={index}
                                                        key={index}
                                                        onClick={() => handleClickHubManagerItem(hubmanager)}
                                                    >
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
                    rowsPerPageOptions={[0]}
                    component="div"
                    count={hubmanagers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                />
            </Card>
            <Modal open={modalOpenAdd}>
                <div className={classes.modal}>
                    <ModalHubManagerAdd onCloseModal={onCloseModalAdd} />
                </div>
            </Modal>
        </div>
    );
};

HubManagerList.propTypes = {
    className: PropTypes.string,
    hubmanagers: PropTypes.array.isRequired
};

export default HubManagerList;