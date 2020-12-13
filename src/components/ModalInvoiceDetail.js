import React, { useState, useEffect } from "react";
import {
    Button,
    CircularProgress,
    makeStyles,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Typography,
} from "@material-ui/core";
import { BASE_URL_FABRIC } from "../api/endpoint";
import CloseIcon from '@material-ui/icons/Close';
import datetimeUtils from '../utils/datetimeUtils';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_FABRIC } from "../common";
import clsx from 'clsx';
import { Check } from "react-feather";
import PropTypes from 'prop-types';

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

function getSteps() {
    return ['IN_WAREHOUSE', 'TO_DELIVERY', 'DELIVERING', 'COMPLETED', 'CANCELLED', 'REFUND'];
}

const useQontoStepIconStyles = makeStyles({
    root: {
        color: '#eaeaf0',
        display: 'flex',
        height: 22,
        alignItems: 'center',
    },
    active: {
        color: '#39beb6',
    },
    circle: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
    completed: {
        color: '#39beb6',
        zIndex: 1,
        fontSize: 18,
    },
});

function QontoStepIcon(props) {
    const classes = useQontoStepIconStyles();
    const { active, completed } = props;

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
            })}
        >
            {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
        </div>
    );
}

QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     */
    active: PropTypes.bool,
    /**
     * Mark the step as completed. Is passed to child components.
     */
    completed: PropTypes.bool,
};

const ModalInvoiceDetail = (props) => {
    const classes = useStyles();
    const [deliveringProcess, setDeliveringProcess] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [contentTransaction, setContentTransaction] = useState(null);
    const steps = getSteps();

    useEffect(() => {
        setLoading(true);

        const handleStep = (data) => {
            if (!data || !data.length) return;
            switch (data[0].Value.status) {
                case 'IN_WAREHOUSE':
                    setActiveStep(0);
                    return;
                case 'TO_DELIVERY':
                    setActiveStep(1);
                    return;
                case 'DELIVERING':
                    setActiveStep(2);
                    return;
                case 'COMPLETED':
                    setActiveStep(3);
                    return;
                case 'CANCELLED':
                    setActiveStep(4);
                    return;
                case 'REFUND':
                    setActiveStep(5);
                    return;
                default:
                    return
            }
        }

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
                handleStep(response.data);
                setLoading(false);
            }
        });
    }, [props.invoice.code, props.invoice.provider.name]);

    function getStepContent(label) {
        return deliveringProcess.map(transaction => {
            if (transaction.Value.status === label) {
                return (
                    <Typography>Transaction ID: {transaction.TxId}</Typography>
                );
            }
        });
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

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
                <p className={classes.detailRow}><span><b>Invoice Code:</b> </span><span>{props.invoice.code}</span></p>
                <p className={classes.detailRow}><span><b>Receiver Name:</b> </span><span>{props.invoice.receiver_name}</span></p>
                <p className={classes.detailRow}><span></span><b>Customer Phone Number:</b> <span>{props.invoice.customer_phone_number}</span></p>
                <p className={classes.detailRow}><span></span><b>Receiver Phone Number:</b> <span>{props.invoice.receiver_phone_number}</span></p>
                <p className={classes.detailRow}><span><b>Receiver Address:</b> </span><span>{props.invoice.address}</span></p>
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
                            <Stepper activeStep={activeStep} orientation="vertical">
                                {steps.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                                        <StepContent>
                                            {getStepContent(label)}
                                            <div className={classes.actionsContainer}>
                                                <div>
                                                    <Button
                                                        disabled={activeStep === 0}
                                                        onClick={handleBack}
                                                        className={classes.button}
                                                    >
                                                        Back
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={handleNext}
                                                        className={classes.button}
                                                    >
                                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </StepContent>
                                    </Step>
                                ))}
                            </Stepper>
                            {/* <table className={classes.table}>
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
                            </table> */}
                        </>
                    )
                }
            </div>

        </div >
    );
};
export default ModalInvoiceDetail;
