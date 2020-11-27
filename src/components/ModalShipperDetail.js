import React, { useState } from 'react';
import { Button, Container, Grid, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import datetimeUtils from '../utils/datetimeUtils';
import { withStyles } from '@material-ui/styles';
import API from '../api/API';
import { SHIPPER_ENDPOINT } from '../api/endpoint';
const useStyles = makeStyles((theme) => ({
    container: {
        width: "100%",
        height: "80%",
        position: "absolute",
        marginTop: "10%",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        padding: "10px",
    },
    wrapperLeft: {
        backgroundColor: "white",
        width: "100%",
        height: "45%",
        float: "left",
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
        backgroundColor: "#00bdb6",
        display: "flex",
        borderTopLeftRadius: "5px",
        borderTopRightRadius: "5px",
        flexDirection: "row-reverse",
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
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [DOB, setDOB] = useState('');
    const handleUpdateShipperInfor = async () => {
        try {
            await API.put(SHIPPER_ENDPOINT + "/" + shipper.phone);
        } catch (error) {
            console.log(error);
        }
    }
    const shippername = shipper.last_name + " " + shipper.first_name;
    const shippergender = shipper.gender;
    const shipperDOB = shipper.DOB;
    return (
        // <div className={classes.container}>
        //     <div className={classes.detailHeader}>
        //         <CloseIcon
        //             className={classes.closeBtn}
        //             onClick={() => props.onCloseModal()}
        //         />
        //     </div>
        //     <div className={classes.wrapperLeft}>
        //         <h2 className={classes.titleText}>Shipper Detail</h2>
        //         <p className={classes.detailRow}><span><b>ID:</b> </span><span>{shipper.id}</span></p>
        //         <p className={classes.detailRow}><span><b>Full Name:</b> </span><span>{shipper.last_name} {shipper.first_name}</span></p>
        //         <p className={classes.detailRow}><span><b>Phone:</b> </span><span>{shipper.phone}</span></p>
        //         <p className={classes.detailRow}><span><b>Email:</b> </span><span>{shipper.email}</span></p>
        //         <p className={classes.detailRow}><span><b>Address:</b> </span><span>{shipper.address}</span></p>
        //         <p className={classes.detailRow}><span><b>Birthday:</b> </span><span>{shipper.DOB}</span></p>
        //         <p className={classes.detailRow}><span><b>Gender:</b> </span><span>{shipper.gender}</span></p>
        //         <p className={classes.detailRow}><span><b>Identify Number:</b> </span><span>{shipper.identify_number}</span></p>
        //         <p className={classes.detailRow}><span><b>License Number:</b> </span><span>{shipper.license_number}</span></p>
        //         <p className={classes.detailRow}><span><b>Status:</b> </span><span>{shipper.status}</span></p>
        //         <p className={classes.detailRow}><span><b>Created At:</b> </span><span>{datetimeUtils.DisplayDateTimeFormat(shipper.created_at)}</span></p>
        //         <p className={classes.detailRow}><span><b>Updated At:</b> </span><span>{datetimeUtils.DisplayDateTimeFormat(shipper.updated_at)}</span></p>
        //     </div>
        // </div>
        <div className={classes.container}>
            <div className={classes.detailHeader}>
                <CloseIcon
                    className={classes.closeBtn}
                    onClick={() => props.onCloseModal()}
                />
            </div>
            <div className={classes.wrapperLeft}>
                <TableContainer>
                    <Table aria-label="customized table" >
                        <TableHead>
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
                                <StyledTableCell align="center">Update At</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow>
                                <StyledTableCell align="right">{shipper.id}</StyledTableCell>
                                <StyledTableCell align="right"><TextField value={shippername}></TextField></StyledTableCell>
                                <StyledTableCell align="right">{shipper.phone}</StyledTableCell>
                                <StyledTableCell align="right">{shipper.email}</StyledTableCell>
                                <StyledTableCell align="right">{shipper.address}</StyledTableCell>
                                <StyledTableCell align="right"><TextField value={shipperDOB}></TextField></StyledTableCell>
                                <StyledTableCell align="right"><TextField value={shippergender}></TextField></StyledTableCell>
                                <StyledTableCell align="right">{shipper.identify_number}</StyledTableCell>
                                <StyledTableCell align="right">{shipper.license_number}</StyledTableCell>
                                <StyledTableCell align="right">{shipper.status}</StyledTableCell>
                                <StyledTableCell align="right">{datetimeUtils.DisplayDateTimeFormat(shipper.created_at)}</StyledTableCell>
                                <StyledTableCell align="right">{datetimeUtils.DisplayDateTimeFormat(shipper.updated_at)}</StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Container>
                    <Grid container
                        direction="row"
                        justify="flex-end"
                        alignItems="flex-end">
                        <Grid xs={12} sm={6}>
                            <Button
                                color="primary"
                                variant="contained"
                                className={classes.buttonSave}
                            >
                                Save Shipper
                        </Button>
                        </Grid>
                    </Grid>
                </Container>
            </div>

        </div>
    );
};

export default ModalShipperDetail;