import React from 'react';
import {
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import datetimeUtils from '../utils/datetimeUtils';
import { withStyles } from '@material-ui/styles';

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
    return (
        <div className={classes.container}>
            <div className={classes.detailHeader}>
                <CloseIcon className={classes.closeBtn} onClick={() => props.onCloseModal()} />
            </div>
            <div className={classes.wrapperLeft}>
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
                                <StyledTableCell align="center">Update At</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow>
                                <StyledTableCell align="center">{shipper.id}</StyledTableCell>
                                <StyledTableCell align="center">{shipper.last_name + " " + shipper.first_name}</StyledTableCell>
                                <StyledTableCell align="center">{shipper.phone}</StyledTableCell>
                                <StyledTableCell align="center">{shipper.email}</StyledTableCell>
                                <StyledTableCell align="center">{shipper.address}</StyledTableCell>
                                <StyledTableCell align="center">{shipper.DOB}</StyledTableCell>
                                <StyledTableCell align="center">{shipper.gender}</StyledTableCell>
                                <StyledTableCell align="center">{shipper.identify_number}</StyledTableCell>
                                <StyledTableCell align="center">{shipper.license_number}</StyledTableCell>
                                <StyledTableCell align="center">{shipper.status}</StyledTableCell>
                                <StyledTableCell align="center">{datetimeUtils.DisplayDateTimeFormat(shipper.created_at)}</StyledTableCell>
                                <StyledTableCell align="center">{datetimeUtils.DisplayDateTimeFormat(shipper.updated_at)}</StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* <Container>
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
                </Container> */}
            </div>

        </div>
    );
};

export default ModalShipperDetail;