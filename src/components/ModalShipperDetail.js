import React, { useEffect, useState } from 'react';
import {
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import datetimeUtils from '../utils/datetimeUtils';
import { withStyles } from '@material-ui/styles';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import Bags from './Bag';
import { SHIPPER_ENDPOINT } from '../api/endpoint';
import API from '../api/API';

const useStyles = makeStyles((theme) => ({
    container: {
        width: "100%",
        height: "90%",
        position: "absolute",
        top: 10,
        left: 0,
        right: 0,
        padding: "10px",
    },
    wrapperDetail: {
        backgroundColor: "white",
        width: "100%",
        overflowY: "auto",
        borderRight: "1px solid #e0e0e0",
        borderBottom: "3px solid #e0e0e0",
        borderBottomLeftRadius: "5px",
    },
    wrapperBag: {
        backgroundColor: "white",
        width: "100%",
        height: "70%",
        overflowY: "auto",
        borderRight: "1px solid #e0e0e0",
        borderBottom: "3px solid #e0e0e0",
        borderBottomLeftRadius: "5px",
    },
    titleText: {
        textAlign: "center",
        paddingBottom: "20px",
        paddingTop: "50px",
    },
    detailRow: {
        paddingBottom: "15px",
        paddingLeft: "20px",
    },
    closeBtn: {
        margin: "10px",
        cursor: 'pointer',
        color: 'white'
    },
    detailHeader: {
        display: "flex",
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: "#00bdb6",
        borderTopLeftRadius: "5px",
        borderTopRightRadius: "5px",
    },
    buttonSave: {
        marginTop: 20,
        color: 'white',
        marginLeft: '80%',
        width: 150,
    }
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: 'lightgrey',
        color: theme.palette.common.black,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const ModalShipperDetail = (props) => {
    const classes = useStyles();
    const { shipper } = props;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [bag, setBag] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchInvoiceShipperByAssignedAt = async (date) => {
        const response = await API.get(`${SHIPPER_ENDPOINT}/${shipper.phone}/orders?assigned_at=${date}`);
        const fetchData = await response.json();
        if (response.ok) {
            setBag(fetchData.data);
        } else {
            setBag({
                delivery_status: []
            });
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchInvoiceShipperByAssignedAt(datetimeUtils.DisplayDatePicker(new Date(selectedDate)));
        setLoading(false);
    }, []);

    const onHandleDateChange = (date) => {
        setSelectedDate(date);
        fetchInvoiceShipperByAssignedAt(datetimeUtils.DisplayDatePicker(new Date(date)));
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


    return (
        <div className={classes.container}>
            <div className={classes.detailHeader}>
                <div style={{
                    margin: "10px",
                    color: 'white'
                }}>
                    <h3>Shipper Information</h3>
                </div>
                <CloseIcon className={classes.closeBtn} onClick={() => props.onCloseModal()} />
            </div>
            <div className={classes.wrapperDetail}>
                <TableContainer>
                    <Table aria-label="customized table" >
                        <TableHead title="Shipper Detail" style={{ color: 'white' }}>
                            <TableRow>
                                <StyledTableCell align="center">ID</StyledTableCell>
                                <StyledTableCell align="center">Full Name</StyledTableCell>
                                <StyledTableCell align="center">Phone</StyledTableCell>
                                <StyledTableCell align="center">Email</StyledTableCell>
                                <StyledTableCell align="center">Address</StyledTableCell>
                                <StyledTableCell align="center">Birthday</StyledTableCell>
                                <StyledTableCell align="center">Gender</StyledTableCell>
                                <StyledTableCell align="center">Identify Number</StyledTableCell>
                                <StyledTableCell align="center">License Number</StyledTableCell>
                                <StyledTableCell align="center">Status</StyledTableCell>
                                <StyledTableCell align="center">Created At</StyledTableCell>
                                <StyledTableCell align="center">Updated At</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow>
                                <StyledTableCell align="center">{shipper.id}</StyledTableCell>
                                <StyledTableCell align="center">{shipper.last_name + " " + shipper.first_name}</StyledTableCell>
                                <StyledTableCell align="center">{shipper.phone}</StyledTableCell>
                                <StyledTableCell align="center">{shipper.email}</StyledTableCell>
                                <StyledTableCell align="center">{shipper.address}</StyledTableCell>
                                <StyledTableCell align="center">{datetimeUtils.DisplayDateFormat(shipper.DOB)}</StyledTableCell>
                                <StyledTableCell align="center">{shipper.gender}</StyledTableCell>
                                <StyledTableCell align="center">{shipper.identify_number}</StyledTableCell>
                                <StyledTableCell align="center">{shipper.license_number}</StyledTableCell>
                                <StyledTableCell align="center">
                                    {
                                        shipper.is_active
                                            ? _rowStatus("#1e8101", shipper.is_active)
                                            : _rowStatus("#d9534f", shipper.is_active)
                                    }
                                </StyledTableCell>
                                <StyledTableCell align="center">{datetimeUtils.DisplayDateTimeFormat(shipper.created_at)}</StyledTableCell>
                                <StyledTableCell align="center">{shipper.updated_at ? datetimeUtils.DisplayDateTimeFormat(shipper.updated_at) : ''}</StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className={classes.wrapperBag}>
                {loading
                    ? <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 10,
                    }}>
                        <CircularProgress />
                    </div>
                    :
                    <>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'start',
                            alignItems: 'flex-end',
                            marginLeft: 10
                        }}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="Date"
                                    label="Date"
                                    value={selectedDate}
                                    onChange={onHandleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                            <div style={{
                                fontWeight: 'bold',
                                marginLeft: 10,
                                marginBottom: 15
                            }}>
                                Total Order: {(bag && bag.delivery_status.length) ? bag.delivery_status.length : 0}
                            </div>
                        </div>
                        {(bag && <Bags bag={bag} />)}
                    </>
                }
            </div>
        </div>
    );
};

export default ModalShipperDetail;