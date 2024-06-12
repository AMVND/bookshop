import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
//
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, Input, Typography } from "@mui/material";

//
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
//
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { VND } from "../Unity/VND";
import { format } from "date-fns";
import API from "../Api/Api";
import SnackbarMessage from "../Layout/SnackbarMessage";

function OrderDetail() {
    const steps = ["Chờ xử lý", "Đang vận chuyển", "Đang giao", "Đã nhận", "Hoàn thành"];
    const steps2 = ["Hoàn trả", "Đã hoàn trả"];
    // id của order
    const { id } = useParams();
    //
    const [order, setOrder] = React.useState({
        id: "",
        firstName: "",
        lastName: "",
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    // thông tin chi tiết của order
    const [orderDetail, setOrderDetail] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    

    //
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("warning");
    //

    //
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = (item) => {
        console.log(item);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    // Đóng snackbar
    const snackbarClose = () => {
        setSnackbarOpen(false);
    };
    // get data chi tiết của order
    const loadDataOrderDetail = React.useCallback(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };
        fetch(API + "/order-item/auth/shop/order/" + id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw Error(response.status);
            })
            .then((result) => {
                // console.log("cart-item", result);
                setLoading(false);
                setOrderDetail(result);
            })
            .catch((error) => console.log("error", error));
    }, [id]);
    // get data của order
    const loadDataOrder = React.useCallback(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };
        fetch(API + "/order/auth/findOneById/" + id, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw Error(response.status);
            })
            .then((result) => {
                console.log("order", result);
                setOrder(result);
            })
            .catch((error) => console.log("error", error));
    }, [id]);

    const Loading = () => {
        return <>Loading</>;
    };
    // Thông tin của phiếu order
    const ShowDataOrder = () => {
        return (
            <div className="card mb-4">
                <div className="card-header py-3">
                    <h5 className="mb-0">Thông tin</h5>
                </div>
                <div className="card-body">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                            Người đặt hàng
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {order.firstName + " " + order.lastName}
                            </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                            Mobile
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {order.mobile}
                            </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center  px-0 ">
                            Email
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {order.email}
                            </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                            Address
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {order.line1}
                            </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                            City
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {order.city}
                            </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                            Country
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {order.country}
                            </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                            Content
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {order.content}
                            </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                            Sub Total
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {VND.format(order.subTotal)}
                            </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                            Item Discount
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {VND.format(order.itemDiscount)}
                            </span>
                        </li>

                        <li className="list-group-item d-flex justify-content-between align-items-center  px-0 mb-3">
                            <div>
                                <strong>Total</strong>
                                {/* <strong>
                                    <p className="mb-0">(including VAT)</p>
                                </strong> */}
                            </div>
                            <span>
                                <strong>{VND.format(order.total)}</strong>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        );
    };
    
    const SingleItem = () => {
        return orderDetail.length > 0
            ? orderDetail.map((item, i) => (
                  <div key={i}>
                      <div className="row mb-3 justify-content-center">
                          <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
                              {/* Image start */}
                              <div className="bg-image hover-overlay hover-zoom ripple rounded" data-mdb-ripple-color="light">
                                  <img src={API + item.product.photos} className="w-100" alt={item.product.title} />
                                  <a href="#!">
                                      <div className="mask" style={{ backgroundColor: "rgba(251, 251, 251, 0.2)" }} />
                                  </a>
                              </div>
                              {/* Image end */}
                          </div>
                          <div className="col-lg-8 col-md-12 m-0">
                              {/* Data start */}
                              <p>
                                  <strong>{item.product.title}</strong>
                              </p>
                              {/* discount start */}
                              <p>Giảm giá: {item.discount}%</p>
                              {/* discount end */}
                              {/* Price start */}
                              <p>
                                  Giá: <strong>{VND.format(item.price)}</strong>
                              </p>
                              {/* Price end */}
                              {/* Quantity start */}
                              <p>
                                  Số lượng: <strong>{item.quantity}</strong>
                              </p>
                              {/* Quantity end*/}
                              <Link to={`/product/${item.product.slug}`}>
                                  <IconButton className="text-primary" title="view">
                                      <VisibilityIcon />
                                  </IconButton>
                              </Link>

                              {/* Data end */}
                          </div>
                      </div>
                      <hr className="my-4" />
                  </div>
              ))
            : null;
    };
    const handleReceiveOrder = () => {
        fetch(
            API +
                "/order/auth/receive?" +
                new URLSearchParams({
                    id: order.id,
                }),
            {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        )
            .then((response) => {
                if (response.ok) {
                    return response.status;
                }
                throw new Error(response.status);
            })
            .then((result) => {
                setSnackbarOpen(true);
                setSnackbarSeverity("success");
                setSnackbarMsg("Xác nhận đã nhận được hàng.");
                loadDataOrder();
            })
            .catch((error) => console.log("error", error));
    };
    const handleReturnsOrder = () => {
        fetch(
            API +
                "/order/auth/returns?" +
                new URLSearchParams({
                    id: order.id,
                }),
            {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        )
            .then((response) => {
                if (response.ok) {
                    return response.status;
                }
                throw new Error(response.status);
            })
            .then((result) => {
                setSnackbarOpen(true);
                setSnackbarSeverity("success");
                setSnackbarMsg("Xác nhận đã nhận được hàng.");
                loadDataOrder();
            })
            .catch((error) => console.log("error", error));
    };
    const handleSuccess = () => {
        fetch(
            API +
                "/order/auth/success?" +
                new URLSearchParams({
                    id: order.id,
                }),
            {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        )
            .then((response) => {
                if (response.ok) {
                    return response.status;
                }
                throw new Error(response.status);
            })
            .then((result) => {
                setSnackbarOpen(true);
                setSnackbarSeverity("success");
                setSnackbarMsg("Xác nhận đã nhận được hàng.");
                loadDataOrder();
            })
            .catch((error) => console.log("error", error));
    };
    const handleCancelOrder = () => {
        fetch(API + "/order/auth/cancel?id=" + order.id, {
            method: "PUT",
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
                setSnackbarMsg("Đã huỷ đơn hàng id= " + order.id + ".");
                handleClose();
                loadDataOrder();
            })
            .catch((error) => {
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("Lỗi huỷ đơn hàng id= " + order.id + "!");
                handleClose();
            });
    };
    const navigation = useNavigate();
    const handleTransaction = () => {
        fetch(API + "/transaction/auth/order/" + order.id, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.status);
            })
            .then((result) => {
                navigation(`/transaction/${result.id}`);
                console.log(result);
            })
            .catch((error) => {
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("Lỗi chuyển trang giao dịch!");
            });
    };

    React.useEffect(() => {
        setLoading(true);
        loadDataOrder();
        loadDataOrderDetail();
    }, [loadDataOrder, loadDataOrderDetail]);
    return (
        <div>
            <SnackbarMessage open={snackbarOpen} severity={snackbarSeverity} message={snackbarMsg} onClose={snackbarClose} />
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Bạn có chắc muốn huỷ đơn hàng id: {order.id} không?</DialogTitle>

                <DialogActions>
                    <Button onClick={handleClose}>Không</Button>
                    <Button onClick={handleCancelOrder}>Huỷ đơn hàng</Button>
                </DialogActions>
            </Dialog>
            <section className="h-100 gradient-custom" style={{ backgroundColor: "#eee" }}>
                <div className="container py-5">
                    <div className="row d-flex justify-content-center my-4">
                        <div className="col-md-8">
                            <div className="card mb-4">
                                <div className="card-header py-3">
                                    <h5 className="mb-0">Order item - {orderDetail.length} items</h5>
                                </div>
                                <div className="card-body">
                                    {/* Single item start */}
                                    <SingleItem />
                                    {/* Single item end */}
                                </div>
                            </div>
                            <div className="card mb-4">
                                <div className="card-header py-3">
                                    <h5 className="mb-0">Trạng thái đơn hàng</h5>
                                </div>
                                <div className="card-body">
                                    <Box sx={{ width: "100%", my: 2 }}>
                                        {order.status === 0 ||
                                        order.status === 1 ||
                                        order.status === 2 ||
                                        order.status === 3 ||
                                        order.status === 4 ? (
                                            <Stepper activeStep={order.status + 1}>
                                                {steps.map((label) => (
                                                    <Step key={label}>
                                                        <StepLabel>{label}</StepLabel>
                                                    </Step>
                                                ))}
                                            </Stepper>
                                        ) : null}
                                        {order.status === 5 || order.status === 6 ? (
                                            <Box sx={{ my: 2 }} className=" d-flex justify-content-between">
                                                <Typography>Status: </Typography>
                                                {order.status === 5 ? (
                                                    <Typography color="error">User - Huỷ</Typography>
                                                ) : (
                                                    <Typography color="error">Admin - Huỷ</Typography>
                                                )}
                                            </Box>
                                        ) : null}
                                        {order.status === 7 || order.status === 8 ? (
                                            <Stepper activeStep={order.status - 6}>
                                                {steps2.map((label) => (
                                                    <Step key={label}>
                                                        <StepLabel>{label}</StepLabel>
                                                    </Step>
                                                ))}
                                            </Stepper>
                                        ) : null}
                                    </Box>
                                    <Box sx={{ my: 2 }} className=" d-flex justify-content-between">
                                        <Typography>Created At:</Typography>
                                        <Input
                                            type="datetime-local"
                                            value={format(new Date(order.createdAt), "yyyy-MM-dd'T'hh:mm:ss")}
                                        />
                                    </Box>
                                    {order.updatedAt ? (
                                        <Box sx={{ my: 2 }} className=" d-flex justify-content-between">
                                            <Typography>Updated At:</Typography>
                                            <Input
                                                type="datetime-local"
                                                value={format(new Date(order.updatedAt), "yyyy-MM-dd'T'hh:mm:ss")}
                                            />
                                        </Box>
                                    ) : null}
                                </div>
                            </div>
                            <div className="card mb-4 mb-lg-0">
                                <div className="card-body">
                                    <p>
                                        <strong>We accept</strong>
                                    </p>
                                    <img
                                        className="me-2"
                                        width="75px"
                                        src="https://images.careerbuilder.vn/employer_folders/lot2/154592/140244ncbbank.jpg"
                                        alt="NCB"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            {loading ? <Loading /> : <ShowDataOrder />}
                            {order.status !== 0 ? (
                                <div className="card mb-4 card-body ">
                                    <button type="button" className="btn btn-primary btn-block" onClick={handleTransaction}>
                                        Transaction
                                    </button>
                                </div>
                            ) : null}
                            <div className="card mb-4 card-body ">
                                <div className="d-flex form-group justify-content-between">
                                    <Link to={"/orders"}>
                                        <button type="reset" className="btn btn-dark btn-block">
                                            Trở lại
                                        </button>
                                    </Link>
                                    {order.status === 0 || order.status === 1 || order.status === 2 ? (
                                        <button className="btn btn-danger btn-block" onClick={handleClickOpen}>
                                            Huỷ đơn
                                        </button>
                                    ) : null}
                                    {order.status === 2 ? (
                                        <button className="btn btn-info btn-block" onClick={handleReceiveOrder}>
                                            Xác nhận đã nhận hàng
                                        </button>
                                    ) : null}
                                    {order.status === 3 ? (
                                        <button className="btn btn-danger btn-block" onClick={handleReturnsOrder}>
                                            Hoàn trả
                                        </button>
                                    ) : null}
                                    {order.status === 3 ? (
                                        <button className="btn btn-primary btn-block" onClick={handleSuccess}>
                                            Thành công
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default OrderDetail;