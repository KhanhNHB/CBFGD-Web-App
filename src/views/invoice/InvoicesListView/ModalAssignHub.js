import React, { useEffect, useState } from 'react';
import {
    Button,
    Divider,
    makeStyles,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    List,
} from '@material-ui/core';
import API from '../../../api/API';
import { HUB_ENDPOINT } from '../../../api/endpoint';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '80%',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: '5px',
    },
    container: {
        width: '100%',
        backgroundColor: 'white',
        position: 'relative',
        overflowY: 'auto',
    },
    formControl: {
        padding: 10,
        top: 10,
        maxHeight: '50%',
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
    }
}));

const ModalAssignHub = ({
    onInvisibleModel,
    onHandleAssign,
    onSelectedInvoice,
    onCurrentHub

}) => {
    const classes = useStyles();

    const [hubs, setHubs] = useState([]);
    const [selectedHub, setSelectedHub] = useState(onCurrentHub);

    const fetchHub = async () => {
        const response = await API.get(`${HUB_ENDPOINT}/recommend/orders/${onSelectedInvoice}`);
        if (response.ok) {
            const fetchData = await response.json();
            if (!fetchData.data.length) {
                return;
            }
            setHubs(fetchData.data);
        }
    };

    useEffect(() => {
        fetchHub();
    }, []);

    const handleChange = (event) => {
        setSelectedHub(+event.target.value);
    };

    const handleSubmit = () => {
        if (!selectedHub) {
            alert('Choice hub to submit, Please try again!');
            return;
        }
        if (selectedHub === onCurrentHub) {
            alert('It is current hub. Please try again!');
            return;
        }
        onHandleAssign(selectedHub);
        // setSelectedHub(null);
    };

    const value = (item) => {
        return (
            <>
                <div><span style={{ fontWeight: 'bold' }}>Address: </span>{item.hub.address}</div>
                <div><span style={{ color: 'red' }}>Distance To Hub: </span><span style={{ fontWeight: 'bold' }}>{item.distance} Km</span></div>
            </>
        );
    }

    return (
        <>
            <div className={classes.root}>
                <List className={classes.container} subheader={<li />}>
                    <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend">List Hub</FormLabel>
                        <RadioGroup
                            aria-label="List hubs"
                            onChange={handleChange}
                            value={+selectedHub}
                        >
                            {hubs.map((item, index) => {
                                return <FormControlLabel
                                    key={index}
                                    value={+item.hub.id}
                                    control={<Radio />}
                                    label={value(item)}
                                    style={{ padding: 10 }}
                                />
                            })}
                        </RadioGroup>
                    </FormControl>
                </List>
                <Divider />
                <div className={classes.actions}>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleSubmit}
                        style={{ color: 'white', margin: 10 }}>
                        Submit
                                </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => onInvisibleModel()}
                        style={{ color: 'white', margin: 10 }}>
                        Close
                                </Button>
                </div>
            </div>
        </>
    );
};

export default ModalAssignHub;