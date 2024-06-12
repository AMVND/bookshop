import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Input,
    Stack,
    TextField,
    Typography,
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
//item menu
import IconButton from "@mui/material/IconButton";
//Paginavtion
import TablePagination from "@mui/material/TablePagination";

import { VND } from "../../Unity/VND";
import { format } from "date-fns";
import API from "../../Api/Api";
import SnackbarMessage from "../../Layout/SnackbarMessage";

function TransactionManagement() {
    // data product-category
    const [data, setData] = React.useState([]);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("warning");

    // Trang hiện tại của page
    const [page, setPage] = React.useState(0);

    // Số sản phẩm được hiển thị
    const [pageSize, setPageSize] = React.useState(5);
    const [field, setField] = React.useState("updated_at");
    const [sort, setSort] = React.useState("DESC");
    const [orderId] = React.useState("");
    const [userId] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [mobile, setMobile] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [city, setCity] = React.useState("");
    const [country] = React.useState("");
    const [type] = React.useState("");
    const [mode] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [totalElements, setTotalElements] = React.useState("");
    //
    const [dialogItem, setDialogItem] = React.useState();
    const [openDialog, setOpenDialog] = React.useState(false);

    // const handleClickOpenDialog = (item) => {
        
    //     setOpenDialog(true);
    //     setDialogItem(item);
    // };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDialogItem();
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        loadDataTransaction();
    };

    const handleChangePageSize = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        setPage(0);
        loadDataTransaction();
    };
    // const navigation = useNavigate();
    const handleChangeStatus = (event) => {
        setStatus(event.target.value);
        loadDataTransaction();
    };
    const handleChangeField = (event) => {
        setField(event.target.value);
        loadDataTransaction();
    };
    const handleChangeSort = (event) => {
        setSort(event.target.value);
        loadDataTransaction();
    };
    //
    // const [anchorEl, setAnchorEl] = React.useState(null);
    // const open = Boolean(anchorEl);
    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };
    // Đóng menu
    // const handleClose = () => {
    //     setAnchorEl(null);
    // };
    // Đóng snackbar
    const snackbarClose = () => {
        setSnackbarOpen(false);
    };

    const loadDataTransaction = React.useCallback(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };
        fetch(
            `${API}/transaction/auth/admin/${page}/${pageSize}?field=${field}&sort=${sort}&orderId=${orderId}&userId=${userId}&username=${username}&mobile=${mobile}&email=${email}&address=${address}&city=${city}&country=${country}&type=${type}&mode=${mode}&status=${status}`,
            requestOptions
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw Error(response.status);
            })
            .then((result) => {
                console.log("order", result);
                setData(result.response.content);
                setTotalElements(result.response.totalElements);
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("error! không load được dữ liệu transaction");
            });
    },[address, city, country, email, field, mobile, mode, orderId, page, pageSize, sort, status, type, userId, username]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setPage(0);
        loadDataTransaction();
    };
    const handleDelete = () => {
        if (dialogItem.status === 1) {
            fetch(API+"/transaction/auth/admin/" + dialogItem.id, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
                .then((response) => {
                    if (response.ok) {
                        return response.status;
                    }
                    throw new Error(response.status);
                })
                .then((result) => {
                    setSnackbarOpen(true);
                    setSnackbarSeverity("success");
                    setSnackbarMsg("Đã xoá transaction " + dialogItem.id + "!");
                    handleCloseDialog();
                    loadDataTransaction();
                })
                .catch((error) => {
                    console.log("error", error);
                    setSnackbarOpen(true);
                    setSnackbarSeverity("error");
                    setSnackbarMsg("Thực hiện xoá không thành công!");
                    handleCloseDialog();
                });
        } else {
            setSnackbarOpen(true);
            setSnackbarSeverity("error");
            setSnackbarMsg("Transaction này hiện không thể xoá!");
            handleCloseDialog();
        }
    };
    React.useEffect(() => {
        loadDataTransaction();
    }, [loadDataTransaction]);
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
                        <DialogTitle id="alert-dialog-title">Xoá giỏ hàng?</DialogTitle>

                        <DialogContent className="d-flex justify-content-center">
                            <DialogContentText>Bạn có chắc là muốn xoá giỏ hàng: {dialogItem.id} này không?</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Không</Button>
                            <Button onClick={handleDelete} autoFocus>
                                Xoá
                            </Button>
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
                                    <h5 className="mt-1">Quản lý phiếu thanh toán</h5>
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
                                    <Box className="my-2">
                                        <Typography>Tìm kiếm theo địa chỉ</Typography>
                                        <FormControl className="col-lg-3 col-auto px-2 my-1">
                                            <TextField
                                                id="outlined-basic"
                                                label="Search Address"
                                                variant="outlined"
                                                onChange={(e) => setAddress(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl className="col-lg-3 col-auto px-2 my-1">
                                            <TextField
                                                id="outlined-basic"
                                                label="Search City"
                                                variant="outlined"
                                                onChange={(e) => setCity(e.target.value)}
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
                                                <MenuItem value={0}>Chưa thanh toán</MenuItem>
                                                <MenuItem value={1}>Đã thanh toán</MenuItem>
                                                <MenuItem value={2}>Thành công</MenuItem>
                                                <MenuItem value={3}>User - Huỷ</MenuItem>
                                                <MenuItem value={4}>Admin - Huỷ</MenuItem>
                                                <MenuItem value={5}>Hoàn tiền/Trả lại</MenuItem>
                                                <MenuItem value={6}>Y/c hoàn trả</MenuItem>
                                                <MenuItem value={7}>Đã hoàn trả</MenuItem>
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
                                <Box className="card-body row">
                                    <Box className="my-2 col-auto m-auto">
                                        <Typography >Tổng số giao dịch: <b style={{color: "#1976d2"}}>{totalElements} </b></Typography>
                                        </Box>
                                    <Box className="my-2 col-auto m-auto">
                                        <Typography>Tổng số tiền: <b style={{color: "#1976d2"}}>{VND.format(data.reduce((sum, item) => sum + item.order.total, 0))}</b></Typography>
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
                                                        <TableCell className="text-nowrap">Mã Phiếu</TableCell>
                                                        <TableCell className="text-nowrap">Mã người dùng</TableCell>
                                                        <TableCell className="text-nowrap">Mã đơn hàng</TableCell>
                                                        <TableCell className="text-nowrap">Mã giao dịch</TableCell>
                                                        <TableCell className="text-nowrap">Total</TableCell>
                                                        <TableCell className="text-nowrap">Ngày tạo</TableCell>
                                                        <TableCell className="text-nowrap">Trạng thái</TableCell>
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

                                                                {/* <TableCell>
                                                                    <CardHeader
                                                                        avatar={
                                                                            <Avatar
                                                                                alt="Remy Sharp"
                                                                                src={item.user.photos}
                                                                                variant="rounded"
                                                                                sx={{ width: 56, height: 56 }}
                                                                            />
                                                                        }
                                                                        title={item.user.firstName + " " + item.user.lastName}
                                                                        sx={{ p: 0 }}
                                                                    />
                                                                </TableCell> */}

                                                                <TableCell className="text-nowrap">{item.user.id}</TableCell>
                                                                <TableCell className="text-nowrap">{item.order.id}</TableCell>
                                                                <TableCell className="text-nowrap">{item.code}</TableCell>
                                                                
                                                                <TableCell className="text-nowrap">{VND.format(item.order.total)}</TableCell>
                                                                <TableCell className="text-nowrap">
                                                                
                                                                        <Input
                                                                            type="datetime-local"
                                                                            defaultValue={format(
                                                                                new Date(item.updatedAt),
                                                                                "yyyy-MM-dd'T'hh:mm"
                                                                            )}
                                                                            readOnly
                                                                        />
                                                                    
                                                                </TableCell>

                                                                <TableCell className="text-nowrap">
                                                                    {item.status === 0
                                                                        ? "Chưa thanh toán"
                                                                        : null || item.status === 1
                                                                        ? "Đã thanh toán"
                                                                        : null || item.status === 2
                                                                        ? "Thành công"
                                                                        : null || item.status === 3
                                                                        ? "User - Huỷ"
                                                                        : null || item.status === 4
                                                                        ? "admin - huỷ"
                                                                        // : null || item.status === 5
                                                                        // ? "Đã nhận"
                                                                        : null || item.status === 6
                                                                        ? "Y/c hoàn trả"
                                                                        : null || item.status === 7
                                                                        ? "Đã hoàn trả"
                                                                        : null}
                                                                </TableCell>

                                                                <TableCell className="row ">
                                                                    <div className="d-flex justify-content-center">
                                                                        <IconButton color="primary">
                                                                            <CalendarViewMonthIcon />
                                                                        </IconButton>
                                                                        <Link to={`/admin/transaction/${item.id}`}>
                                                                            <IconButton color="success">
                                                                                <BorderColorIcon />
                                                                            </IconButton>
                                                                        </Link>

                                                                        {/* <IconButton
                                                                            color="error"
                                                                            onClick={() => handleClickOpenDialog(item)}
                                                                        >
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

export default TransactionManagement;