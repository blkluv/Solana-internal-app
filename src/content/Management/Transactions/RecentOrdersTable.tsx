import {
  Box,
  Card,
  CardHeader,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import PropTypes from 'prop-types';
import { ChangeEvent, useState } from 'react';

import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';

const applyPagination = (allProducts, page: number, limit: number) => {
  return allProducts?.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable = () => {
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery(['products'], async () =>
    axios.get('https://ledger.flitchcoin.com/all/product', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
  );

  console.log({ products });

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const paginatedProducts = applyPagination(products?.data, page, limit);

  const theme = useTheme();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  async function handleDeleteProduct(uuid: string) {
    await axios.delete(`https://ledger.flitchcoin.com/product?uuid=${uuid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    queryClient.invalidateQueries({ queryKey: ['products'] });
  }

  return (
    <Card>
      <CardHeader title="Recent Orders" />

      <Divider />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Product ID</TableCell>
              <TableCell align="right">Price (USD)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts?.map((product) => (
              <TableRow hover key={product.uuid}>
                <TableCell>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color="text.primary"
                    gutterBottom
                    noWrap
                  >
                    {product.name}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color="text.primary"
                    gutterBottom
                    noWrap
                  >
                    {product.product_id}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color="text.primary"
                    gutterBottom
                    noWrap
                  >
                    {product.price}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="Delete Product" arrow>
                    <IconButton
                      sx={{
                        '&:hover': { background: theme.colors.error.lighter },
                        color: theme.palette.error.main
                      }}
                      color="inherit"
                      size="small"
                      onClick={() => handleDeleteProduct(product.uuid)}
                    >
                      <DeleteTwoToneIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Filter */}
      <Box p={2}>
        <TablePagination
          component="div"
          count={products?.data?.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

RecentOrdersTable.propTypes = {
  cryptoOrders: PropTypes.array.isRequired
};

RecentOrdersTable.defaultProps = {
  cryptoOrders: []
};

export default RecentOrdersTable;
