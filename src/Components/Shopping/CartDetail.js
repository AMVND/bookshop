import React from "react";
import { Link, useParams } from "react-router-dom";
//
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton } from "@mui/material";
//
import CloseIcon from "@mui/icons-material/Close";
import { Alert, Snackbar } from "@mui/material";
//
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

function CartDetail() {
    const { id } = useParams();
    const [cart, setCart] = React.useState({});
    const [cartDetail, setCartDetail] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [cartItem, setCartItem] = React.useState();
    const [quantity, setQuantity] = React.useState(0);
    //
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("warning");
    //
    const [open, setOpen] = React.useState(false);

    // const navigation = useNavigate();

    const handleClickOpen = (item) => {
        console.log(item);
        setOpen(true);
        setCartItem(item);
        setQuantity(item.quantity);
    };

    const handleClose = () => {
        setOpen(false);
        setCartItem();
        setQuantity();
    };

    const snackbarClose = () => {
        setSnackbarOpen(false);
    };

    const loadDataCartDetail = React.useCallback(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };
        fetch("/cart-item/auth/cart/" + id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw Error(response.status);
            })
            .then((result) => {
                console.log("cart-item", result);
                setLoading(false);
                setCartDetail(result);
            })
            .catch((error) => console.log("error", error));
    },[id]);
    const loadDataCart = React.useCallback(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };
        fetch("/cart/auth/my-cart/" + id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw Error(response.status);
            })
            .then((result) => {
                console.log("cart", result);
                setCart(result);
            })
            .catch((error) => console.log("error", error));
    },[id]);

    const ShowCartItem = () => {
        return (
            <div>
                {cartDetail.length >= 0 ? (
                    <>
                        {cartDetail.map((item, i) => (
                            <div key={item.id}>
                                <div className="d-flex align-items-center mb-4  ">
                                    <div className="flex-shrink-0 me-2">
                                        <img
                                            src={item.product.photos}
                                            className="img-fluid"
                                            style={{ width: 200, height: 210 }}
                                            alt=""
                                        />
                                    </div>
                                    <div className="flex-grow-1 ms-3 col-lg-5 col-md-6 mb-lg-0">
                                        {/* Data */}
                                        <p>
                                            <strong className="text-dark blockquote text-capitalize">{item.product.title}</strong>
                                        </p>
                                        <h6 style={{ color: "#9e9e9e" }}>Giảm giá: {item.product.discount}%</h6>
                                        <div className="row justify-content-between">
                                            <p className="fw-bold col-auto">{item.product.price}vnd</p>

                                            <div className=" d-flex col-auto">
                                                <input
                                                    style={{ width: "4rem" }}
                                                    defaultValue={item.quantity}
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    readOnly
                                                />
                                                {cart === 0 ? (
                                                    <IconButton sx={{ mx: 1 }} title="Sửa" onClick={() => handleClickOpen(item)}>
                                                        <BorderColorIcon className="text-primary" />
                                                    </IconButton>
                                                ) : null}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-between">
                                            {cart.statut === 0 ? (
                                                <IconButton
                                                    className="text-danger me-1 m-2"
                                                    onClick={() => handleDelete(item)}
                                                    title="remove"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            ) : null}

                                            <Link to={`/product/${item.product.slug}`}>
                                                <IconButton className="text-primary m-2" title="view">
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <hr className="mb-4" style={{ height: 2, backgroundColor: "#1266f1", opacity: 1 }} />
                            </div>
                        ))}
                    </>
                ) : (
                    <>Chưa có sản phẩm</>
                )}
            </div>
        );
    };
    const Loading = () => {
        return <>Loading</>;
    };
    const ShowDataCart = () => {
        return (
            <>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className="form-outline">
                            <input type="text" className="form-control form-control-lg" defaultValue={cart.firstName} disabled />
                            <label className="form-label">Họ</label>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-outline">
                            <input type="text" className="form-control form-control-lg" defaultValue={cart.lastName} disabled />
                            <label className="form-label">Tên</label>
                        </div>
                    </div>
                </div>
                <div className="form-outline mb-3">
                    <input type="number" className="form-control form-control-lg" defaultValue={cart.mobile} disabled />
                    <label className="form-label" htmlFor="typeText">
                        Điện thoại
                    </label>
                </div>
                <div className="form-outline mb-3">
                    <input type="text" className="form-control form-control-lg" defaultValue={cart.email} disabled />
                    <label className="form-label" htmlFor="typeText">
                        Email
                    </label>
                </div>
                <div className="form-outline mb-3">
                    <input
                        type="text"
                        id="line1"
                        name="line1"
                        className="form-control form-control-lg"
                        defaultValue={cart.line1}
                    />
                    <label className="form-label" htmlFor="typeName">
                        Địa chỉ
                    </label>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className="form-outline">
                            <input
                                type="text"
                                id="city"
                                name="city"
                                className="form-control form-control-lg"
                                defaultValue={cart.city}
                            />
                            <label className="form-label">Thành phố/Tỉnh</label>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-outline">
                            <input
                                type="text"
                                id="country"
                                name="country"
                                className="form-control form-control-lg"
                                defaultValue={cart.country}
                                // readOnly
                            />
                            <label className="form-label">Quốc gia</label>
                        </div>
                    </div>
                    <div className="form-outline mb-3">
                        <input
                            type="text"
                            id="content"
                            name="content"
                            className="form-control form-control-lg"
                            defaultValue={cart.content}
                        />
                        <label className="form-label">Ghi chú</label>
                    </div>
                </div>
            </>
        );
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        fetch("/cart/auth/" + cart.id, {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                line1: data.get("line1"),
                city: data.get("city"),
                country: data.get("country"),
                content: data.get("content"),
            }),
        })
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
                loadDataCart();
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("False");
            });
    };
    const handleOrderNow = () => {
        // alert(cartDetail.length);
        if (cartDetail.length === 0) {
            setSnackbarOpen(true);
            setSnackbarSeverity("error");
            setSnackbarMsg("Giỏ hàng chưa có sản phẩm nào!");
        } else {
            if (
                cart.line1 === "" ||
                cart.line1 === null ||
                cart.city === "" ||
                cart.city === null ||
                cart.country === "" ||
                cart.country === null
            ) {
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("Thông tin giỏ hàng không hợp lệ!");
            } else {
                fetch("/order/auth/createByCart?idCart=" + cart.id, {
                    method: "POST",
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
                        console.log(result);
                        setSnackbarOpen(true);
                        setSnackbarSeverity("success");
                        setSnackbarMsg("Thành công.");
                        loadDataCart();
                        loadDataCartDetail();
                    })
                    .catch((error) => {
                        console.log("error", error);
                        setSnackbarOpen(true);
                        setSnackbarSeverity("error");
                        setSnackbarMsg("False");
                    });
            }
        }
    };
    const handleDelete = (item) => {
        console.log(item.id);

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        var requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch("/cart-item/auth/" + item.id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.status;
                }
                throw new Error(response.status);
            })
            .then((result) => {
                setSnackbarOpen(true);
                setSnackbarSeverity("success");
                setSnackbarMsg("Thành công.");
                loadDataCartDetail();
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("False");
            });
    };
    const handleRepair = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch("/cart-item/auth/" + cartItem.id + "?quantity=" + quantity, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.status;
                }
                throw new Error(response.status);
            })
            .then((result) => {
                handleClose();
                setSnackbarOpen(true);
                setSnackbarSeverity("success");
                setSnackbarMsg("Cập nhật số lượng đặt hàng cho item ");
                loadDataCartDetail();
            })
            .catch((error) => {
                console.log("error", error);
                handleClose();
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("Lỗi sửa quantity");
            });
    };
    React.useEffect(() => {
        setLoading(true);
        loadDataCart();
        loadDataCartDetail();
    }, [loadDataCart, loadDataCartDetail]);
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
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {cartItem ? (
                    <>
                        <DialogTitle id="alert-dialog-title">{cartItem.product.title}</DialogTitle>

                        <DialogContent className="d-flex justify-content-center">
                            <IconButton
                                sx={{ mx: 1 }}
                                onClick={() => {
                                    if (quantity > 0) {
                                        setQuantity((i) => i - 1);
                                    }
                                }}
                            >
                                <RemoveIcon className="text-danger" />
                            </IconButton>
                            <input
                                style={{ width: "4rem" }}
                                min={1}
                                max={cartItem.product.quantity}
                                name="quantity"
                                value={quantity}
                                type="number"
                                className="form-control form-control-sm"
                                onChange={(e) => {
                                    if (e.target.value < 0) {
                                        setQuantity(0);
                                    } else if (e.target.value > cartItem.product.quantity) {
                                        setQuantity(cartItem.product.quantity);
                                    } else {
                                        setQuantity(e.target.value);
                                    }
                                }}
                            />

                            <IconButton
                                sx={{ mx: 1 }}
                                onClick={() => {
                                    if (quantity < cartItem.product.quantity) {
                                        setQuantity((i) => i + 1);
                                    }
                                }}
                            >
                                <AddIcon className="text-primary" />
                            </IconButton>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Huỷ</Button>
                            <Button onClick={handleRepair} autoFocus>
                                Lưu
                            </Button>
                        </DialogActions>
                    </>
                ) : null}
            </Dialog>
            <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
                <div className="container h-100 py-5">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col">
                            <div className="card shopping-cart" style={{ borderRadius: 15 }}>
                                <div className="card-body text-black">
                                    <div className="row">
                                        <div className="col-lg-6 px-5 py-4">
                                            <div className="d-flex justify-content-between">
                                                <h3 className="mb-5 pt-2  fw-bold text-uppercase">Cart: {cart.id}</h3>
                                                <p className="pt-3  fw-bold ">{cartDetail.length} item</p>
                                            </div>
                                            {loading ? <Loading /> : <ShowCartItem />}

                                            {/* <div className="d-flex justify-content-between px-x">
                                                <p className="fw-bold">Discount:</p>
                                                <p className="fw-bold">95$</p>
                                            </div>
                                            <div
                                                className="d-flex justify-content-between p-2 mb-2"
                                                style={{ backgroundColor: "#e1f5fe" }}
                                            >
                                                <h5 className="fw-bold mb-0">Total:</h5>
                                                <h5 className="fw-bold mb-0">2261$</h5>
                                            </div> */}
                                        </div>
                                        <div className="col-lg-6 px-5 py-4">
                                            <h3 className="mb-5 pt-2 text-center fw-bold text-uppercase">Thông tin</h3>
                                            <form onSubmit={handleSubmit} className="mb-5">
                                                <ShowDataCart />
                                                <div className="d-flex justify-content-between">
                                                    <span className="fw-bold mt-1">
                                                        <Link to={"/carts"} style={{ fontSize: "24px" }} className="text-dark">
                                                            <ChevronLeftIcon
                                                                className="text-dark me-0 pb-1 "
                                                                title="View"
                                                                sx={{ fontSize: "40px" }}
                                                            />
                                                            Back
                                                        </Link>
                                                    </span>
                                                    {cart.status === 0 ? (
                                                        <>
                                                            <span>
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-outline-dark btn-block  "
                                                                >
                                                                    Cập nhật
                                                                </button>
                                                            </span>

                                                            <span>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-dark btn-block"
                                                                    onClick={handleOrderNow}
                                                                >
                                                                    Order now
                                                                </button>
                                                            </span>
                                                        </>
                                                    ) : null}
                                                </div>
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

export default CartDetail;