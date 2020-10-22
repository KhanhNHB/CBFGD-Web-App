import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  makeStyles
} from '@material-ui/core';
import { SHIPPER_ENDPOINT } from '../../../api/endpoint';
import { useDispatch, useSelector } from 'react-redux';
import { actGetAllShipper } from '../../../actions';
import API from '../../../api/API';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, ...rest }) => {
  const classes = useStyles();
  // const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();
  const shippers = useSelector(state => state.shippers.listShippers);

  // const handleSelectAll = (event) => {
  //   let newSelectedCustomerIds;

  //   if (event.target.checked) {
  //     newSelectedCustomerIds = shippers.map((customer) => customer.id);
  //   } else {
  //     newSelectedCustomerIds = [];
  //   }

  //   setSelectedCustomerIds(newSelectedCustomerIds);
  // };

  // const handleSelectOne = (event, id) => {
  //   const selectedIndex = selectedCustomerIds.indexOf(id);
  //   let newSelectedCustomerIds = [];

  //   if (selectedIndex === -1) {
  //     newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
  //   } else if (selectedIndex === 0) {
  //     newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
  //   } else if (selectedIndex === selectedCustomerIds.length - 1) {
  //     newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelectedCustomerIds = newSelectedCustomerIds.concat(
  //       selectedCustomerIds.slice(0, selectedIndex),
  //       selectedCustomerIds.slice(selectedIndex + 1)
  //     );
  //   }

  //   setSelectedCustomerIds(newSelectedCustomerIds);
  // };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  useEffect(() => {
    const getAllShippers = async () => {
      const response = await API.get(SHIPPER_ENDPOINT);
      console.log(response.ok);
      if (response.ok) {
        const fetchData = await response.json();
        console.log(fetchData);
        dispatch(actGetAllShipper(fetchData.data));
      }

    }
    getAllShippers();
  }, [])


  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box>
          <Table minWidth={1500}>
            <TableHead>
              <TableRow>
                <TableCell>
                  No.
                </TableCell>
                <TableCell>
                  Full Name
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  Username
                </TableCell>
                <TableCell>
                  Phone Number
                </TableCell>
                <TableCell>
                  Identify Number
                </TableCell>
                <TableCell>
                  License Number
                </TableCell>
                <TableCell>
                  Gender
                </TableCell>
                <TableCell>
                  Create At
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shippers.map((shipper, index) => (
                <TableRow
                  hover
                  key={shipper.id}>
                  <TableCell>
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    {shipper.last_name} {shipper.first_name}
                  </TableCell>
                  <TableCell>
                    {shipper.email}
                  </TableCell>
                  <TableCell>
                    {shipper.username}
                  </TableCell>
                  <TableCell>
                    {shipper.phone}
                  </TableCell>
                  <TableCell>
                    {shipper.identify_number}
                  </TableCell>
                  <TableCell>
                    {shipper.license_number}
                  </TableCell>
                  <TableCell>
                    {shipper.gender}
                  </TableCell>
                  <TableCell>
                    {shipper.created_at}
                  </TableCell>
                  <TableCell>
                    {shipper.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={shippers.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  shippers: PropTypes.array.isRequired
};

export default Results;
