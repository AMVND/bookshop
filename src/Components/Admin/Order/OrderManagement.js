import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Avatar, CardHeader, Input, Stack, TextField, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
//Icon

import { Alert } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
//item menu
import IconButton from "@mui/material/IconButton";
//Paginavtion
import TablePagination from "@mui/material/TablePagination";

import { VND } from "../../Unity/VND";
import { format } from "date-fns";
import API from "../../Api/Api";
import SnackbarMessage from "../../Layout/SnackbarMessage";
import axios from "axios";

function OrderManagement() {
    // data product-category
    const [data, setData] = React.useState([]);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("warning");

    // Trang hiện tại của page
    const [page, setPage] = React.useState(0);

    // Số sản phẩm được hiển thị
    const [pageSize, setPageSize] = React.useState(5);
    const [field, setField] = React.useState("created_at");
    const [sort, setSort] = React.useState("DESC");
    const [cartId] = React.useState("");
    const [userId] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [mobile, setMobile] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [address] = React.useState("");
    const [city] = React.useState("");
    const [country] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [totalElements, setTotalElements] = React.useState("");

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        loadDataOrder();
    };

    const handleChangePageSize = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        setPage(0);
        loadDataOrder();
    };
    const handleChangeStatus = (event) => {
        setStatus(event.target.value);
        loadDataOrder();
    };
    const handleChangeField = (event) => {
        setField(event.target.value);
        loadDataOrder();
    };
    const handleChangeSort = (event) => {
        setSort(event.target.value);
        loadDataOrder();
    };
    //
    
    
    
    // Đóng snackbar
    const snackbarClose = () => {
        setSnackbarOpen(false);
    };

    const loadDataOrder = React.useCallback(() => {
        axios
            .get(
                `${API}/order/auth/admin/${page}/${pageSize}?field=${field}&sort=${sort}&cartId=${cartId}&userId=${userId}&username=${username}&mobile=${mobile}&email=${email}&address=${address}&city=${city}&country=${country}&status=${status}`,
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            )
            .then((result) => {
                console.log("order", result);
                setData(result.data.response.content);
                setTotalElements(result.data.response.totalElements);
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("error! không load được dữ liệu order");
            });
    }, [address, cartId, city, country, email, field, mobile, page, pageSize, sort, status, userId, username]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setPage(0);
        loadDataOrder();
    };
    React.useEffect(() => {
        loadDataOrder();
    }, [loadDataOrder]);
    return (
        <div>
            <SnackbarMessage open={snackbarOpen} severity={snackbarSeverity} message={snackbarMsg} onClose={snackbarClose} />
            <section className="h-100 gradient-custom col-lg-12">
                <div className="container py-5">
                    <div className="row d-flex justify-content-center my-4">
                        <div>
                            <div className="card mb-4">
                                <div className="card-header d-flex py-3 justify-content-between ">
                                    <h5 className="mt-1">Quản lý đơn hàng</h5>
                                    <strong>{totalElements}</strong>
                                </div>
                            </div>
                            <div className="card mb-4">
                                <Box
                                    component="form"
                                    onSubmit={handleSubmit}
                                    className="card-body row d-flex justify-content-between"
                                >
                                    <Box className="my-2">
                                        <Typography>Tìm kiếm theo user</Typography>
                                        <FormControl className="col-lg-3 col-auto px-2 my-1">
                                            <TextField
                                                id="outlined-basic"
                                                label="Search User"
                                                variant="outlined"
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl className="col-lg-3 col-auto px-2 my-1">
                                            <TextField
                                                id="outlined-basic"
                                                label="Search Mobile"
                                                variant="outlined"
                                                onChange={(e) => setMobile(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl className="col-lg-3 col-auto px-2 my-1">
                                            <TextField
                                                id="outlined-basic"
                                                label="Search Email"
                                                variant="outlined"
                                                onChange={(e) => setEmail(e.target.value)}
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
                                                onChange={handleChangeField}
                                            >
                                                <MenuItem value={"id"}>Id</MenuItem>
                                                <MenuItem value={"first_name"}>Họ</MenuItem>
                                                <MenuItem value={"last_name"}>Tên</MenuItem>
                                                <MenuItem value={"total"}>Tổng tiền</MenuItem>
                                                <MenuItem value={"email"}>Email</MenuItem>
                                                <MenuItem value={"line1"}>Address</MenuItem>
                                                <MenuItem value={"city"}>Thành phố/Tỉnh</MenuItem>
                                                <MenuItem value={"created_at"}>Thời gian tạo</MenuItem>
                                                <MenuItem value={"updated_at"}>Thời gian cập nhật</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl className="col-lg-3 col-auto px-2 my-1">
                                            <Select
                                                inputProps={{ "aria-label": "Without label" }}
                                                value={sort}
                                                displayEmpty
                                                onChange={handleChangeSort}
                                            >
                                                <MenuItem value={"ASC"}>Tăng dần</MenuItem>
                                                <MenuItem value={"DESC"}>Giảm dần</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Box className="my-2">
                                        <Typography>Trạng thái</Typography>
                                        <FormControl className="col-lg-3 col-auto px-2 my-1">
                                            <Select
                                                inputProps={{ "aria-label": "Without label" }}
                                                value={status}
                                                displayEmpty
                                                onChange={handleChangeStatus}
                                            >
                                                <MenuItem value="">
                                                    <em>Tất cả</em>
                                                </MenuItem>
                                                <MenuItem value={0}>Chờ xác nhận</MenuItem>
                                                <MenuItem value={1}>Đang vận chuyển</MenuItem>
                                                <MenuItem value={2}>Đang giao</MenuItem>
                                                <MenuItem value={3}>Đã nhận</MenuItem>
                                                <MenuItem value={4}>Hoàn thành</MenuItem>
                                                <MenuItem value={5}>User - Huỷ</MenuItem>
                                                <MenuItem value={6}>Admin - Huỷ</MenuItem>
                                                <MenuItem value={7}>Hoàn trả</MenuItem>
                                                <MenuItem value={8}>Đã hoàn trả</MenuItem>
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
                                                        <TableCell className="text-nowrap">User</TableCell>
                                                        <TableCell className="text-nowrap">Mobile</TableCell>
                                                        <TableCell className="text-nowrap">Email</TableCell>
                                                        <TableCell className="text-nowrap">Total</TableCell>
                                                        <TableCell className="text-nowrap">Time</TableCell>
                                                        <TableCell className="text-nowrap">Status</TableCell>
                                                        <TableCell className="text-nowrap" align="center">
                                                            Action
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data.length > 0 ? (
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
                                                                                src={API + item.user.photos}
                                                                                variant="rounded"
                                                                                sx={{ width: 56, height: 56 }}
                                                                            />
                                                                        }
                                                                        style={{ minWidth: "200px", maxWidth: "400px" }}
                                                                        title={
                                                                            <Link to={"/user/" + item.user.id} className="text-black">{item.firstName + " " + item.lastName}</Link>
                                                                            }
                                                                        sx={{ p: 0 }}
                                                                    />
                                                                </TableCell>

                                                                <TableCell className="text-nowrap">{item.mobile}</TableCell>
                                                                <TableCell className="text-nowrap">{item.email}</TableCell>
                                                                <TableCell className="text-nowrap" align="right">
                                                                    {VND.format(item.total)}
                                                                </TableCell>
                                                                <TableCell className="text-nowrap">
                                                                    {item.updatedAt ? (
                                                                        <Input
                                                                            type="datetime-local"
                                                                            defaultValue={format(
                                                                                new Date(item.updatedAt),
                                                                                "yyyy-MM-dd'T'hh:mm"
                                                                            )}
                                                                            readOnly
                                                                        />
                                                                    ) : (
                                                                        <Input
                                                                            type="datetime-local"
                                                                            defaultValue={format(
                                                                                new Date(item.createdAt),
                                                                                "yyyy-MM-dd'T'hh:mm"
                                                                            )}
                                                                            readOnly
                                                                        />
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="text-nowrap">
                                                                    {item.status === 0
                                                                        ? "Chờ xác nhận"
                                                                        : null || item.status === 1
                                                                        ? "Đang vận chuyển"
                                                                        : null || item.status === 2
                                                                        ? "Đang giao"
                                                                        : null || item.status === 3
                                                                        ? "Đã nhận"
                                                                        : null || item.status === 4
                                                                        ? "Hoàn thành"
                                                                        : null || item.status === 5
                                                                        ? "User - Huỷ"
                                                                        : null || item.status === 6
                                                                        ? "Admin - Huỷ"
                                                                        : null || item.status === 7
                                                                        ? "Hoàn trả"
                                                                        : null || item.status === 8
                                                                        ? "Đã hoàn trả"
                                                                        : null}
                                                                </TableCell>

                                                                <TableCell align="center" className="row ">
                                                                    <div className="d-flex">
                                                                        <Link to={`/admin/order/${item.id}`}>
                                                                            <IconButton color="success" title="Edit">
                                                                                <BorderColorIcon />
                                                                            </IconButton>
                                                                        </Link>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
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

export default OrderManagement;