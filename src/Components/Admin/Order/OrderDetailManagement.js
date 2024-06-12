import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
//
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, Input, Typography } from "@mui/material";
//
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
//
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { format } from "date-fns";
import { VND } from "../../Unity/VND";
import API from "../../Api/Api";
import SnackbarMessage from "../../Layout/SnackbarMessage";
import axios from "axios";

export default function OrderDetailManagement() {
    const steps = ["Chờ xác nhận", "Đang vận chuyển", "Đang giao", "Đã nhận"];
    const steps2 = ["Hoàn trả", "Đã hoàn trả"];
    // id của order
    const { id } = useParams();
    //
    // const [status, setStatus] = useState({});
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
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
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
        axios
            .get(API + "/order-item/auth/admin/o/" + id, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
            .then((res) => {
                console.log("cart-item", res);
                setLoading(false);
                setOrderDetail(res.data);
            })
            .catch((error) => console.log("error", error));
    }, [id]);
    // admin thực hiện get data của order
    const loadDataOrder = React.useCallback(() => {
        axios
            .get(API + "/order/auth/admin/p/" + id, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
            .then((res) => {
                console.log("order", res.data);
                setOrder(res.data);
                // setStatus(res.data.status);
            })
            .catch((error) => console.log("error", error));
    }, [id]);
    const navigation = useNavigate();
    const handleTransaction = () => {
        fetch(API + "/transaction/auth/admin/order/" + order.id, {
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
                navigation(`/admin/transaction/${result.id}`);
                console.log(result);
            })
            .catch((error) => {
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("Lỗi chuyển trang giao dịch!");
            });
    };
    // xác nhận vận chuyển hàng của đơn hàng: 0 -> 1
    const handleShippingOrder = () => {
        fetch(
            API +
                "/order/auth/admin/shipping?" +
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
                setSnackbarMsg("Xác nhận đơn hàng! Đơn hàng được chuyển giao sang bên vận chuyển.");
                loadDataOrder();
            })
            .catch((error) => console.log("error", error));
    };
    // xác nhận đang giao hàng cho đơn hàng: 1 -> 2
    const handleDeliveryOrder = () => {
        axios
            .put(`${API}/order/auth/admin/delivery`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                params: {
                    id: order.id,
                },
            })
            .then((res) => {
                setSnackbarOpen(true);
                setSnackbarSeverity("success");
                setSnackbarMsg("Xác nhận đơn hàng đã vận chuyển! Đơn hàng được chuyển giao tới khách hàng.");
                loadDataOrder();
            })
            .catch((error) => console.error("error", error));
        // fetch(
        //     API +
        //         "/order/auth/admin/delivery?" +
        //         new URLSearchParams({
        //             id: order.id,
        //         }),
        //     {
        //         method: "PUT",
        //         headers: {
        //             Authorization: "Bearer " + localStorage.getItem("token"),
        //         },
        //     }
        // )
        //     .then((response) => {
        //         if (response.ok) {
        //             return response.status;
        //         }
        //         throw new Error(response.status);
        //     })
        //     .then((result) => {
        //         setSnackbarOpen(true);
        //         setSnackbarSeverity("success");
        //         setSnackbarMsg("Xác nhận đơn hàng đã vận chuyển! Đơn hàng được chuyển giao tới khách hàng.");
        //         loadDataOrder();
        //     })
        //     .catch((error) => console.log("error", error));
    };
    // admin - xác nhận đã hoàn trả hàng: 7 -> 8
    const handleReturnedOrder = () => {
        fetch(
            API +
                "/order/auth/admin/returned?" +
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
                throw Error(response.status);
            })
            .then((result) => {
                setSnackbarOpen(true);
                setSnackbarSeverity("success");
                setSnackbarMsg("Xác nhận đơn hàng đã được hoàn trả thành công.");
                loadDataOrder();
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("Xác nhận đơn hàng đã được hoàn trả không thành công!");
            });
    };
    // admin huỷ đơn hàng: 0 || 1 || 2 -> 5
    const handleCancelOrder = () => {
        fetch(API + "/order/auth/admin/cancel?id=" + order.id, {
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
                setSnackbarMsg("Xác nhận huỷ đơn hàng!");
                handleClose();
                loadDataOrder();
            })
            .catch((error) => console.log("error", error));
    };
    // xác nhận đã hoàn trả hàng: 7 -> 8
    // const handleReturned = () => {
    //     fetch(
    //         API +
    //             "/order/auth/admin/returned?" +
    //             new URLSearchParams({
    //                 id: order.id,
    //             }),
    //         {
    //             method: "PUT",
    //             headers: {
    //                 Authorization: "Bearer " + localStorage.getItem("token"),
    //             },
    //         }
    //     )
    //         .then((response) => {
    //             if (response.ok) {
    //                 return response.status;
    //             }
    //             throw Error(response.status);
    //         })
    //         .then((result) => {
    //             setSnackbarOpen(true);
    //             setSnackbarSeverity("success");
    //             setSnackbarMsg("Xác nhận hoàn trả! Đơn hàng sẽ được gửi trả về đơn vị, đồng thời hoàn tiền cho khách hàng.");
    //             loadDataOrder();
    //         })
    //         .catch((error) => console.log("error", error));
    // };

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
                <DialogTitle id="alert-dialog-title" style={{ width: "20rem" }}>
                    Huỷ đơn hàng: {order.id}
                </DialogTitle>

                <DialogContent>
                    <DialogContentText className="mb-3">Thực hiện huỷ đơn hàng? </DialogContentText>
                </DialogContent>
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
                                        {order.status === 0 || order.status === 1 || order.status === 2 || order.status === 3 ? (
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
                                        width="45px"
                                        src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg"
                                        alt="Visa"
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
                                <div className="row form-group ">
                                    <Link to={"/admin/order"} className="col-auto mx-auto mb-3">
                                        <button className="btn btn-dark btn-block ">Trở lại</button>
                                    </Link>
                                    {order.status === 0 ? (
                                        <button
                                            type="button"
                                            className="btn btn-info btn-block col-auto mx-auto mb-3"
                                            onClick={handleShippingOrder}
                                        >
                                            Xác nhận - Đang vận chuyển
                                        </button>
                                    ) : null}
                                    {order.status === 1 ? (
                                        <button
                                            type="button"
                                            className="btn btn-info btn-block col-auto mx-auto mb-3"
                                            onClick={handleDeliveryOrder}
                                        >
                                            Xác nhận - Đang giao
                                        </button>
                                    ) : null}

                                    {order.status === 0 || order.status === 1 || order.status === 2 ? (
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-block col-auto mx-auto mb-3"
                                            onClick={handleClickOpen}
                                        >
                                            Huỷ đơn hàng
                                        </button>
                                    ) : null}
                                    {order.status === 7 ? (
                                        <button
                                            type="button"
                                            className="btn btn-info btn-block col-auto mx-auto mb-3"
                                            onClick={handleReturnedOrder}
                                        >
                                            Đã hoàn trả
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