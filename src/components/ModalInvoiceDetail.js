import React, { useState, useEffect } from "react";
import {
    CircularProgress,
    makeStyles,
} from "@material-ui/core";
import { BASE_URL_FABRIC } from "../api/endpoint";
import CloseIcon from '@material-ui/icons/Close';
import datetimeUtils from '../utils/datetimeUtils';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_FABRIC } from "../common";

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
        width: "50%",
        height: "100%",
        float: "left",
        borderRight: "1px solid #e0e0e0",
        borderBottom: "3px solid #e0e0e0",
        borderBottomLeftRadius: "5px",
    },
    wrapperRight: {
        backgroundColor: "white",
        width: "50%",
        height: "100%",
        float: "left",
        overflowY: "auto",
        borderBottom: "3px solid #e0e0e0",
        borderBottomRightRadius: "5px",
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
        backgroundColor: "#00bdb6",
        display: "flex",
        borderTopLeftRadius: "5px",
        borderTopRightRadius: "5px",
        flexDirection: "row-reverse",
    }
}));

// function getSteps() {
//     return ['IN WAREHOUSE', 'DELIVERING', 'COMPETED'];
// }

// function getStepContent(step) {
//     switch (step) {
//         case 0:
//             return 'Select campaign settings...';
//         case 1:
//             return 'What is an ad group anyways?';
//         case 2:
//             return 'This is the bit I really care about!';
//         default:
//             return 'Unknown step';
//     }
// }
// const useQontoStepIconStyles = makeStyles({
//     root: {
//         color: '#eaeaf0',
//         display: 'flex',
//         height: 22,
//         alignItems: 'center',
//     },
//     active: {
//         color: '#39beb6',
//     },
//     circle: {
//         width: 10,
//         height: 10,
//         borderRadius: '50%',
//         backgroundColor: 'currentColor',
//     },
//     completed: {
//         color: '#39beb6',
//         zIndex: 1,
//         fontSize: 18,
//     },
// });

// function QontoStepIcon(props) {
//     const classes = useQontoStepIconStyles();
//     const { active, completed } = props;

//     return (
//         <div
//             className={clsx(classes.root, {
//                 [classes.active]: active,
//             })}
//         >
//             {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
//         </div>
//     );
// }

// QontoStepIcon.propTypes = {
//     /**
//      * Whether this step is active.
//      */
//     active: PropTypes.bool,
//     /**
//      * Mark the step as completed. Is passed to child components.
//      */
//     completed: PropTypes.bool,
// };

const ModalInvoiceDetail = (props) => {
    const classes = useStyles();
    const [deliveringProcess, setDeliveringProcess] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [activeStep, setActiveStep] = useState(0);
    // const steps = getSteps();

    useEffect(() => {
        setLoading(true);
        axios.get(`${BASE_URL_FABRIC}/channels/mychannel/chaincodes/fabinvoice?args=["${props.invoice.provider.name}${props.invoice.code}"]&fcn=getHistoryForAsset&peer=peer0.org1.example.com`, {
            headers: {
                'Authorization': 'Bearer ' + Cookies.get(ACCESS_TOKEN_FABRIC),
            },
        }).then(response => {
            if (response.status === 200) {
                if (!response.data && !response.data.length) {
                    return;
                }
                setDeliveringProcess(response.data);
                setLoading(false);
            }
        });
    }, [props.invoice.code, props.invoice.provider.name]);

    return (
        <div className={classes.container}>
            <div className={classes.detailHeader}>
                <CloseIcon
                    className={classes.closeBtn}
                    onClick={() => props.onCloseModal()}
                />
            </div>
            <div className={classes.wrapperLeft}>
                <h2 className={classes.titleText}>Invoice Detail</h2>
                <p className={classes.detailRow}><span><b>Invoice ID:</b> </span><span>{props.invoice.code}</span></p>
                <p className={classes.detailRow}><span><b>Receiver_name:</b> </span><span>{props.invoice.receiver_name}</span></p>
                <p className={classes.detailRow}><span><b>Address:</b> </span><span>{props.invoice.address}</span></p>
                <p className={classes.detailRow}><span></span><b>Customer phone number:</b> <span>{props.invoice.customer_phone_number}</span></p>
                <p className={classes.detailRow}><span></span><b>Receiver phone number:</b> <span>{props.invoice.receiver_phone_number}</span></p>
            </div>
            <div className={classes.wrapperRight}>
                {loading
                    ? (
                        <>
                            <div style={{
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <CircularProgress />
                            </div>
                        </>
                    )
                    : (
                        <>
                            <h2 className={classes.titleText}>Delivery Status Detail</h2>
                            {/* <Stepper activeStep={activeStep} orientation="vertical">
                                {steps.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                                        <StepContent>
                                            <Typography>{getStepContent(index)}</Typography>
                                        </StepContent>
                                    </Step>
                                ))}
                            </Stepper> */}
                            <table className={classes.table}>
                                <tbody>
                                    {
                                        deliveringProcess.map((process, index) => {
                                            console.log(process);
                                            return (index === (deliveringProcess.length - 1))
                                                ? <tr key={index} className={classes.currentstatus}>
                                                    <td className={classes.dot}>&bull;</td>
                                                    <td className={classes.tableRow}>
                                                        <p>{process.Value.status}</p>
                                                        <p>Transaction Id: {process.TxId}</p>
                                                        <p>Time: {datetimeUtils.DisplayDateTimeFormat(process.Timestamp)}</p>
                                                        {process.Value.shipper_phone
                                                            ? <>
                                                                <p>Shipper phone number: {process.Value.shipper_phone}</p>
                                                                <p>Shipper name: {process.Value.shipper_name}</p>
                                                            </>
                                                            : <p>Shipper: Not Assign</p>
                                                        }
                                                    </td>
                                                </tr>
                                                : <tr key={index}>
                                                    <td className={classes.dot}>&bull;</td>
                                                    <td className={classes.tableRow}>
                                                        <p>{process.Value.status}</p>
                                                        <p>Transaction Id: {process.TxId}</p>
                                                        <p>Time: {datetimeUtils.DisplayDateTimeFormat(process.Timestamp)}</p>
                                                        <p>Shipper phone number: {process.Value.shipper_phone}</p>
                                                    </td>
                                                </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </>
                    )
                }
            </div>

        </div >
    );
};
export default ModalInvoiceDetail;
