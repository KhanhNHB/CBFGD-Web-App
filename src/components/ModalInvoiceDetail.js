import React, { useState } from 'react';
import {
    makeStyles,
    Button,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
        width: '60%',
        height: '80%',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '10px',


    },
    wrapperLeft: {
        backgroundColor: "white",
        width: "50%",
        height: '100%',
        float: "left",
        borderRight: "1px solid #e0e0e0",
        borderBottom: "3px solid #e0e0e0",
    },
    wrapperRight: {
        backgroundColor: "white",
        width: "50%",
        height: '100%',
        float: "left",
        overflowY: "scroll",
        borderBottom: "3px solid #e0e0e0",
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
        float: "right",
        backgroundColor: "#00bdb6",
        transform: 'translate(0%, -98%)',
    },
    tableRow: {
        borderBottom: "1px solid #e0e0e0",
        paddingBottom: "8px",
    },
    table: {
        width: "80%",
        marginLeft: "10%",
    },
    dot: {
        fontSize: "30px",
    },
    currentstatus: {
        color: "#00bdb6",
    }
}));

const ModalInvoiceDetail = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <div className={classes.wrapperLeft}>
                <h2 className={classes.titleText}>Invoice Detail</h2>
                <p className={classes.detailRow}><span><b>Invoice ID:</b> :</span><span>{props.invoice.id}</span></p>
                <p className={classes.detailRow}><span><b>Receiver_name</b>          :</span><span>{props.invoice.receiver_name}</span></p>
                <p className={classes.detailRow}><span><b>Address</b>                :</span><span>{props.invoice.address}</span></p>
                <p className={classes.detailRow}><span></span><b>Customer phone number:</b><span>{props.invoice.customer_phone_number}</span></p>
                <p className={classes.detailRow}><span></span><b>Receiver phone number:</b><span>{props.invoice.receiver_phone_number}</span></p>
            </div>
            <div className={classes.wrapperRight}>
                <h2 className={classes.titleText}>Invoice Detail</h2>
                <table className={classes.table}>
                    <tr >
                        <td className={classes.dot}>&bull;</td>
                        <td className={classes.tableRow}>
                            <p>Đơn hàng ở kho</p>
                            <p>10/11/2020 13:00</p>
                        </td>
                    </tr>
                    <tr >
                        <td className={classes.dot}>&bull;</td>
                        <td className={classes.tableRow}>
                            <p>Shipper đã nhận hàng</p>
                            <p>Shipper: NghiaNC</p>
                            <p>11/11/2020 06:05</p>
                        </td>
                    </tr>
                    <tr >
                        <td className={classes.dot}>&bull;</td>
                        <td className={classes.tableRow}>
                            <p>Shipper đang giao hàng</p>
                            <p>Shipper: NghiaNC</p>
                            <p>11/11/2020 13:13</p>
                        </td>
                    </tr>
                    <tr className={classes.currentstatus}>
                        <td className={classes.dot}>&bull;</td>
                        <td className={classes.tableRow}>
                            <p>Giao hàng thành công</p>
                            <p>Shipper: NghiaNC</p>
                            <p>11/11/2020 14:00</p>
                        </td>
                    </tr>
                </table>
            </div>
            <Button
                onClick={() => props.closeModal()}
                className={classes.closeBtn}>
                Close
            </Button>
        </div>
    );
};
export default ModalInvoiceDetail;
