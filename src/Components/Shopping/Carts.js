import React from "react";
//
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
//
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Snackbar,
} from "@mui/material";
import { Link } from "react-router-dom";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";

function Carts() {
    const [loading, setLoading] = React.useState(false);
    const [cart, setCart] = React.useState([]);
    const [dialogItem, setDialogItem] = React.useState();
    //
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("warning");
    //
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = (item) => {
        // console.log(item);
        setOpen(true);
        setDialogItem(item);
    };

    const handleClose = () => {
        setOpen(false);
        setDialogItem();
    };
    //
    const snackbarClose = () => {
        setSnackbarOpen(false);
    };
    const loadDataCart = () => {
        setLoading(true);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };
        fetch("/cart/auth/my-cart?status=0", requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw Error(response.status);
            })
            .then((result) => {
                // Set trạng thái loading
                setLoading(false);
                // Set data vào cart
                setCart(result);
                // console.log(result);
            })
            .catch((error) => console.log("error", error));
    };
    const Loading = () => {
        return (
            <Stack>
                <Skeleton variant="rounded" sx={{ marginBlock: 1 }} height={120} />
                <Skeleton variant="rounded" sx={{ marginBlock: 1 }} height={120} />
                <Skeleton variant="rounded" sx={{ marginBlock: 1 }} height={120} />
            </Stack>
        );
    };
    React.useEffect(() => {
        loadDataCart();
    }, []);
    const handleAddCart = () => {
        if (cart.length >= 5){
            setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("Số giỏ hàng không được quá 5!");
        } else {

            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                country: "Việt Nam",
            })
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
                    if(result === "true"){
                        setSnackbarSeverity("success");
                        setSnackbarMsg("Tạo mới giỏ hàng thành công.");
                        loadDataCart();
                    }else {
                        setSnackbarSeverity("warning");
                        setSnackbarMsg("Đã có giỏ hàng");
                    }
                    
                    
                })
                .catch((error) => {
                    console.log("error", error);
                    setSnackbarOpen(true);
                    setSnackbarSeverity("error");
                    setSnackbarMsg("False");
                });
        }
    };
    const ShowCarts = () => {
        return (
            <>
                {/* Thông tin cart */}
                {cart.length > 0 ? (
                    <>
                        {cart.map((item, i) => {
                            return (
                                <div className="card rounded-3 mb-4" key={i}>
                                    <div className="card-body p-4">
                                        <div className="row d-flex justify-content-between align-items-center">
                                            {/* 1 */}
                                            <div className="col-md-5 col-lg-5 col-xl-5">
                                                <p className="lead fw-normal mb-2 ">
                                                    <span className="text-muted">Cart :</span> {item.id}
                                                </p>
                                                <p>
                                                    <span className="text-muted">Line: </span>
                                                    {item.line1}
                                                </p>
                                                <p>
                                                    <span className="text-muted">City: </span>
                                                    {item.city} &nbsp;
                                                    <span className="text-muted">Country: </span>
                                                    {item.country}
                                                </p>
                                                <p>
                                                    <span className="text-muted">Content: </span>
                                                    {item.content}
                                                </p>
                                            </div>

                                            {/* 3 */}
                                            <div className="col-md-5 col-lg-4 col-xl-4 offset-lg-1">
                                                {/* <h5 className="mb-0 text-nowrap">
                                                    Status:{" "}
                                                    {item.status === 0
                                                        ? "New"
                                                        : null || item.status === 1
                                                        ? "Cart"
                                                        : null || item.status === 2
                                                        ? "Order"
                                                        : null || item.status === 3
                                                        ? "Đã thanh toán"
                                                        : null}
                                                </h5> */}
                                                <span>
                                                    <span className="text-muted">Created At: </span>
                                                    {format(parseISO(item.createdAt), "dd-MM-yyyy")}
                                                </span>
                                                <br />
                                                {item.updatedAt ? (
                                                    <span>
                                                        <span className="text-muted">Updated At: </span>
                                                        {formatDistanceToNow(new Date(item.updatedAt), {
                                                            locale: vi,
                                                            addSuffix: true,
                                                        })}
                                                    </span>
                                                ) : null}
                                            </div>
                                            {/* 4 */}
                                            <div className="col-md-2 col-lg-2 col-xl-2 text-end justify-content-end d-flex">
                                                <Link to={`/carts/${item.id}`}>
                                                    <IconButton sx={{ m: 1 }} className="text-primary" title="View">
                                                        {/* <DeleteIcon /> */}
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Link>
                                                <IconButton
                                                    sx={{ m: 1 }}
                                                    className="text-danger"
                                                    title="Remove"
                                                    onClick={() => handleClickOpen(item)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <div className="card rounded-3 mb-4">Not found</div>
                )}
            </>
        );
    };
    const handleDeleteCart = () => {
        // console.log("delete: " +dialogItem.id);

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        var requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch("/cart/auth/delete/" + dialogItem.id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.status;
                }
                throw new Error(response.status);
            })
            .then((result) => {
                setSnackbarOpen(true);
                setSnackbarSeverity("success");
                setSnackbarMsg("Đã xoá giỏ hàng " + dialogItem.id + "!");
                handleClose();
                loadDataCart();
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("Thực hiện xoá không thành công!");
                handleClose();
            });
    };
    // Chưa cần đến search
    // const ShowSearch = () => {
    //     return (
    //         <div className="card mb-4">
    //             <div className="card-body p-4 d-flex flex-row">
    //                 <div className="form-outline flex-fill">
    //                     <input type="text" id="form1" className="form-control form-control-lg" />
    //                     <label className="form-label" htmlFor="form1">
    //                         Discound code
    //                     </label>
    //                 </div>
    //                 <button type="button" className="btn btn-outline-warning btn-lg ms-3">
    //                     Apply
    //                 </button>
    //             </div>
    //         </div>
    //     );
    // };

    return (
        <div>
            <Snackbar
                sx={{ marginTop: "50px" }}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={snackbarOpen}
                autoHideDuration={3000}
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
            <Dialog
                open={open}
                onClose={handleClose}
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
                            <Button onClick={handleClose}>Không</Button>
                            <Button onClick={handleDeleteCart} autoFocus>
                                Xoá
                            </Button>
                        </DialogActions>
                    </>
                ) : null}
            </Dialog>
            <section className="h-100" style={{ backgroundColor: "#eee" }}>
                <div className="container h-100 py-5">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-10">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-normal mb-0 text-black">My shopping Cart</h3>
                                <div>
                                    <p className="mb-0">
                                        {/* chuyển đến --> Add Cart form */}
                                        {/* <Link to={"/carts/add-cart"}>
                                            <button type="button" className="btn btn-outline-primary btn-block ">
                                                Add Cart
                                            </button>
                                        </Link> */}
                                        {/* Tạo cart mới ngay */}
                                        <button className="btn btn-outline-primary btn-block " onClick={handleAddCart}>
                                            Add Cart
                                        </button>
                                    </p>
                                </div>
                            </div>
                            {loading ? <Loading /> : <ShowCarts />}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Carts;