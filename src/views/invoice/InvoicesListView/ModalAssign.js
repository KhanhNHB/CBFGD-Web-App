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
    List
} from '@material-ui/core';
import API from '../../../api/API';
import { SHIPPER_ENDPOINT } from '../../../api/endpoint';

const useStyles = makeStyles((theme) => ({
    root: {
        maxHeight: 200
    },
    container: {
        width: '100%',
        backgroundColor: 'white',
        position: 'relative',
        overflow: 'auto',
        maxHeight: '100%',
    },
    formControl: {
        padding: 10,
        top: 10,
        maxHeight: '50%',
    }
}));

const ModalAssign = ({ onInvisibleModel, onVisibleModal, onHandleAssign }) => {
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
        <>
            <List className={classes.container} subheader={<li />}>
                <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">List Shipper</FormLabel>
                    <RadioGroup
                        aria-label="List shipper"
                        onChange={handleChange}
                    >
                        {shippers.map((shipper, index) => (
                            <FormControlLabel key={index} value={shipper.username} control={<Radio />} label={shipper.last_name + shipper.first_name} />
                        ))}
                    </RadioGroup>
                </FormControl>
            </List>
            <Divider />
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
        </>
    );
};

export default ModalAssign;
