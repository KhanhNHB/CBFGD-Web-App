import React, { useState, useEffect } from "react";
import {
    Button,
    CircularProgress,
    makeStyles,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core";
import { IMAGE_ENDPOINT, INVOICE_ENDPOINT } from "../api/endpoint";
import CloseIcon from '@material-ui/icons/Close';
import datetimeUtils from '../utils/datetimeUtils';
import clsx from 'clsx';
import { Check } from "react-feather";
import PropTypes from 'prop-types';
import API from "../api/API";
import { withStyles } from "@material-ui/styles";
import formatPrice from "../utils/formatPrice";

const useStyles = makeStyles((theme) => ({
    container: {
        margin: 10,
        overflowY: "auto",
    },
    wrapperDetail: {
        backgroundColor: "white",
        overflowY: "auto",
    },
    wrapperTransaction: {
        overflowY: "auto",
        height: 700,
        borderBottomLeftRadius: "5px",
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
        display: "flex",
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: "#00bdb6",
        borderTopLeftRadius: "5px",
        borderTopRightRadius: "5px",
    }
}));

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
        <div className={clsx(classes.root, {
            [classes.active]: active,
        })}
        >
            {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
        </div>
    );
}

QontoStepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
};

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

const ModalInvoiceDetail = (props) => {
    const classes = useStyles();
    const [orderTransaction, setOrderTransaction] = useState([]);
    const [loading, setLoading] = useState(false);
    const [maxStep, setMaxStep] = useState(0);
    const [activeStep, setActiveStep] = useState(0);
    const [steps, setSteps] = useState(['IN_WAREHOUSE', 'TO_DELIVERY', 'DELIVERING', 'COMPLETED']);
    const order = props.invoice;

    useEffect(() => {
        setLoading(true);
        // const handleStep = (data) => {
        //     if (!data.delivery_status || !data.delivery_status.length) return;
        //     switch (data.delivery_status[0].status) {
        //         case 'IN_WAREHOUSE':
        //             setMaxStep(0);
        //             setActiveStep(0);
        //             return;
        //         case 'TO_DELIVERY':
        //             setMaxStep(1);
        //             setActiveStep(1);
        //             return;
        //         case 'DELIVERING':
        //             setMaxStep(2);
        //             setActiveStep(2);
        //             return;
        //         case 'COMPLETED':
        //             setMaxStep(3);
        //             setActiveStep(3);
        //             return;
        //         case 'CANCELLED':
        //             setMaxStep(4);
        //             setActiveStep(4);
        //             return;
        //         case 'RETURN':
        //             setMaxStep(5);
        //             setActiveStep(5);
        //             return;
        //         default:
        //             return
        //     }
        // };

        const fetchHistory = async () => {
            const response = await API.get(`${INVOICE_ENDPOINT}/${props.invoice.id}/histories`);
            const fetchData = await response.json();
            if (response.ok) {
                if (!fetchData.data && !fetchData.data.length) {
                    return;
                }
                setOrderTransaction(fetchData.data);
                // Tao cay
                // handleStep(fetchData.data);
                setLoading(false);
            }
        };

        fetchHistory();
    }, [props.invoice.id, props.invoice.code, props.invoice.provider.name]);

    useEffect(() => {
        if (orderTransaction.delivery_status && orderTransaction.delivery_status.length > 0) {
            let cloneDeliveryStatus = orderTransaction.delivery_status;
            cloneDeliveryStatus.reverse();

            let newStep = ['IN_WAREHOUSE'];
            let newMaxStep = 0;
            let newActiveStep = 0;

            for (let i = 0; i < cloneDeliveryStatus.length; i++) {
                const deliveryStatus = cloneDeliveryStatus[i];
                if (deliveryStatus.available) {
                    newStep = newStep.concat([deliveryStatus.status]);
                    newMaxStep++;
                    newActiveStep++;
                }
            }

            if (newStep[1] === 'IN_WAREHOUSE') {
                newStep = ['IN_WAREHOUSE', 'TO_DELIVERY', 'DELIVERING', 'COMPLETED'];
                newMaxStep = 0;
                newActiveStep = 0;
            }

            setSteps(newStep);
            setMaxStep(newMaxStep);
            setActiveStep(newActiveStep);
        }
    }, [orderTransaction])

    function getStepContent(label) {
        const delivery_status = orderTransaction.delivery_status;
        if (delivery_status && delivery_status.length) {
            return orderTransaction.delivery_status.map(transaction => {
                if (transaction.status === label) {
                    return (
                        <div>
                            <p style={{ marginTop: 5, marginBottom: 5 }}>
                                <span style={{ fontWeight: 'bold' }}>Created At: </span>
                                {datetimeUtils.DisplayDateTimeFormat(transaction.created_at)}
                            </p>
                            {
                                ((transaction.status === 'COMPLETED')
                                    || (transaction.status === 'FAIL_1')
                                    || (transaction.status === 'FAIL_2')
                                    || (transaction.status === 'FAIL_3')
                                    || (transaction.status === 'RETURN')
                                )
                                &&
                                <p style={{ marginTop: 5, marginBottom: 5 }}>
                                    <span style={{ fontWeight: 'bold' }}>Note: </span>
                                    {transaction.note ? transaction.note : 'none'}
                                </p>
                            }
                            {
                                ((transaction.status === 'FAIL_1')
                                    || (transaction.status === 'FAIL_2')
                                    || (transaction.status === 'FAIL_3')
                                    || (transaction.status === 'RETURN')
                                )
                                &&
                                <p style={{ marginTop: 5, marginBottom: 5 }}>
                                    <span style={{ fontWeight: 'bold' }}>Reason: </span>
                                    {transaction.reason ? transaction.reason : 'none'}
                                </p>
                            }
                            <p style={{ marginTop: 5, marginBottom: 5 }}>
                                <span style={{ fontWeight: 'bold' }}>Shipper Phone: </span>
                                {transaction.account ? transaction.account.phone : 'none'}
                            </p>
                            <p style={{ marginTop: 5, marginBottom: 5 }}>
                                <span style={{ fontWeight: 'bold' }}>Shipper Name: </span>
                                {transaction.account ? transaction.account.last_name + ' ' + transaction.account.first_name : 'none'}
                            </p>
                            {(transaction.status === 'COMPLETED') &&
                                <div style={{
                                    marginTop: 5,
                                    marginBottom: 5,
                                }}>
                                    {/* <div>
                                        <span style={{ fontWeight: 'bold' }}>Latitude: </span>
                                        <p style={{ display: 'inline-block' }}>{transaction.latitude}</p>
                                    </div>
                                    <div>
                                        <span style={{ fontWeight: 'bold' }}>Longitude: </span>
                                        <p style={{ display: 'inline-block' }}>{transaction.longitude}</p>
                                    </div> */}
                                    <span style={{ fontWeight: 'bold' }}>Evidence: </span>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        // justifyContent: 'space-evenly',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <a
                                                href={`${IMAGE_ENDPOINT}/${orderTransaction.receipt_order_image_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <img
                                                    src={`${IMAGE_ENDPOINT}/${orderTransaction.receipt_order_image_path}`}
                                                    width={120}
                                                    height={120}
                                                    alt='gds/evidence-order'
                                                />
                                            </a>
                                            <p>Order Image</p>
                                        </div>
                                        <div style={{
                                            marginLeft: 10
                                        }}>
                                            <a
                                                href={`${IMAGE_ENDPOINT}/${orderTransaction.receipt_sign_image_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <img
                                                    src={`${IMAGE_ENDPOINT}/${orderTransaction.receipt_sign_image_path}`}
                                                    width={120}
                                                    height={120}
                                                    alt='gds/evidence-order'
                                                />
                                            </a>
                                            <p>Sign Image</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    );
                }
                return null;
            });
        }
        return null;
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
                <div style={{
                    margin: "10px",
                    color: 'white'
                }}>
                    <h3>Order Information</h3>
                </div>
                <CloseIcon className={classes.closeBtn} onClick={() => props.onCloseModal()} />
            </div>
            <div className={classes.wrapperDetail}>
                <TableContainer>
                    <Table aria-label="customized table" >
                        <TableHead title="Shipper Detail" style={{ color: 'white' }}>
                            <TableRow>
                                <StyledTableCell align="center">ID</StyledTableCell>
                                <StyledTableCell align="center">Order Code</StyledTableCell>
                                <StyledTableCell align="center">Provider Name</StyledTableCell>
                                <StyledTableCell align="center">Receiver Name</StyledTableCell>
                                <StyledTableCell align="center">Customer Phone Number</StyledTableCell>
                                <StyledTableCell align="center">Receiver Phone Number</StyledTableCell>
                                <StyledTableCell align="center">Receiver Address</StyledTableCell>
                                <StyledTableCell align="center">Current Delivery Status</StyledTableCell>
                                <StyledTableCell align="center">Product Image</StyledTableCell>
                                <StyledTableCell align="center">Product Name</StyledTableCell>
                                <StyledTableCell align="center">Quantity</StyledTableCell>
                                <StyledTableCell align="center">Shipping Fee</StyledTableCell>
                                <StyledTableCell align="center">Total Amount</StyledTableCell>
                                <StyledTableCell align="center">From Date</StyledTableCell>
                                <StyledTableCell align="center">To Date</StyledTableCell>
                                <StyledTableCell align="center">Note</StyledTableCell>
                                <StyledTableCell align="center">Created At</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow>
                                <StyledTableCell align="center">{order.id}</StyledTableCell>
                                <StyledTableCell align="center">{order.code}</StyledTableCell>
                                <StyledTableCell align="center">{order.provider.name}</StyledTableCell>
                                <StyledTableCell align="center">{order.receiver_name}</StyledTableCell>
                                <StyledTableCell align="center">{order.customer_phone_number}</StyledTableCell>
                                <StyledTableCell align="center">{order.receiver_phone_number}</StyledTableCell>
                                <StyledTableCell align="center">{order.address}</StyledTableCell>
                                <StyledTableCell align="center" style={{
                                    color: order.current_delivery_status === 'COMPLETED'
                                        ? '#1e8101'
                                        : order.current_delivery_status === 'RETURN'
                                            ? 'red'
                                            : 'black'
                                }}>
                                    {order.current_delivery_status}
                                </StyledTableCell>
                                <StyledTableCell align="center"><img src={order.product_image} alt="product" width={60} height={60} /></StyledTableCell>
                                <StyledTableCell align="center">{order.product_name}</StyledTableCell>
                                <StyledTableCell align="center">{order.quantity}</StyledTableCell>
                                <StyledTableCell align="center">{formatPrice.format(order.shipping_fee)}</StyledTableCell>
                                <StyledTableCell align="center">{formatPrice.format(order.total_amount)}</StyledTableCell>
                                <StyledTableCell align="center">{datetimeUtils.DisplayDateTimeFormat(order.from_date)}</StyledTableCell>
                                <StyledTableCell align="center">{datetimeUtils.DisplayDateTimeFormat(order.to_date)}</StyledTableCell>
                                <StyledTableCell align="center">{order.note}</StyledTableCell>
                                <StyledTableCell align="center">{datetimeUtils.DisplayDateTimeFormat(order.created_at)}</StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div style={{
                height: '100%',
                backgroundColor: 'white',
                borderBottomLeftRadius: "5px",
                borderBottomRightRadius: "5px",
            }}>
                <div className={classes.wrapperTransaction}>
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
                                <Stepper activeStep={activeStep} alternativeLabel>
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
                                                            disabled={activeStep === maxStep}
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleNext}
                                                            className={classes.button}
                                                            style={{ color: (activeStep !== maxStep) && 'white' }}
                                                        >
                                                            Next
                                                    </Button>
                                                    </div>
                                                </div>
                                            </StepContent>
                                        </Step>
                                    ))}
                                </Stepper>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );
};
export default ModalInvoiceDetail;