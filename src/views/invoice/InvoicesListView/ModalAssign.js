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
import { SHIPPER_ENDPOINT } from '../../../api/endpoint';

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
        height: '250px',
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
    },
}));

const ModalAssign = ({
    onInvisibleModel,
    onVisibleModal,
    onHandleAssign
}) => {
    const classes = useStyles();
    const [shippers, setShippers] = useState([]);
    const [selectedShipper, setSelectedShipper] = useState(null);

    const fetchShipper = async () => {
        const response = await API.get(SHIPPER_ENDPOINT);
        const json = await response.json();

        if (!json.data.length) {
            return;
        }

        setShippers(json.data);
    };

    useEffect(() => {
        fetchShipper();
    }, []);

    const handleChange = (event) => {
        setSelectedShipper(event.target.value);
    };

    const handleSubmit = () => {
        if (!selectedShipper) {
            alert('Please select shipper!');
        }
        onHandleAssign(selectedShipper);
    };

    return (
        <div className={classes.root}>
            <List className={classes.container} subheader={<li />}>
                <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">List Shipper</FormLabel>
                    <RadioGroup
                        aria-label="List shipper"
                        onChange={handleChange}
                        value={selectedShipper}
                    >
                        {shippers.map((shipper, index) => (
                            <FormControlLabel
                                key={index}
                                value={shipper.phone}
                                control={<Radio />}
                                label={shipper.last_name + " " + shipper.first_name}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            </List>
            <Divider />
            <div className={classes.actions}>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                    style={{ color: 'white', margin: 10 }}
                >
                    Submit
                 </Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => onInvisibleModel()}
                    style={{ color: 'white', margin: 10 }}
                >
                    Close
             </Button>
            </div>
        </div>
    );
};

export default ModalAssign;