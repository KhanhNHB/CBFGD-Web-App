import React, { useEffect, useState } from 'react';
import {
    Button,
    Divider,
    Container,
    TextField,
    Grid,
    makeStyles,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core';
import API from '../api/API';
import { HUB_ENDPOINT } from '../api/endpoint';
import { useDispatch } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import { actCreateHub, actGetListHub } from '../actions';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({
    container: {
        width: "50%",
        height: "70%",
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

const status = [
    { title: 'Available' },
    { title: 'Terminal' },
];

const ModalShipperAdd = (props, { values,
    errors,
    touched,
    handleSubmit,
    handleBlur,
    handleChange,
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [name, setName] = useState(props.name ? props.name : '');
    const [radius, setRadius] = useState(props.radius ? props.radius : '');
    const [statusHub, setStatusHub] = useState(props.status);
    const [disabled, setDisabled] = useState(true);
    const [status, setStatus] = useState('Available');

    const handleChangeStatus = (event) => {
        setStatus(event.target.value);
    };

    useEffect(() => {
        if (name && radius) {
            setDisabled(false);
        }
        if (!name || !radius) {
            setDisabled(true);
        }
    }, [name, radius, status]);

    const handleAddHub = async () => {
        const response = await API.post(HUB_ENDPOINT, {
            name: name,
            radius: radius.toString(),
            status: statusHub,
        });

        const fetchData = await response.json();
        if (!fetchData.message) {
            dispatch(actCreateHub(fetchData.data));
            const response = await API.get(`${HUB_ENDPOINT}`);
            if (response.ok) {
                const fetchHub = await response.json();
                dispatch(actGetListHub(fetchHub.data));
            }
            setName('');
            setRadius('');
            props.onCLoseHub();
        }
    };

    const handleChangeRadius = (e) => {
        var pattern = /^(?!(0))[0-9]+$|^$/g;
        if (pattern.test(e.target.value)) {
            setRadius(e.target.value);
        }
    };

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
                                placeholder="Address of Hub (*)"
                                name="name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                placeholder="Radius of Hub (*)"
                                name="radius"
                                value={radius}
                                onChange={e => handleChangeRadius(e)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={status}
                                    onChange={handleChangeStatus}
                                    label="Status"
                                >
                                    <MenuItem value={`Available`}>Available</MenuItem>
                                    <MenuItem value={`Terminal`}>Terminal</MenuItem>
                                </Select>
                            </FormControl>
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
                                    style={{ color: 'white' }}
                                    disabled={disabled}
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
