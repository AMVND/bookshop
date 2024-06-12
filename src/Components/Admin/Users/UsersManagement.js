import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
    Alert,
    Avatar,
    Button,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputLabel,
    Stack,
    TextField,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
//Icon
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import IconButton from "@mui/material/IconButton";
//Paginavtion
import TablePagination from "@mui/material/TablePagination";
import API from "../../Api/Api";
import SnackbarMessage from "../../Layout/SnackbarMessage";

function UsersManagement() {
    // data product-category
    const [data, setData] = React.useState([]);
    //
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("warning");

    // Trang hiện tại của page
    const [page, setPage] = React.useState(0);

    // Số sản phẩm được hiển thị
    const [pageSize, setPageSize] = React.useState(5);
    const [field] = React.useState("id");
    const [sort] = React.useState("ASC");
    const [keyname, setKeyName] = React.useState("");
    const [mobile, setMobile] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [role, setRole] = React.useState("");
    const [totalElements, setTotalElements] = React.useState("");
    // dialog delete
    const [openDialog, setOpenDialog] = React.useState(false);
    const [dialogItem, setDialogItem] = React.useState();
    const [dialogVendor, setDialogVendor] = React.useState({});

    const handleClickOpenDialog = (item) => {
        // console.log(item);
        setOpenDialog(true);
        setDialogItem(item);
        setDialogVendor(item.vendor);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDialogItem();
        setDialogVendor();
    };
    const handleChangeVendor = () => {
        fetch(API + "/user/auth/change-vendor?id=" + dialogItem.id + "&vendor=" + dialogVendor, {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.text();
                }
                throw new Error(response.status);
            })
            .then((result) => {
                loadDataUser();
                handleCloseDialog();
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        loadDataUser();
    };

    const handleChangePageSize = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        setPage(0);
        loadDataUser();
    };
    const handleChange = (event) => {
        setRole(event.target.value);
        loadDataUser();
    };
    //

    // Đóng snackbar
    const snackbarClose = () => {
        setSnackbarOpen(false);
    };

    const loadDataUser = React.useCallback(() => {
        var url = API + "/user/auth/admin/" + page + "/" + pageSize + "?";
        fetch(
            url +
                new URLSearchParams({
                    field: field,
                    sort: sort,
                    keyname: keyname,
                    mobile: mobile,
                    email: email,
                    role: role,
                }),
            {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw Error(response.status);
            })
            .then((result) => {
                // console.log("user", result);
                setData(result.response.content);
                setTotalElements(result.response.totalElements);
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("error! không load được dữ liệu user");
            });
    }, [email, field, keyname, mobile, page, pageSize, role, sort]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setPage(0);
        loadDataUser();
    };

    React.useEffect(() => {
        loadDataUser();
    }, [loadDataUser, page, pageSize, role]);
    return (
        <div>
            <SnackbarMessage open={snackbarOpen} severity={snackbarSeverity} message={snackbarMsg} onClose={snackbarClose} />
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {dialogItem ? (
                    <>
                        <DialogTitle id="alert-dialog-title">
                            Thay đổi quyền hạn cho user: {dialogItem.firstName + " " + dialogItem.lastName}
                        </DialogTitle>

                        <DialogContent>
                            <DialogContentText>Quyền bán hàng</DialogContentText>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Vendor</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={dialogVendor}
                                    label="Vendor"
                                    onChange={(e) => setDialogVendor(e.target.value)}
                                >
                                    <MenuItem value={0}>Huỷ kích hoạt</MenuItem>
                                    <MenuItem value={1}>Kích hoạt</MenuItem>
                                    <MenuItem value={2}>Chờ xác nhận</MenuItem>
                                    <MenuItem value={3}>Cấm</MenuItem>
                                </Select>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Huỷ</Button>
                            <Button onClick={handleChangeVendor}>Lưu</Button>
                        </DialogActions>
                    </>
                ) : null}
            </Dialog>
            <section className="h-100 gradient-custom col-lg-12">
                <div className="container py-5">
                    <div className="row d-flex justify-content-center my-4">
                        <div>
                            <div className="card mb-4">
                                <div className="card-header d-flex py-3 justify-content-between ">
                                    <h5 className="mt-1">Quản lý tài khoản</h5>
                                    {/* <strong>{data.length} người dùng</strong> */}
                                </div>
                            </div>
                            <div className="card mb-4">
                                <Box
                                    component="form"
                                    onSubmit={handleSubmit}
                                    className="card-body row d-flex justify-content-between"
                                >
                                    <FormControl className="col-lg-2 col-md-2 col-4 my-1">
                                        <Select
                                            inputProps={{ "aria-label": "Without label" }}
                                            value={role}
                                            displayEmpty
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="">
                                                <em>Role</em>
                                            </MenuItem>
                                            <MenuItem value={"USER"}>USER</MenuItem>
                                            <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl className="col-lg-3 col-auto px-2 my-1">
                                        <TextField
                                            id="outlined-basic"
                                            label="Search User"
                                            variant="outlined"
                                            onChange={(e) => setKeyName(e.target.value)}
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
                                    <FormControl className="col-auto px-2 my-1">
                                        <button
                                            type="submit"
                                            className="btn btn-outline-dark text-nowrap"
                                            style={{ height: "61.6px" }}
                                        >
                                            Search
                                        </button>
                                    </FormControl>
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
                                                        {/* <TableCell className="text-nowrap">Password</TableCell> */}
                                                        <TableCell className="text-nowrap">Vendor</TableCell>
                                                        <TableCell className="text-nowrap">Role</TableCell>
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
                                                                                src={API + item.photos}
                                                                                variant="rounded"
                                                                                sx={{ width: 56, height: 56 }}
                                                                            />
                                                                        }
                                                                        style={{ minWidth: "200px", maxWidth: "400px" }}
                                                                        title={item.firstName + " " + item.lastName}
                                                                        sx={{ p: 0 }}
                                                                    />
                                                                </TableCell>

                                                                <TableCell className="text-nowrap">{item.mobile}</TableCell>
                                                                <TableCell className="text-nowrap">{item.email}</TableCell>
                                                                {/* <TableCell className="text-nowrap">{item.password}</TableCell> */}
                                                                <TableCell className="text-nowrap">
                                                                    {item.vendor === 0 ? (
                                                                        <span className="badge bg-secondary ms-2">False</span>
                                                                    ) : null}
                                                                    {item.vendor === 1 ? (
                                                                        <span className="badge bg-info ms-2">True</span>
                                                                    ) : null}
                                                                    {item.vendor === 2 ? (
                                                                        <span className="badge bg-warning ms-2">Warning</span>
                                                                    ) : null}
                                                                    {item.vendor === 3 ? (
                                                                        <span className="badge bg-danger ms-2">Ban</span>
                                                                    ) : null}
                                                                </TableCell>

                                                                <TableCell className="text-nowrap">{item.role}</TableCell>

                                                                <TableCell align="center" className="row ">
                                                                    <div className="d-flex justify-content-center">
                                                                        <Link to={`/admin/user/${item.id}`}>
                                                                            <IconButton color="primary" title="View">
                                                                                <CalendarViewMonthIcon />
                                                                            </IconButton>
                                                                        </Link>

                                                                        <IconButton
                                                                            color="success"
                                                                            onClick={() => handleClickOpenDialog(item)}
                                                                        >
                                                                            <BorderColorIcon />
                                                                        </IconButton>

                                                                        {/* <IconButton color="error">
                                                                            <DeleteIcon />
                                                                        </IconButton> */}
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

export default UsersManagement;