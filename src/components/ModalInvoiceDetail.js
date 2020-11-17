import React, { useState, useEffect } from 'react';
import {
    makeStyles,
    Button,
} from '@material-ui/core';
import API from '../api/API';
import { BLOCKCHAIN_INVOICES_ENDPOINT } from '../api/endpoint';
import Moment from 'react-moment';


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
        backgroundColor: "#0496a6",
        borderRadius: "0px",
        height:"35px",
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
    },
    detailHeader: {
        width: "100%",
        height: '35px',
        backgroundColor: "#00bdb6",
    }
}));

const ModalInvoiceDetail = (props) => {
    const classes = useStyles();
    const [deliveringProcess, setDeliveringProcess] = useState([]);

    useEffect(() => {
        API.get(`${BLOCKCHAIN_INVOICES_ENDPOINT}${props.invoice.code}`)
            .then(async response => {
                if (response.ok) {
                    const fetchData = await response.json();
                    setDeliveringProcess(fetchData.data);
                }
            });
    }, []);
    return (

        <div className={classes.container}>
            <div className={classes.detailHeader}>
            <Button
                onClick={() => props.closeModal()}
                className={classes.closeBtn}>
                Close
            </Button>
            </div>
            <div className={classes.wrapperLeft}>
                <h2 className={classes.titleText}>Invoice Detail</h2>
                <p className={classes.detailRow}><span><b>Invoice ID:</b> :</span><span>{props.invoice.code}</span></p>
                <p className={classes.detailRow}><span><b>Receiver_name</b>          :</span><span>{props.invoice.receiver_name}</span></p>
                <p className={classes.detailRow}><span><b>Address</b>                :</span><span>{props.invoice.address}</span></p>
                <p className={classes.detailRow}><span></span><b>Customer phone number:</b><span>{props.invoice.customer_phone_number}</span></p>
                <p className={classes.detailRow}><span></span><b>Receiver phone number:</b><span>{props.invoice.receiver_phone_number}</span></p>
            </div>
            <div className={classes.wrapperRight}>
                <h2 className={classes.titleText}>Invoice Detail</h2>
                <table className={classes.table}>
                    {
                        deliveringProcess.map((process, index) => {
                            return (index === (deliveringProcess.length - 1))
                                ?
                                <tr className={classes.currentstatus}>
                                    <td className={classes.dot}>&bull;</td>
                                    <td className={classes.tableRow}>
                                        <p>{process.Record.status}</p>
                                        <p>Shipper phone number: {process.Record.shipper_phone}</p>
                                        <p>Shipper phone number: {process.Record.shipper_phone}</p>
                                        <p>Time: <Moment format="HH:mm DD-MM-YYYY">
                                            {process.Record.created_at}
                                        </Moment></p>
                                    </td>
                                </tr>

                                : <tr >
                                    <td className={classes.dot}>&bull;</td>
                                    <td className={classes.tableRow}>
                                        <p>{process.Record.status}</p>
                                        <p>Shipper phone number: {process.Record.shipper_phone}</p>
                                        <p>Time: <Moment format="HH:mm DD-MM-YYYY">
                                            {process.Record.created_at}
                                        </Moment></p>
                                    </td>
                                </tr>
                        })
                    }


                </table>
            </div>
           
        </div>
    );
};
export default ModalInvoiceDetail;
