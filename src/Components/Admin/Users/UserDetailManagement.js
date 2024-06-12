import React from "react";
import { Link, useParams } from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { format } from "date-fns";
import API from "../../Api/Api";
import SnackbarMessage from "../../Layout/SnackbarMessage";
import axios from "axios";

export default function UserDetailManagement() {
    const { id } = useParams();
    const [user, setUser] = React.useState({
        createdAt: new Date(),
    });
    const [vendor, setVendor] = React.useState("");
    const [role, setRole] = React.useState("");
    //
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("warning");
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        // console.log(item);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const snackbarClose = () => {
        setSnackbarOpen(false);
    };
    const handleChange = (event) => {
        setRole(event.target.value);
    };
    const loadDataUser = React.useCallback(() => {
        fetch(`${API}/user/auth/admin/u/${id}`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw Error(response.status);
            })
            .then((result) => {
                console.log("user", result);
                setUser(result);
                setVendor(result.vendor);
                setRole(result.role);
                handleClose();
            })
            .catch((error) => {
                console.log("error", error);
                handleClose();
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("Load product error!");
            });
    }, [id]);
    // Đổi quyền truy cập cho user
    const handleSetRole = () => {
        axios({
            method: "put",
            url: `${API}/user/auth/admin/role?userId=${user.id}&&role=${role}`,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            data: {},
        })
            .then((response) => {
                console.log("user", response);
                setSnackbarOpen(true);
                setSnackbarSeverity("success");
                setSnackbarMsg("Đã chuyển chức năng: " + role);
                loadDataUser();
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("Lỗi phân quyền!");
            });
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        axios({
            method: "put",
            url: `${API}/user/auth/admin/u?id=${user.id}`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            data: {
                photos: data.get("photos"),
                firstName: data.get("firstName"),
                lastName: data.get("lastName"),
                mobile: data.get("mobile"),
                email: data.get("email"),
                intro: data.get("intro"),
                profile: data.get("profile"),
                vendor: vendor,
                role: data.get("role"),
            },
        })
            .then((response) => {
                setSnackbarOpen(true);
                setSnackbarSeverity("success");
                setSnackbarMsg("Set data true");
                loadDataUser();
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("Set data error!");
            });
    };
    React.useEffect(() => {
        loadDataUser();
    }, [loadDataUser]);

    return (
        <div>
            <SnackbarMessage open={snackbarOpen} severity={snackbarSeverity} message={snackbarMsg} onClose={snackbarClose} />
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" style={{ width: "20rem" }}>
                    Phân Quyền User: {user.id}
                </DialogTitle>

                <DialogContent>
                    <DialogContentText className="mb-3">Chọn chức năng của user: </DialogContentText>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Role</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={role}
                            label="Role"
                            onChange={handleChange}
                        >
                            <MenuItem value={"USER"}>USER</MenuItem>
                            <MenuItem value={"USER_SHOP"}>USER_SHOP</MenuItem>
                            <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Huỷ</Button>
                    <Button onClick={handleSetRole}>Thay đổi</Button>
                </DialogActions>
            </Dialog>
            <section className="h-100 gradient-custom" style={{ backgroundColor: "#eee" }}>
                <div className="container py-5">
                    <form onSubmit={handleSubmit} className="row d-flex justify-content-center my-4">
                        <div className="col-lg-7 ">
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between py-3">
                                    <h5 className="mb-0 text-capitalize">Thông tin User</h5>
                                </div>
                                <div className="card-body px-5">
                                    <div className="form-outline mt-4">
                                        <img
                                            src={API + user.photos}
                                            alt="Images"
                                            className="img-thumbnail form-control form-control-lg col-md-2 m-auto"
                                            style={{ width: "auto", maxHeight: "250px", maxWidth: "250px" }}
                                        ></img>
                                        {/* <input type="text" name="photos" defaultValue={user.photos} className="form-control mt-4" /> */}
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div className="form-outline  mt-4 col-lg-5 ">
                                            <label className="form-label">Họ</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                defaultValue={user.firstName}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-outline  mt-4 col-lg-5 ">
                                            <label className="form-label">Tên</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                defaultValue={user.lastName}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-outline mt-4  ">
                                        <label className="form-label">Mobile</label>
                                        <input type="text" name="mobile" defaultValue={user.mobile} className="form-control" />
                                    </div>
                                    <div className="form-outline mt-4  ">
                                        <label className="form-label">Email</label>
                                        <input type="text" name="email" defaultValue={user.email} className="form-control" />
                                    </div>
                                    <div className="form-outline mt-4  ">
                                        <label className="form-label">Intro</label>
                                        <textarea
                                            type="text"
                                            rows={4}
                                            name="intro"
                                            defaultValue={user.intro}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="form-outline mt-4  ">
                                        <label className="form-label">Profile</label>
                                        <textarea
                                            type="text"
                                            rows={4}
                                            name="profile"
                                            defaultValue={user.profile}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="form-outline d-flex justify-content-between mt-4">
                                        <label className="form-label">Created At</label>
                                        <input
                                            type="datetime-local"
                                            defaultValue={format(new Date(user.createdAt), "yyyy-MM-dd'T'hh:mm:ss")}
                                            className="form-control w-auto"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card mb-4 ">
                                <div className="card-header py-3">
                                    <h5 className="mb-0">Bộ phận</h5>
                                </div>
                                <div className="card-body">
                                    <div className="form-outline">
                                        <input className="form-control" name="role" defaultValue={user.role} readOnly />
                                    </div>
                                </div>
                            </div>
                            <div className="card mb-4 ">
                                <div className="card-header py-3">
                                    <h5 className="mb-0">Quyền bán hàng</h5>
                                </div>
                                <div className="card-body">
                                    <div className="form-outline">
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Vendor</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={vendor}
                                                label="Vendor"
                                                onChange={(e) => setVendor(e.target.value)}
                                            >
                                                <MenuItem value={0}>Huỷ kích hoạt</MenuItem>
                                                <MenuItem value={1}>Kích hoạt</MenuItem>
                                                <MenuItem value={2}>Chờ xác nhận</MenuItem>
                                                <MenuItem value={3}>Cấm</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            </div>

                            <div className="card mb-4 card-body ">
                                <div className=" row form-group ">
                                    <Link to={"/admin/user"} className="col-auto m-auto">
                                        <button type="button" className="btn btn-dark  ">
                                            Cancel
                                        </button>
                                    </Link>
                                    <button type="button" className="btn btn-success col-auto m-auto" onClick={handleClickOpen}>
                                        Phân quyền
                                    </button>
                                    <button type="submit" className="btn btn-primary col-auto m-auto">
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}