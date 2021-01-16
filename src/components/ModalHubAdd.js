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
        display: "flex",
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: "#00bdb6",
        borderTopLeftRadius: "5px",
        borderTopRightRadius: "5px",
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

const ModalShipperAdd = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [id, setId] = useState(props.id ? props.id : '');
    const [name, setName] = useState(props.name ? props.name : '');
    const [radius, setRadius] = useState(props.radius ? props.radius : '');
    const [disabled, setDisabled] = useState(true);
    const [status, setStatus] = useState('Active');

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

    // For Adminstrator
    const handleAddHub = async () => {
        if (!id) {
            const responseHub = await API.post(`${HUB_ENDPOINT}`, {
                address: name,
                radius: radius.toString(),
                is_active: status === 'Active' ? true : false,
            });
            const fetchHubData = await responseHub.json();
            if (responseHub.ok) {
                dispatch(actCreateHub(fetchHubData.data));
                const response = await API.get(`${HUB_ENDPOINT}?page=1&limit=50&hub_manager_phone=none`);
                if (response.ok) {
                    const fetchHub = await response.json();
                    dispatch(actGetListHub(fetchHub.data));
                }
                setName('');
                setRadius('');
                setId('');
                props.onCLoseHub(true, true);
                return;
            } else {
                alert(fetchHubData.message);
                return;
            }
        } else {
            const responseUpdateStatusHub = await API.put(`${HUB_ENDPOINT}/${id}`, {
                name: name,
                radius: radius.toString(),
                is_active: status === 'Active' ? true : false,
            });

            const fetchData = await responseUpdateStatusHub.json();

            if (responseUpdateStatusHub.ok) {
                dispatch(actCreateHub(fetchData.data));
                const responseFetchHub = await API.get(`${HUB_ENDPOINT}?page=1&limit=50&hub_manager_phone=none`);
                if (responseFetchHub.ok) {
                    const fetchHub = await responseFetchHub.json();
                    dispatch(actGetListHub(fetchHub.data));
                }
                setName('');
                setRadius('');
                setId('');
                props.onCLoseHub(true, false);
            } else {
                alert(fetchData.message);
                return;
            }
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
                <div style={{ margin: "10px", color: 'white' }}>
                    <h3>Create Hub</h3>
                </div>
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
                                    <MenuItem value={`Active`}>Active</MenuItem>
                                    <MenuItem value={`Deactive`}>Deactive</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Divider />
                        <Grid container
                            direction="row"
                            justify="flex-end"
                            alignItems="flex-end">
                            <Grid item xs={6} sm={3}>
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
