import * as React from "react";
//
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
//
import HomeIcon from "@mui/icons-material/Home";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WidgetsIcon from "@mui/icons-material/Widgets";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import ErrorIcon from "@mui/icons-material/Error";
import { VND } from "../Unity/VND";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";
// LabTabs
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import API from "../Api/Api";
import SnackbarMessage from "../Layout/SnackbarMessage";
//

function Orders() {
    // Lấy thông tin tử url
    const location = useLocation();
    const navigation = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    let statusParams = searchParams.get("status");
    const [status, setStatus] = React.useState("0");

    //
    const [loading, setLoading] = React.useState(false);
    const [order, setOrder] = React.useState([]);
    const [dialogItem, setDialogItem] = React.useState();
    //
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg] = React.useState("");
    const [snackbarSeverity] = React.useState("warning");
    //
    const [open, setOpen] = React.useState(false);
    //

    const handleChange = (event, value) => {
        // setLoading(true);
        // setStatus(newValue);
        navigation(`/orders?status=${value}`)
    };

    const handleClose = () => {
        setOpen(false);
        setDialogItem();
    };
    //
    const snackbarClose = () => {
        setSnackbarOpen(false);
    };
    const loadDataOrder = React.useCallback(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch(API + "/order/auth/user?status=" + status, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.status);
            })
            .then((result) => {
                // console.log(result);
                setLoading(false);
                setOrder(result);
            })
            .catch((error) => {
                console.log("error", error);
            });
    },[status]);
    const Loading = () => {
        return (
            <Stack>
                <Skeleton variant="rounded" sx={{ marginBlock: 1 }} height={120} />
                <Skeleton variant="rounded" sx={{ marginBlock: 1 }} height={120} />
                <Skeleton variant="rounded" sx={{ marginBlock: 1 }} height={120} />
            </Stack>
        );
    };
    const LabTabs = () => {
        return (
            <Box sx={{ width: "100%", typography: "body1", mb: 5 }}>
                <TabContext value={status}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <TabList
                            onChange={handleChange}
                            aria-label="lab API tabs example"
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                        >
                            <Tab icon={<AssignmentIcon />} iconPosition="start" label="Chờ xử lý" value="0" />
                            <Tab icon={<WidgetsIcon />} iconPosition="start" label="Đang vận chuyển" value="1" />
                            <Tab icon={<LocalShippingIcon />} iconPosition="start" label="Đang giao" value="2" />
                            <Tab icon={<HomeIcon />} iconPosition="start" label="Đã nhận" value="3" />
                            <Tab icon={<ErrorIcon />} iconPosition="start" label="Hoàn thành" value="4" />
                            <Tab icon={<ErrorIcon />} iconPosition="start" label="Đã huỷ" value="5" />
                            <Tab icon={<ErrorIcon />} iconPosition="start" label="Bị huỷ" value="6" />
                            <Tab icon={<AssignmentReturnIcon />} iconPosition="start" label="Hoàn trả" value="7" />
                            <Tab icon={<AssignmentReturnIcon />} iconPosition="start" label="Đã hoàn trả" value="8" />
                        </TabList>
                    </Box>
                    {/* <TabPanel value="0">Item One</TabPanel>
                    <TabPanel value="2">Item Two</TabPanel>
                    <TabPanel value="3">Item Three</TabPanel>
                    <TabPanel value="4">Item Four</TabPanel> */}
                </TabContext>
            </Box>
        );
    };
    React.useEffect(() => {
        setLoading(true);
        if (statusParams) {
            setStatus(statusParams);
        }
        loadDataOrder();
    }, [loadDataOrder, statusParams]);

    const ShowOrders = () => {
        return (
            <>
                {/* Thông tin order */}
                {order.length > 0 ? (
                    <>
                        {order.map((item, i) => {
                            return (
                                <div className="card rounded-3 mb-4" key={i}>
                                    <div className="card-body p-4">
                                        <div className="row d-flex justify-content-between align-items-center">
                                            {/* 1 */}
                                            <div className="col-md-5 col-lg-5 col-xl-5">
                                                <p className="lead fw-normal mb-2 ">
                                                    <span className="text-muted">Mã đơn hàng:</span> {item.id}
                                                </p>

                                                <p>
                                                    <span className="text-muted">Tổng tiền: </span>
                                                    {VND.format(item.total)}
                                                </p>
                                                <p>
                                                    <span className="text-muted">Ghi chú: </span>
                                                    {item.content}
                                                </p>
                                            </div>

                                            {/* 3 */}
                                            <div className="col-md-5 col-lg-4 col-xl-4 offset-lg-1">
                                                <p>
                                                    <span className="text-muted">
                                                        Trạng thái:{" "}
                                                        {item.status === 0
                                                            ? "Chờ xác nhận"
                                                            : null || item.status === 1
                                                            ? "Đang vận chuyển"
                                                            : null || item.status === 2
                                                            ? "Đang giao"
                                                            : null || item.status === 3
                                                            ? "Đã nhận"
                                                            : null || item.status === 4
                                                            ? "Hoàn thành"
                                                            : null || item.status === 5
                                                            ? "Đã Huỷ"
                                                            : null || item.status === 6
                                                            ? "Bị Huỷ"
                                                            : null || item.status === 7
                                                            ? "Hoàn trả"
                                                            : null || item.status === 8
                                                            ? "Đã hoàn trả"
                                                            : null}
                                                    </span>
                                                </p>
                                                <p>
                                                    <span>
                                                        <span className="text-muted">Thời gian tạo: </span>
                                                        {format(parseISO(item.createdAt), "dd-MM-yyyy")}
                                                    </span>
                                                </p>
                                                <p>
                                                    {item.updatedAt ? (
                                                        <span>
                                                            <span className="text-muted">Thời gian cập nhật: </span>
                                                            {formatDistanceToNow(new Date(item.updatedAt), {
                                                                locale: vi,
                                                                addSuffix: true,
                                                            })}
                                                        </span>
                                                    ) : null}
                                                </p>
                                            </div>
                                            {/* 4 */}
                                            <div className="col-md-2 col-lg-2 col-xl-2 text-end justify-content-end d-flex">
                                                <Link to={`/orders/${item.id}`}>
                                                    <button className="btn btn-outline-dark">Xem chi tiết</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <Stack sx={{ width: "100%" }} spacing={2}>
                        <Alert severity="info">Không có đơn hàng nào!</Alert>
                    </Stack>
                )}
            </>
        );
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
            <SnackbarMessage open={snackbarOpen} severity={snackbarSeverity} message={snackbarMsg} onClose={snackbarClose} />
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
                            <Button onClick={handleClose} autoFocus>
                                Xoá
                            </Button>
                        </DialogActions>
                    </>
                ) : null}
            </Dialog>
            <section className="h-100" style={{ backgroundColor: "#eee" }}>
                <div className="container h-100 py-5">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-11">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-normal mb-0 text-black">Đơn hàng</h3>
                                {/* <div>
                                    <p className="mb-0">
                                        <span className="text-muted">Sort by:</span> <span className="text-body">Id</span>
                                    </p>
                                </div> */}
                            </div>
                            {/* LabTabs start */}
                            <LabTabs />
                            {/* LabTabs end */}

                            {loading ? <Loading /> : <ShowOrders />}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Orders;