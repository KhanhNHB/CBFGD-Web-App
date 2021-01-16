import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import datetimeUtils from '../utils/datetimeUtils';
import formatPrice from '../utils/formatPrice';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  makeStyles,
  TableSortLabel,
} from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import { INVOICE_PRIORITY } from '../common';

const columns = [
  { id: 'id', label: 'Id', minWidth: 120, align: 'left' },
  { id: 'code', label: 'Code Order', minWidth: 170, align: 'left' },
  { id: 'receiver_name', label: 'Receiver Order', minWidth: 240, align: 'left' },
  { id: 'customer_phone_number', label: 'Customer Phone Number', minWidth: 220, align: 'left' },
  { id: 'receiver_phone_number', label: 'Receiver Phone Number', minWidth: 220, align: 'left' },
  { id: 'address', label: 'Receiver Address', minWidth: 350, align: 'left' },
  { id: 'priority', label: 'Priority', minWidth: 80, align: 'left' },
  { id: 'note', label: 'Note', minWidth: 120, align: 'left' },
  { id: 'product_name', label: 'Product Name', minWidth: 200, align: 'left' },
  { id: 'product_image', label: 'Phoduct Image', minWidth: 200, align: 'left' },
  { id: 'total_amount', label: 'Total Amount', minWidth: 170, align: 'left' },
  { id: 'quantity', label: 'Quantity', minWidth: 80, align: 'left' },
  { id: 'shipping_fee', label: 'Shipping Fee', minWidth: 170, align: 'left' },
  { id: 'from_date', label: 'From Date', minWidth: 200, align: 'left' },
  { id: 'to_date', label: 'To Date', minWidth: 200, align: 'left' },
  { id: 'created_at', label: 'Created At', minWidth: 200, align: 'left' },
  { id: 'is_active', label: 'Status Order', minWidth: 170, align: 'left' },
  { id: 'current_delivery_status', label: 'Current Delivery Status', minWidth: 220, align: 'left' },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const EnhancedTableHead = (props) => {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((headCell) => (
          <TableCell
            key={headCell.id}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            align={headCell.align}
            style={{ minWidth: headCell.minWidth }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  },
  container: {
    maxHeight: 440,
  },
  modal: {
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiCircularProgress-root': {
      outline: 'none'
    },
  },
}));

const Bags = ({ bag }) => {
  const classes = useStyles();
  let totalPage = 0;
  const [page, setPage] = useState(totalPage);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const _rowStatus = (backgroundColor, value) => {
    return (<div style={{
      backgroundColor: backgroundColor,
      color: 'white',
      width: 85,
      padding: 8,
      borderRadius: 3,
      textAlign: 'center'
    }}>
      {value}
    </div>);
  }

  const _rowPriority = (backgroundColor, value) => {
    return (<div style={{
      backgroundColor: backgroundColor,
      color: 'white',
      width: 85,
      padding: 8,
      borderRadius: 3,
      textAlign: 'center'
    }}>
      {value ? INVOICE_PRIORITY.EXPRESS : INVOICE_PRIORITY.STANDARD}
    </div>);
  }

  const _hanleRowTableData = (column, value) => {
    switch (column) {
      case 'priority':
        return (value ? _rowPriority("#d9534f", value) : _rowPriority("#1e8101", value));
      case 'from_date':
        return datetimeUtils.DisplayDateTimeFormat(new Date(value));
      case 'to_date':
        return datetimeUtils.DisplayDateTimeFormat(new Date(value));
      case 'total_amount':
        return formatPrice.format(value) + " VND";
      case 'shipping_fee':
        return formatPrice.format(value) + " VND";
      case 'is_active':
        return (value ? _rowStatus("#1e8101", 'ACTIVE') : _rowStatus("#d9534f", 'DEACTIVE'));
      case 'product_image':
        return (<img alt="Product" style={{ height: 60, width: 60 }} src={value} />);
      case 'created_at':
        return datetimeUtils.DisplayDateTimeFormat(value);
      case 'current_delivery_status':
        return (
          <div style={{
            width: 120,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00aff0',
            color: 'white',
            height: 36,
            borderRadius: 3,
            fontWeight: 'bold'
          }}>
            {value}
          </div>
        );
      default:
        return value;
    }
  };

  return (
    <>
      <Card className={clsx(classes.root)}>
        <Box>
          <TableContainer className={classes.container}>
            <Table aria-label="sticky table">
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <>
                <TableBody>
                  {(bag && bag.delivery_status.length)
                    ? stableSort(bag.delivery_status, getComparator(order, orderBy))
                      .map((item, index) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={item.order.id}
                            style={{ backgroundColor: item.order.is_assign && 'whitesmoke' }}
                          >
                            {columns.map((column, index) => {
                              const value = _hanleRowTableData(column.id, item.order[column.id]);
                              return (
                                <TableCell
                                  key={index}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth }}
                                >
                                  {value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })
                    : null
                  }
                </TableBody>
              </>
            </Table>
          </TableContainer>
        </Box>
        <TablePagination
          rowsPerPageOptions={[50, 100]}
          component="div"
          count={(bag && bag.delivery_status.length) ? bag.delivery_status.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
};

Bags.propTypes = {
  className: PropTypes.string,
  invoices: PropTypes.array.isRequired
};

export default Bags;