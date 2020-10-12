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
  makeStyles,
  Input
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  }
}));

const Toolbar = ({ className, ...rest }) => {
  const [fileSelected, setFileSelected] = useState(null);
  const classes = useStyles();
  const onFileChange = (e) =>{
    const file = e.target.files[0];
    setFileSelected({fileSelected: file});
  }
  const onFileUpload = () =>{
    const formData = new FormData();
    formData.append("file",fileSelected);
    console.log(fileSelected);
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
          <Input type="file" onChange={onFileChange}/>
          <Button className={classes.importButton} onClick={onFileUpload}>
            Import Excel
          </Button>

        <Button
          color="primary"
          variant="contained"
        >
          Add Invoice
        </Button>
      </Box>
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
                placeholder="Search Invoice..."
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
