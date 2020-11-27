import React, { useState } from 'react';
import {
    Button,
    Divider,
    Container,
    TextField,
    Grid,
    makeStyles,
} from '@material-ui/core';
import API from '../api/API';
import { HUB_ENDPOINT } from '../api/endpoint';
import { useDispatch } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import { actCreateHub } from '../actions';
const useStyles = makeStyles((theme) => ({
    container: {
        width: "50%",
        height: "50%",
        position: "absolute",
        marginTop: "10%",
        left: "50%",
        top: "20%",
        transform: "translate(-50%, -50%)",
        padding: "10px",
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
    wrapperLeft: {
        backgroundColor: "white",
        width: "100%",
        height: "50%",
        float: "left",
        padding: 20,
        overflowY: "auto",
        borderRight: "1px solid #e0e0e0",
        borderBottom: "3px solid #e0e0e0",
        borderBottomLeftRadius: "5px",
    },
}));
const ModalShipperAdd = (props, { values,
    errors,
    touched,
    handleSubmit,
    handleBlur,
    handleChange,
}) => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [radius, setRadius] = useState('');

    const classes = useStyles();
    const handleAddHub = async () => {
        const response = await API.post(HUB_ENDPOINT, {
            name: name,
            phone: radius,
        });
        const fetchData = await response.json();
        if (!fetchData.message) {
            dispatch(actCreateHub(fetchData.data));
            props.onCLoseHub();
        }

    }

    return (
        <div className={classes.container}>
            <div className={classes.detailHeader}>
                <CloseIcon
                    className={classes.closeBtn}
                    onClick={() => props.onCLoseHub()}
                />
            </div>
            <div className={classes.wrapperLeft}>
                <Container maxWidth="md">
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                placeholder="Name (*)"
                                name="name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                placeholder="Add Radius of Hub (*)"
                                name="phone"
                                value={radius}
                                onChange={e => setRadius(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Divider />
                        <Grid container
                            direction="row"
                            justify="flex-end"
                            alignItems="flex-end">
                            <Grid xs={6} sm={3}>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={handleAddHub}
                                >
                                    Save Hub
                        </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </div>
    );
};


export default ModalShipperAdd;
