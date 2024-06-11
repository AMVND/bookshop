import React, { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../Api/Api";
function PaymentLoading() {
    const location = useLocation();
    const navigation = useNavigate();

    const searchParams = new URLSearchParams(location.search);
    const vnp_Amount = searchParams.get("vnp_Amount");
    const vnp_BankCode = searchParams.get("vnp_BankCode");
    const vnp_BankTranNo = searchParams.get("vnp_BankTranNo");
    const vnp_CardType = searchParams.get("vnp_CardType");
    const vnp_OrderInfo = searchParams.get("vnp_OrderInfo");
    const vnp_PayDate = searchParams.get("vnp_PayDate");
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const vnp_TmnCode = searchParams.get("vnp_TmnCode");
    const vnp_TransactionNo = searchParams.get("vnp_TransactionNo");
    const vnp_TransactionStatus = searchParams.get("vnp_TransactionStatus");
    const vnp_TxnRef = searchParams.get("vnp_TxnRef");
    const vnp_SecureHash = searchParams.get("vnp_SecureHash");
    const checkPayment = React.useCallback(() => {
        fetch(API + "/transaction/auth/check_payment", {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                vnp_Amount: vnp_Amount,
                vnp_BankCode: vnp_BankCode,
                vnp_BankTranNo: vnp_BankTranNo,
                vnp_CardType: vnp_CardType,
                vnp_OrderInfo: vnp_OrderInfo,
                vnp_PayDate: vnp_PayDate,
                vnp_ResponseCode: vnp_ResponseCode,
                vnp_TmnCode: vnp_TmnCode,
                vnp_TransactionNo: vnp_TransactionNo,
                vnp_TransactionStatus: vnp_TransactionStatus,
                vnp_TxnRef: vnp_TxnRef,
                vnp_SecureHash: vnp_SecureHash,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.status);
            })
            .then((result) => {
                console.log(result);
                if (result.status === "Ok" || result.message === "true") {
                    alert("Giao dịch thành công");
                    navigation(`/transaction/${result.data}`);
                } else {
                    alert("Giao dịch không thành công");
                    // navigation(`/orders/${vnp_TxnRef}`);
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    }, [
        navigation,
        vnp_Amount,
        vnp_BankCode,
        vnp_BankTranNo,
        vnp_CardType,
        vnp_OrderInfo,
        vnp_PayDate,
        vnp_ResponseCode,
        vnp_SecureHash,
        vnp_TmnCode,
        vnp_TransactionNo,
        vnp_TransactionStatus,
        vnp_TxnRef,
    ]);
    useEffect(() => {
        checkPayment();
    }, [checkPayment]);
    return (
        <div>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "70vh",
                }}
            >
                <CircularProgress size={80} /> {/* Kích thước của CircularProgress */}
            </Box>
            {/* <h1>Vui lòng chờ ...</h1>
            <h1>Transaction Page</h1>
            <p>vnp_Amount: {vnp_Amount}</p>
            <p>vnp_BankCode: {vnp_BankCode}</p>
            <p>vnp_BankTranNo: {vnp_BankTranNo}</p>
            <p>vnp_CardType: {vnp_CardType}</p>
            <p>vnp_OrderInfo: {vnp_OrderInfo}</p>
            <p>vnp_PayDate: {vnp_PayDate}</p>
            <p>vnp_ResponseCode: {vnp_ResponseCode}</p>
            <p>vnp_TmnCode: {vnp_TmnCode}</p>
            <p>vnp_TransactionNo: {vnp_TransactionNo}</p>
            <p>vnp_TransactionStatus: {vnp_TransactionStatus}</p>
            <p>vnp_TxnRef: {vnp_TxnRef}</p>
            <p>vnp_SecureHash: {vnp_SecureHash}</p> */}
        </div>
    );
}

export default PaymentLoading;