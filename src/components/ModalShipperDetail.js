import React from 'react';
import { makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import datetimeUtils from '../utils/datetimeUtils';

const useStyles = makeStyles((theme) => ({
    container: {
        width: "60%",
        height: "80%",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        padding: "10px",
    },
    wrapperLeft: {
        backgroundColor: "white",
        width: "100%",
        height: "100%",
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
    }
}));

const ModalShipperDetail = (props) => {
    const classes = useStyles();
    const { shipper } = props;

    return (
        <div className={classes.container}>
            <div className={classes.detailHeader}>
                <CloseIcon
                    className={classes.closeBtn}
                    onClick={() => props.onCloseModal()}
                />
            </div>
            <div className={classes.wrapperLeft}>
                <h2 className={classes.titleText}>Shipper Detail</h2>
                <p className={classes.detailRow}><span><b>ID:</b> </span><span>{shipper.id}</span></p>
                <p className={classes.detailRow}><span><b>Full Name:</b> </span><span>{shipper.last_name} {shipper.first_name}</span></p>
                <p className={classes.detailRow}><span><b>Phone:</b> </span><span>{shipper.phone}</span></p>
                <p className={classes.detailRow}><span><b>Email:</b> </span><span>{shipper.email}</span></p>
                <p className={classes.detailRow}><span><b>Address:</b> </span><span>{shipper.address}</span></p>
                <p className={classes.detailRow}><span><b>Birthday:</b> </span><span>{shipper.DOB}</span></p>
                <p className={classes.detailRow}><span><b>Gender:</b> </span><span>{shipper.gender}</span></p>
                <p className={classes.detailRow}><span><b>Identify Number:</b> </span><span>{shipper.identify_number}</span></p>
                <p className={classes.detailRow}><span><b>License Number:</b> </span><span>{shipper.license_number}</span></p>
                <p className={classes.detailRow}><span><b>Status:</b> </span><span>{shipper.status}</span></p>
                <p className={classes.detailRow}><span><b>Created At:</b> </span><span>{datetimeUtils.DisplayDateTimeFormat(shipper.created_at)}</span></p>
                <p className={classes.detailRow}><span><b>Updated At:</b> </span><span>{datetimeUtils.DisplayDateTimeFormat(shipper.updated_at)}</span></p>
            </div>
        </div>
    );
};

export default ModalShipperDetail;