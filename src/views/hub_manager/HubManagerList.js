import React, { useState, useEffect } from 'react';
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
    Snackbar,
} from '@material-ui/core';

import { useDispatch } from 'react-redux';
import TableContainer from '@material-ui/core/TableContainer';
import ModalHubManagerAdd from '../../components/ModalHubManagerAdd';
import ModalAssignHub from './ModalAssignHub';
import { ADMIN_ENDPOINT, HUB_MANAGER_ENDPOINT } from '../../api/endpoint';
import API from '../../api/API';
import { actLoadHubManager } from '../../actions';
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
        width: '100%',
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

const HubManagerList = ({ className, data, user, ...rest }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    let totalPage = 0;
    const [page, setPage] = useState(totalPage);
    const rowsPerPage = 50;
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [currentHub, setCurrentHub] = useState(null);
    const [modalOpenAdd, setModalOpenAdd] = useState(false);
    const [visiableModalHub, setVisibleModalHub] = useState(false);
    const [selectedHubManager, setSelectedHubManager] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (data.hub_managers && data.hub_managers.length) {
            totalPage = +data.meta.totalPages;
            setPage(0);
        }
    }, []);

    const openModalFormAdd = () => {
        setModalOpenAdd(true);
    }

    const onCloseModalAdd = async (isChanged) => {
        if (isChanged) {
            const response = await API.get(`${HUB_MANAGER_ENDPOINT}?page=1&limit=50`);
            if (response.ok) {
                const fetchData = await response.json();
                const data = {
                    hub_managers: fetchData.data.items,
                    meta: fetchData.data.meta
                };
                dispatch(actLoadHubManager(data));
                setOpenSnackbar(true);
                setMessage('Create Hub Manager Sucess!');
            }
        }
        setModalOpenAdd(false);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleSelectedRow = (hubManagerId, hub) => {
        setSelectedHubManager(hubManagerId);
        setCurrentHub(hub);
        setVisibleModalHub(true);
    }

    const handleVisibleModalHub = () => {
        setVisibleModalHub(true);
    };

    const handleInvisibleModalHub = () => {
        setVisibleModalHub(false);
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
                    : 'https://res.cloudinary.com/dvehkdedj/image/upload/v1598777976/269-2697881_computer-icons-user-clip-art-transparent-png-icon_yqpi0g.png'}
                />);
            case 'created_at':
                return datetimeUtils.DisplayDateTimeFormat(value);
            default:
                return value;
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleAssignHub = async (hub_id) => {
        const data = {
            hub_manager_id: selectedHubManager,
            hub_id: hub_id
        };

        const response = await API.patch(`${ADMIN_ENDPOINT}/${user.phone}/assign-hub-manager-to-hub`, data);
        const patchData = await response.json();
        if (response.ok) {
            const responseHubManager = await API.get(`${HUB_MANAGER_ENDPOINT}?page=1&limit=50`);
            const fetchData = await responseHubManager.json();
            if (responseHubManager.ok) {
                const hubManagerData = {
                    hub_managers: fetchData.data.items,
                    meta: fetchData.data.meta
                };
                dispatch(actLoadHubManager(hubManagerData));
                setOpenSnackbar(true);
                setMessage(`Update Hub Manager ${selectedHubManager} to hub ${hub_id} Sucess!`);
            }
        } else {
            alert(patchData.message);
            return;
        }
        setSelectedHubManager(null);
        handleInvisibleModalHub();
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
                                {(data && data.hub_managers)
                                    ? data.hub_managers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((hub_manager, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={hub_manager.phone}>
                                                    {columns.map((column, index) => {
                                                        let value;
                                                        if (column.id === 'hub') {
                                                            value = _hanleRowTableData(column.id, hub_manager.hub.name);
                                                        } else {
                                                            value = _hanleRowTableData(column.id, hub_manager[column.id]);
                                                        }
                                                        return (
                                                            <TableCell
                                                                align={column.align}
                                                                id={index}
                                                                key={index}
                                                            >
                                                                {value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    <TableCell align={"left"}>
                                                        <Button
                                                            color="primary"
                                                            variant="contained"
                                                            onClick={() => handleSelectedRow(hub_manager.id, hub_manager.hub ? hub_manager.hub.id : null)}
                                                            style={{ color: 'white' }}
                                                        >
                                                            {hub_manager.hub.address}
                                                        </Button>
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
                {data && data.hub_managers.length
                    ?
                    <TablePagination
                        rowsPerPageOptions={[0]}
                        component="div"
                        count={data.hub_managers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                    />
                    : null}
            </Card>
            <Modal open={modalOpenAdd}>
                <div className={classes.modal}>
                    <ModalHubManagerAdd onCloseModal={onCloseModalAdd} />
                </div>
            </Modal>
            <Modal open={visiableModalHub}>
                <div className={classes.modal}>
                    <ModalAssignHub
                        onInvisibleModel={handleInvisibleModalHub}
                        onVisibleModal={handleVisibleModalHub}
                        onHandleAssign={handleAssignHub}
                        onCurrentHub={currentHub}
                    />
                </div>
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
        </div>
    );
};

HubManagerList.propTypes = {
    className: PropTypes.string,
};

export default HubManagerList;