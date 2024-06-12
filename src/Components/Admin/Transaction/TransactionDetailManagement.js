import React from "react";
import { Link, useParams } from "react-router-dom";
//
import { Input,  Skeleton, Stack, Typography } from "@mui/material";

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

export default function TransactionDetailManagement() {
    const steps = ["Chưa thanh toán", "Đã thanh toán", "Thành công"];
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
    // Nhận thông tin của data: item được chọn
    // const [dataItem, setDataItem] = React.useState();
    //
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg] = React.useState("");
    const [snackbarSeverity] = React.useState("warning");
    const [open, setOpen] = React.useState(false);

    // const handleClickOpen = () => {
    //     setOpen(true);
    // };

    const handleClose = () => {
        setOpen(false);
    };

    // Đóng snackbar
    const snackbarClose = () => {
        setSnackbarOpen(false);
    };

    // admin thực hiện get data của data
    const loadDataTransaction = React.useCallback(() => {
        fetch(API+"/transaction/auth/admin/" + id, {
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
    // 0 -> Xác nhận đơn hàng -> chuyển giao tới đơn vị vận chuyển: 2
    // const handleConfirmdata = () => {};
    // 2 -> Xác nhận đã vận chuyển -> chuyển giao tới khách hàng: 3
    // const handleShipped = () => {};
    // 3 -> Xác nhận đã giao hàng -> đã nhận được hàng:5
    // const handleDelivered = () => {};
    // 0,2,3 -> Huỷ đơn hàng -> 1
    const handleCanceldata = () => {};
    // 5 -> Hoàn trả đơn hàng -> 4
    // const handleRefund = () => {
    //     fetch(
    //         "/data/auth/admin/set-status?" +
    //             new URLSearchParams({
    //                 id: data.id,
    //                 status: 4,
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
    //             loadDataTransaction();
    //         })
    //         .catch((error) => console.log("error", error));
    // };
    // Khôi phục đơn hàng
    // const handleRecovery = () => {
    //     fetch(
    //         API+"/data/auth/admin/set-status?" +
    //             new URLSearchParams({
    //                 id: data.id,
    //                 status: 0,
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
    //             setSnackbarMsg("Xác nhận khôi phục đơn hàng. Đã chuyển vào mục chờ xử lý");
    //             loadDataTransaction();
    //         })
    //         .catch((error) => console.log("error", error));
    // };

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
                                {data.type}
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
                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                            Country
                            <span className="w-auto" style={{ maxWidth: "75%" }}>
                                {data.order.country}
                            </span>
                        </li>
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
                    <Button onClick={handleCanceldata}>Huỷ đơn hàng</Button>
                </DialogActions>
            </Dialog>
            <section className="h-100 gradient-custom" style={{ backgroundColor: "#eee" }}>
                <div className="container py-5">
                    <div className="row d-flex justify-content-center my-4">
                        <div className="col-lg-8">
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

                            {loading ? <Loading /> : <ShowDatadata />}
                            <div className="card mb-4 card-body ">
                                <div className="row form-group ">
                                    <Link to={"/admin/transaction"} className="col-auto mx-auto mb-3">
                                        <button type="reset" className="btn btn-dark btn-block ">
                                            Trở lại
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}