import React from "react";
import { Link, NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
//Icon
import DeleteIcon from "@mui/icons-material/Delete";
import { Alert } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
//item menu
import IconButton from "@mui/material/IconButton";
//Paginavtion
import TablePagination from "@mui/material/TablePagination";

import API from "../../Api/Api";
import SnackbarMessage from "../../Layout/SnackbarMessage";
import axios from "axios";
import { useCallback } from "react";

function CategoryManagement() {
    // data product-category
    const [data, setData] = React.useState([]);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("warning");

    // Trang hiện tại của page
    const [page, setPage] = React.useState(0);

    // Số sản phẩm được hiển thị
    const [pageSize, setPageSize] = React.useState(5);
    // const [field, setField] = React.useState("id");
    // const [sort, setSort] = React.useState("ASC");
    let field = "id";
    let sort = "ASC";
    const [title, setTitle] = React.useState("");
    const [totalElements, setTotalElements] = React.useState("");
    // dialog delete
    const [openDialog, setOpenDialog] = React.useState(false);
    const [dialogItem, setDialogItem] = React.useState();

    const handleClickOpenDialog = (item) => {
        // console.log(item);
        setOpenDialog(true);
        setDialogItem(item);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDialogItem();
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        loadDataCategory();
    };

    const handleChangePageSize = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        setPage(0);
        loadDataCategory();
    };
    // Đóng snackbar
    const snackbarClose = () => {
        setSnackbarOpen(false);
    };

    const loadDataCategory = useCallback(() => {
        axios
            .get(API + `/category/auth/admin/${page}/${pageSize}?field=${field}&sort=${sort}&title=${title}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
            .then((res) => {
                console.log("category", res.data);
                setData(res.data.response.content);
                setTotalElements(res.data.response.totalElements);
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("error! không load được dữ liệu user");
            });
    }, [field, page, pageSize, sort, title]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setPage(0);
        loadDataCategory();
    };
    const handleDelete = () => {
        axios
            .delete(`${API}/category/auth/admin`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                params: {
                    id: dialogItem.id,
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setSnackbarOpen(true);
                    setSnackbarSeverity("success");
                    setSnackbarMsg(`Đã xoá category với id: ${dialogItem.id}`);
                    handleCloseDialog();
                    loadDataCategory();
                } else {
                    throw new Error(`Response status: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("error! Xoá không thành công");
                handleCloseDialog();
            });
    };
    React.useEffect(() => {
        loadDataCategory();
    }, [loadDataCategory]);
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
                        <DialogTitle id="alert-dialog-title">Xoá category</DialogTitle>

                        <DialogContent className="d-flex justify-content-center">
                            <DialogContentText>Thực hiện xoá category có id: {dialogItem.id}?</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Không</Button>
                            <Button onClick={handleDelete}>Xoá</Button>
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
                                    <h5 className="mt-1">Quản lý danh mục</h5>
                                    <NavLink to={"/admin/category/create"}>
                                        <button className="btn btn-outline-dark">Tạo mới</button>
                                    </NavLink>
                                </div>
                            </div>
                            <div className="card mb-4">
                                <Box
                                    component="form"
                                    onSubmit={handleSubmit}
                                    className="card-body row d-flex justify-content-between"
                                >
                                    <FormControl className="col-lg-3 col-auto px-2 my-1">
                                        <TextField
                                            id="outlined-basic"
                                            label="Search category"
                                            variant="outlined"
                                            name="title"
                                            onChange={(e) => setTitle(e.target.value)}
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
                                                        <TableCell className="text-nowrap">Category</TableCell>
                                                        <TableCell className="text-nowrap">Sulg</TableCell>
                                                        <TableCell className="text-nowrap">Content</TableCell>
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

                                                                <TableCell className="text-nowrap">{item.title}</TableCell>

                                                                <TableCell className="text-nowrap">{item.slug}</TableCell>
                                                                <TableCell className="text-nowrap">{item.content}</TableCell>

                                                                <TableCell align="center" className="row ">
                                                                    <div className="d-flex justify-content-center">
                                                                        {/* <IconButton color="primary">
                                                                            <CalendarViewMonthIcon />
                                                                        </IconButton> */}
                                                                        <Link to={`/admin/category/${item.id}`}>
                                                                            <IconButton color="success" title="Edit">
                                                                                <BorderColorIcon />
                                                                            </IconButton>
                                                                        </Link>

                                                                        <IconButton
                                                                            color="error"
                                                                            title="Delete"
                                                                            onClick={() => handleClickOpenDialog(item)}
                                                                        >
                                                                            <DeleteIcon />
                                                                        </IconButton>
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

export default CategoryManagement;