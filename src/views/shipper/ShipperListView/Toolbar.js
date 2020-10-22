import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import ModalShipperAdd from '../../../components/ModalShipperAdd';
import Modal from 'react-modal';

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  modal: {
    width: '60%',
    height: '60%',
    marginLeft: 350,
    marginTop: 50,
  }
}));

const Toolbar = ({ className, ...rest }) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);

  const openModalForm = () => {
    setModalOpen(true);
  }

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <Button className={classes.importButton}>
          Import
        </Button>
        <Button className={classes.exportButton}>
          Export
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={openModalForm}
          style={{ color: 'white' }}
        >
          Add Shipper
        </Button>
      </Box>

      <Modal
        isOpen={modalOpen}
      >
        <div className={classes.modal}>
          <ModalShipperAdd onCloseModal={() => setModalOpen(false)} />
        </div>
      </Modal>

      <Box mt={3}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Search Shipper..."
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
