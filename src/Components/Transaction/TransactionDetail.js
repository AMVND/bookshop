import React from "react";
import { Link, useParams } from "react-router-dom";
//

import {  Input, Skeleton, Stack, Typography } from "@mui/material";

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
import { VND } from "../Unity/VND";
import API from "../Api/Api";
import SnackbarMessage from "../Layout/SnackbarMessage";

export default function TransactionDetail() {
    //

    //
    const steps = ["Chưa thanh toán", "Đã thanh toán"];
    const steps2 = ["Chưa hoàn trả", "Đã hoàn trả"];
    // id của data
    const { id } = useParams();
    //
    // const [status, setStatus] = useState({});
    const [data, setData] = React.useState({
        id: "",
        user: {},
        order: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const [loading, setLoading] = React.useState(false);
    
    //
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("warning");
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    // Đóng snackbar
    const snackbarClose = () => {
        setSnackbarOpen(false);
    };

    // admin thực hiện get data của data
    const loadDataTransaction = React.useCallback(() => {
        fetch(API+"/transaction/auth/" + id, {
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
                console.log("data", result);
                setLoading(false);
                setData(result);
                // setStatus(result.status);
            })
            .catch((error) => console.log("error", error));
    },[id]);

    const Loading = () => {
        return (
            <Stack>
                <Skeleton variant="rounded" sx={{ marginBlock: 1 }} height={120} />
                <Skeleton variant="rounded" sx={{ marginBlock: 1 }} height={120} />
                <Skeleton variant="rounded" sx={{ marginBlock: 1 }} height={120} />
            </Stack>
        );
    };
    // Thông tin của phiếu data
    const ShowDatadata = () => {
        return (
            <div className="card mb-4">
                <div className="card-header py-3">
                    <h5 className="mb-0">Thông tin</h5>
                </div>
                <div className="card-body">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                            Mã phiếu thanh toán
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {data.id}
                            </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                            Mã phiếu order
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {data.order.id}
                            </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                            Mã giao dịch
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {data.code}
                            </span>
                        </li>
                        {/* <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                            Loại giao dịch
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {data.type }
                            </span>
                        </li> */}
                        <li className="list-group-item d-flex justify-content-between align-items-center  px-0 ">
                            Phương thức giao dịch
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {data.mode === 0 ? "Thanh toán qua Web" : "Thanh toán khi nhận hàng (Tiền mặt)"}
                            </span>
                        </li>

                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                            Người đặt hàng
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {data.user.firstName + " " + data.user.lastName}
                            </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                            Mobile
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {data.user.mobile}
                            </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center  px-0 ">
                            Email
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {data.user.email}
                            </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                            Address
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {data.order.line1}
                            </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                            City
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {data.order.city}
                            </span>
                        </li>
                        {/* <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                            Country
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {data.order.country}
                            </span>
                        </li> */}
                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                            Content
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {data.content}
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
                                <strong>{VND.format(data.order.total)}</strong>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        );
    };

    const handlePayment = () => {
        fetch(API+"/transaction/auth/payment/" + data.id, {
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
                // setSnackbarOpen(true);
                // setSnackbarSeverity("success");
                // setSnackbarMsg("Đã thanh toán thành công.");
                // loadDataTransaction();
                console.log(result);
                window.open(result.url);
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("GD chưa được thực hiện!");
            });
    };
    const handleRefunded = () => {
        fetch("/transaction/auth/refunded/" + data.id, {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.status;
                }
                throw Error(response.status);
            })
            .then((result) => {
                setSnackbarOpen(true);
                setSnackbarSeverity("success");
                setSnackbarMsg("Đã thanh toán thành công.");
                loadDataTransaction();
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("Thanh toán không thành công!");
            });
    };

    React.useEffect(() => {
        setLoading(true);
        loadDataTransaction();
    }, [loadDataTransaction]);
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
                    Huỷ đơn hàng: {data.id}
                </DialogTitle>

                <DialogContent>
                    <DialogContentText className="mb-3">Thực hiện huỷ đơn hàng? </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Không</Button>
                    <Button onClick={handleClose}>Huỷ đơn hàng</Button>
                </DialogActions>
            </Dialog>
            <section className="h-100 gradient-custom" style={{ backgroundColor: "#eee" }}>
                <div className="container py-5">
                    <div className="row d-flex justify-content-center my-4">
                        <div className="col-lg-8">
                            {loading ? <Loading /> : <ShowDatadata />}
                            <div className="card mb-4">
                                <div className="card-header py-3">
                                    <h5 className="mb-0">Transaction</h5>
                                </div>
                                <div className="card-body">
                                    <Typography>Status</Typography>
                                    <Box sx={{ width: "100%", my: 2 }}>
                                        {data.status === 0 || data.status === 1 || data.status === 2 ? (
                                            <Stepper activeStep={data.status + 1}>
                                                {steps.map((label) => (
                                                    <Step key={label}>
                                                        <StepLabel>{label}</StepLabel>
                                                    </Step>
                                                ))}
                                            </Stepper>
                                        ) : null}
                                        {data.status === 3 || data.status === 4 ? (
                                            <Box sx={{ my: 2 }} className=" d-flex justify-content-between">
                                                <Typography>Status: </Typography>
                                                {data.status === 3 ? (
                                                    <Typography>Đã huỷ</Typography>
                                                ) : (
                                                    <Typography>Bị huỷ</Typography>
                                                )}
                                            </Box>
                                        ) : null}
                                        {data.status === 6 || data.status === 7 ? (
                                            <Stepper activeStep={data.status - 5}>
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
                                            value={format(new Date(data.createdAt), "yyyy-MM-dd'T'hh:mm:ss")}
                                        />
                                    </Box>
                                    {data.updatedAt ? (
                                        <Box sx={{ my: 2 }} className=" d-flex justify-content-between">
                                            <Typography>Updated At:</Typography>
                                            <Input
                                                type="datetime-local"
                                                value={format(new Date(data.updatedAt), "yyyy-MM-dd'T'hh:mm:ss")}
                                            />
                                        </Box>
                                    ) : null}
                                </div>
                            </div>

                            <div className="card mb-4 card-body ">
                                <div className="row form-group ">
                                    <Link to={`/orders/${data.order.id}`} className="col-auto mx-auto mb-3">
                                        <button type="button" className="btn btn-dark btn-block ">
                                            Trở lại
                                        </button>
                                    </Link>
                                    {data.status === 0 ? (
                                        <button
                                            type="button"
                                            className="btn btn-info btn-block col-auto mx-auto mb-3"
                                            onClick={handlePayment}
                                        >
                                            Thanh toán
                                        </button>
                                    ) : null}

                                    {data.status === 6 ? (
                                        <button className="btn btn-info btn-block col-auto mx-auto mb-3" onClick={handleRefunded}>
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