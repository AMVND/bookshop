import React from "react";
import { Link, useNavigate } from "react-router-dom";
//
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
//
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Alert, Snackbar } from "@mui/material";

function CartAdd() {
    const [user, setUser] = React.useState({});
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("warning");
    const navigation = useNavigate();

    const snackbarClose = () => {
        setSnackbarOpen(false);
    };
   
    const loadDataUser = () => {
        if (localStorage.getItem("token") !== null) {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

            var requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            fetch("/user/auth/info", requestOptions)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error(response.status);
                })
                .then((result) => {
                    setUser(result);
                })
                .catch((error) => {
                    console.log("error", error);
                });
        }
    };

    React.useEffect(() => {
        loadDataUser();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            line1: data.get("line1"),
            city: data.get("city"),
            country: data.get("country"),
            content: data.get("content"),
        });
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            line1: data.get("line1"),
            city: data.get("city"),
            country: data.get("country"),
            content: data.get("content"),
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch("/cart/auth/create", requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.status;
                }
                throw new Error(response.status);
            })
            .then((result) => {
                console.log(result);
                setSnackbarOpen(true);
                setSnackbarSeverity("success");
                setSnackbarMsg("Thành công.");
                navigation("/carts");
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("False");
            });
    };
    const ShowDataUser = () => {
        return (
            <div>
                <p className="mb-3">Thông tin cá nhân</p>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className="form-outline">
                            <input type="text" className="form-control form-control-lg" defaultValue={user.firstName} disabled />
                            <label className="form-label" htmlFor="typeExp">
                                Họ
                            </label>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-outline">
                            <input type="text" className="form-control form-control-lg" defaultValue={user.lastName} disabled />
                            <label className="form-label">Tên</label>
                        </div>
                    </div>
                </div>
                <div className="form-outline mb-3">
                    <input type="text" className="form-control form-control-lg" defaultValue={user.mobile} disabled />
                    <label className="form-label">Điện thoại</label>
                </div>
                <div className="form-outline mb-3">
                    <input type="text" className="form-control form-control-lg" defaultValue={user.email} disabled />
                    <label className="form-label">Email</label>
                </div>
            </div>
        );
    };
    const ShowDataCart = () => {
        return (
            <div>
                <p className="mb-3">Thông tin giỏ hàng</p>
                <div className="form-outline mb-3">
                    <input
                        type="text"
                        id="line1"
                        name="line1"
                        className="form-control form-control-lg"
                        defaultValue=""
                        autoFocus
                    />
                    <label className="form-label">Line</label>
                </div>
                <div className="form-outline mb-3">
                    <input type="text" id="city" name="city" className="form-control form-control-lg" defaultValue="" />
                    <label className="form-label">City</label>
                </div>
                <div className="form-outline mb-3">
                    <input
                        type="text"
                        id="country"
                        name="country"
                        className="form-control form-control-lg"
                        defaultValue="Việt Nam"
                        readOnly
                    />
                    <label className="form-label">Country</label>
                </div>
                <div className="form-outline mb-3">
                    <input type="text" id="content" name="content" className="form-control form-control-lg" defaultValue="" />
                    <label className="form-label">Content</label>
                </div>
            </div>
        );
    };
    return (
        <div>
            <Snackbar
                sx={{ marginTop: "50px" }}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={snackbarClose}
            >
                <Alert
                    severity={`${snackbarSeverity}`}
                    action={[
                        <IconButton key={"close"} aria-label="Close" sx={{ p: 0.5 }} onClick={snackbarClose}>
                            <CloseIcon />
                        </IconButton>,
                    ]}
                >
                    {snackbarMsg}
                </Alert>
            </Snackbar>
            <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
                <div className="container h-100 py-5">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col">
                            <div className="card shopping-cart" style={{ borderRadius: 15 }}>
                                <div className="card-body text-black">
                                    <div className="row justify-content-center">
                                        <div className="col-lg-6 px-5 py-4">
                                            <h3 className="mb-5 pt-2 text-center fw-bold text-uppercase">Add cart</h3>
                                            <form className="mb-5" onSubmit={handleSubmit}>
                                                <ShowDataUser />
                                                <ShowDataCart />

                                                <div className="d-flex justify-content-between">
                                                    <span className="fw-bold mt-1">
                                                        <Link to={"/carts"} style={{ fontSize: "28px" }}>
                                                            <ChevronLeftIcon
                                                                className="text-primary me-0 pb-1 "
                                                                title="View"
                                                                sx={{ fontSize: "48px" }}
                                                            />
                                                            Back
                                                        </Link>
                                                    </span>
                                                    <span>
                                                        <button type="submit" className="btn btn-primary btn-block btn-lg ">
                                                            Create
                                                        </button>
                                                    </span>
                                                </div>
                                                <p className="d-flex justify-content-between"></p>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default CartAdd;