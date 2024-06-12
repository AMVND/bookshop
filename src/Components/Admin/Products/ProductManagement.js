import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Avatar, CardHeader, Stack, TextField, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
//Icon
import { Alert } from "@mui/material";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import BorderColorIcon from "@mui/icons-material/BorderColor";
//item menu
import IconButton from "@mui/material/IconButton";
//Paginavtion
import TablePagination from "@mui/material/TablePagination";
import { formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";
import { VND } from "../../Unity/VND";
import API from "../../Api/Api";
import SnackbarMessage from "../../Layout/SnackbarMessage";
import axios from "axios";

function ProductManagement() {
    // data product-category
    const [data, setData] = React.useState([]);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("warning");
    const [category, setCategory] = React.useState([]);

    // Trang hiện tại của page
    const [page, setPage] = React.useState(0);

    // Số sản phẩm được hiển thị
    const [pageSize, setPageSize] = React.useState(5);
    const [field, setField] = React.useState("id");
    const [sort, setSort] = React.useState("ASC");
    const [username, setUsername] = React.useState("");
    const [ptitle, setPtitle] = React.useState("");
    const [ctitle, setCtitle] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [vendor] = React.useState("");
    const [totalElements, setTotalElements] = React.useState("");

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        loadDataProduct();
    };

    const handleChangePageSize = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        setPage(0);
        loadDataProduct();
    };

    const handleChange = (event) => {
        setStatus(event.target.value);
        loadDataProduct();
    };

    // Đóng snackbar
    const snackbarClose = () => {
        setSnackbarOpen(false);
    };
    const loadDataCategory = React.useCallback(() => {
        axios
            .get(API + "/category/api")
            .then((response) => {
                setCategory(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const loadDataProduct = React.useCallback(() => {
        const queryParams = new URLSearchParams({
            field: field,
            sort: sort,
            username: username,
            ptitle: ptitle,
            ctitle: ctitle,
            status: status,
            vendor: vendor,
        }).toString();

        axios
            .get(`${API}/product/auth/admin/${page}/${pageSize}?${queryParams}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                console.log("product ", response.data);
                setData(response.data.response.content);
                setTotalElements(response.data.response.totalElements);
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("error! không load được dữ liệu product");
            });
    }, [ctitle, field, page, pageSize, ptitle, sort, status, username, vendor]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setPage(0);
        loadDataProduct();
    };
    React.useEffect(() => {
        loadDataProduct();
        loadDataCategory();
    }, [loadDataProduct, loadDataCategory]);
    return (
        <div>
            <SnackbarMessage open={snackbarOpen} severity={snackbarSeverity} message={snackbarMsg} onClose={snackbarClose} />
            <section className="h-100 gradient-custom col-lg-12">
                <div className="container py-5">
                    <div className="row d-flex justify-content-center my-4">
                        <div>
                            <div className="card mb-4">
                                <div className="card-header d-flex py-3 justify-content-between ">
                                    <h5 className="mt-1">Quản lý sản phẩm</h5>
                                    <strong>{data.length} sản phẩm</strong>
                                </div>
                            </div>
                            <div className="card mb-4">
                                <Box
                                    component="form"
                                    onSubmit={handleSubmit}
                                    className="card-body row d-flex justify-content-between"
                                >
                                    <Box className="my-2">
                                        <FormControl className="col-lg-3 col-auto px-2 my-1">
                                            <Typography>Tìm kiếm theo sản phẩm</Typography>
                                            <TextField
                                                id="outlined-basic"
                                                name="productTitle"
                                                label="Tìm kiếm title của sản phẩm"
                                                variant="outlined"
                                                onChange={(e) => setPtitle(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl className="col-lg-2 col-auto px-2 my-1">
                                            <Typography>Trạng thái sản phẩm</Typography>
                                            <Select
                                                inputProps={{ "aria-label": "Without label" }}
                                                value={status}
                                                displayEmpty
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="">
                                                    <em>Tất cả</em>
                                                </MenuItem>
                                                <MenuItem value={0}>Chờ xét duyệt</MenuItem>
                                                <MenuItem value={1}>Được đăng bán</MenuItem>
                                                <MenuItem value={2}>Chưa đăng bán</MenuItem>
                                                <MenuItem value={3}>Ngưng bán</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl className="col-lg-2 col-md-2 col-4 my-1">
                                            <Typography>Loại sản phẩm</Typography>
                                            <Select
                                                inputProps={{ "aria-label": "Without label" }}
                                                value={ctitle}
                                                displayEmpty
                                                onChange={(e) => {
                                                    setCtitle(e.target.value);
                                                    loadDataProduct();
                                                }}
                                            >
                                                <MenuItem value="">
                                                    <em>Category All</em>
                                                </MenuItem>
                                                {category.map((item, i) => (
                                                    <MenuItem value={item.id} key={i}>
                                                        {item.title}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Box className="my-2">
                                        <Typography>Nhà cung cấp</Typography>
                                        <FormControl className="col-lg-3 col-auto px-2 my-1">
                                            <TextField
                                                id="outlined-basic"
                                                name="categoryTitle"
                                                label="Tìm kiêm theo tên ncc"
                                                variant="outlined"
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                        </FormControl>
                                    </Box>
                                    <Box className="w-100 my-2">
                                        <Typography>Sắp xếp</Typography>
                                        <FormControl className="col-lg-3 col-auto px-2 my-1">
                                            <Select
                                                inputProps={{ "aria-label": "Without label" }}
                                                value={field}
                                                displayEmpty
                                                onChange={(e) => {
                                                    setField(e.target.value);
                                                    loadDataProduct();
                                                }}
                                            >
                                                <MenuItem value={"id"}>Id</MenuItem>
                                                <MenuItem value={"title"}>Tên sản phẩm</MenuItem>
                                                <MenuItem value={"price"}>Giá</MenuItem>
                                                <MenuItem value={"discount"}>Giảm giá</MenuItem>
                                                <MenuItem value={"quantity"}>Số lượng</MenuItem>
                                                <MenuItem value={"created_at"}>Thời gian tạo</MenuItem>
                                                <MenuItem value={"updated_at"}>Thời gian cập nhật</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl className="col-lg-3 col-auto px-2 my-1">
                                            <Select
                                                inputProps={{ "aria-label": "Without label" }}
                                                value={sort}
                                                displayEmpty
                                                onChange={(e) => {
                                                    setSort(e.target.value);
                                                    loadDataProduct();
                                                }}
                                            >
                                                <MenuItem value={"ASC"}>Tăng dần</MenuItem>
                                                <MenuItem value={"DESC"}>Giảm dần</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    <Box className="my-2">
                                        <FormControl className="px-2">
                                            <button type="submit" className="btn btn-dark text-nowrap">
                                                Search
                                            </button>
                                        </FormControl>
                                    </Box>
                                </Box>
                            </div>
                            <div className="card mb-4">
                                <Box sx={{ width: "100%" }}>
                                    <Paper sx={{ width: "100%", mb: 2 }}>
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className="text-nowrap">Id</TableCell>
                                                        <TableCell className="text-nowrap">Sản phẩm</TableCell>
                                                        <TableCell className="text-nowrap">User</TableCell>
                                                        <TableCell className="text-nowrap" align="right">
                                                            Giá (₫)
                                                        </TableCell>
                                                        <TableCell className="text-nowrap" align="right">
                                                            Giảm giá (%)
                                                        </TableCell>
                                                        <TableCell className="text-nowrap" align="right">
                                                            Số lượng
                                                        </TableCell>

                                                        <TableCell className="text-nowrap">Time</TableCell>
                                                        <TableCell className="text-nowrap" align="center">
                                                            Status
                                                        </TableCell>

                                                        <TableCell className="text-nowrap" align="center">
                                                            Action
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data.length !== 0 ? (
                                                        data.map((item, i) => (
                                                            <TableRow
                                                                key={item.id}
                                                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                                            >
                                                                <TableCell component="th" scope="row">
                                                                    {item.id}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <CardHeader
                                                                        avatar={
                                                                            <Avatar
                                                                                alt="Remy Sharp"
                                                                                src={API + item.photos}
                                                                                variant="rounded"
                                                                                sx={{ width: 56, height: 56 }}
                                                                            />
                                                                        }
                                                                        style={{ minWidth: "200px", maxWidth: "400px" }}
                                                                        title={item.title}
                                                                        sx={{ p: 0 }}
                                                                    />
                                                                </TableCell>

                                                                <TableCell className="text-nowrap">
                                                                    {item.user.firstName + " " + item.user.lastName}
                                                                </TableCell>

                                                                <TableCell align="right">{VND.format(item.price)}</TableCell>
                                                                <TableCell align="right">{item.discount}(%)</TableCell>
                                                                <TableCell align="right">{item.quantity}</TableCell>

                                                                <TableCell className="text-nowrap">
                                                                    {formatDistanceToNow(new Date(item.updatedAt), {
                                                                        locale: vi,
                                                                        addSuffix: true,
                                                                    })}
                                                                </TableCell>
                                                                <TableCell className="text-nowrap" align="center">
                                                                    {item.status === 0 ? (
                                                                        <span className="badge bg-warning text-capitalize ms-2">
                                                                            Chờ xét duyệt
                                                                        </span>
                                                                    ) : null}
                                                                    {item.status === 1 ? (
                                                                        <span className="badge bg-info text-capitalize ms-2">
                                                                            Được đăng bán
                                                                        </span>
                                                                    ) : null}
                                                                    {item.status === 2 ? (
                                                                        <span className="badge bg-success text-capitalize ms-2">
                                                                            Chưa đăng bán
                                                                        </span>
                                                                    ) : null}
                                                                    {item.status === 3 ? (
                                                                        <span className="badge bg-danger text-capitalize ms-2">
                                                                            Ngưng bán
                                                                        </span>
                                                                    ) : null}
                                                                </TableCell>

                                                                <TableCell align="center" className="row  ">
                                                                    <div className="d-flex">
                                                                        <Link to={`/product/${item.slug}`}>
                                                                            <IconButton color="primary" title="View">
                                                                                <CalendarViewMonthIcon />
                                                                            </IconButton>
                                                                        </Link>
                                                                        <Link to={`/admin/product/${item.id}`}>
                                                                            <IconButton color="success" title="Edit">
                                                                                <BorderColorIcon />
                                                                            </IconButton>
                                                                        </Link>
                                                                        {/* <IconButton color="error">
                                                                            <DeleteIcon />
                                                                        </IconButton> */}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            {/* Khi không có sản phẩm */}
                                                            <TableCell colSpan={"100%"}>
                                                                <Stack sx={{ width: "100%" }} spacing={2}>
                                                                    <Alert severity="info">No Data !</Alert>
                                                                </Stack>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Paper>
                                </Box>
                                <div className="mt-2 d-flex justify-content-end">
                                    <TablePagination
                                        count={Number(totalElements)}
                                        rowsPerPageOptions={[5, 10, 25, { label: "All", value: Number(totalElements) }]}
                                        page={page}
                                        component="div"
                                        onPageChange={handleChangePage}
                                        rowsPerPage={pageSize}
                                        onRowsPerPageChange={handleChangePageSize}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ProductManagement;