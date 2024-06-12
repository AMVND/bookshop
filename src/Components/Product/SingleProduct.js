import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Rating,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { VND } from "../Unity/VND";
import CommentForm from "./CommentForm";
import API from "../Api/Api";
import SnackbarMessage from "../Layout/SnackbarMessage";
function SingleProduct() {
    const { slug } = useParams();
    const [product, setProduct] = useState({
        id: "",
        user: {},
        rating: {},
    });
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = React.useState(1);
    // đánh giá
    const [checkRating, setCheckRating] = React.useState(false);
    const [dataRating, setDataRating] = React.useState();
    const [rating, setRating] = React.useState(10);
    const [ratingTitle, setRatingTitle] = React.useState("");
    const [ratingContent, setRatingContent] = React.useState("");
    //
    const [open, setOpen] = React.useState(false);

    //Drawer
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("warning");
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
    const loadDataProduct = React.useCallback(() => {
        fetch(API + "/product/api/findProductBySlug/" + slug).then((resp) => {
            resp.json().then((result) => {
                // console.log(result);
                setLoading(false);
                setProduct(result);
                handleCheckReview(result);
            });
        });
    },[slug]);

    useEffect(() => {
        setLoading(true);
        loadDataProduct();
    }, [loadDataProduct]);
    // kiểm tra sản phẩm đã được chủ đăng nhập đánh giá hay chưa
    const handleCheckReview = (result) => {
        if (localStorage.getItem("token")) {
            fetch(API + "/product-review/auth/product?productId=" + result.id, {
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
                    if (result !== null) {
                        setCheckRating(true);
                        // console.log(result);
                        setDataRating(result);
                    }
                })
                .catch((error) => {
                    setCheckRating(false);
                });
        }
    };
    const handleReviewProduct = () => {
        console.log(rating, ratingTitle, ratingContent);
        if (rating === 0 || ratingTitle === "") {
            setSnackbarOpen(true);
            setSnackbarSeverity("warning");
            setSnackbarMsg("Thông tin đánh giá chưa hợp lệ");
            return;
        }
        fetch(API + "/product-review/auth/create", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId: product.id,
                rating: rating,
                title: ratingTitle,
                content: ratingContent,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.status;
                }
                throw Error(response.status);
            })
            .then((result) => {
                // console.log(result);
                setSnackbarOpen(true);
                setSnackbarSeverity("success");
                setSnackbarMsg("Thành công");
                setOpen(false);
                loadDataProduct();
                setRating(10);
                setRatingTitle("");
                setRatingContent("");
            })
            .catch((error) => {
                // console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("False");
            });
    };
    

    const Loading = () => {
        return <>Loading . . .</>;
    };

    const ShowUser = () => {
        return (
            <div>
                <br />
                <div className="card mb-4 w-100">
                    <div className="card-header py-3">
                        <h5 className="mb-0 text-capitalize">Người bán</h5>
                    </div>
                    <div className="card-body d-flex">
                        <Avatar alt="Remy Sharp" src={API + product.user.photos} variant="rounded" />
                        <p className="my-auto mx-3">
                            <Link to={"/user/" + product.user.id}>
                                <strong>{product.user.firstName + " " + product.user.lastName}</strong>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const handleAddToCart = () => {
        //
        if (quantity <= product.quantity) {
            fetch(API + "/cart/auth/active", {
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
                    fetch(API + "/cart-item/auth/create", {
                        method: "POST",
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            productId: product.id,
                            quantity: quantity,
                        }),
                    })
                        .then((response) => {
                            if (response.ok) {
                                return response.status;
                            }
                            throw new Error(response.status);
                        })
                        .then((result) => {
                            // console.log(result);
                            setSnackbarOpen(true);
                            setSnackbarSeverity("success");
                            setSnackbarMsg("Thành công");
                            loadDataProduct();
                        })
                        .catch((error) => {
                            // console.log("error", error);
                            setSnackbarOpen(true);
                            setSnackbarSeverity("error");
                            setSnackbarMsg("False");
                        });
                })
                .catch((error) => console.log("error", error));
        } else {
            setSnackbarOpen(true);
            setSnackbarSeverity("Số lượng đặt hàng không hợp lệ!");
            setSnackbarMsg("False");
        }

        //
    };

    return (
        <div>
            <SnackbarMessage open={snackbarOpen} severity={snackbarSeverity} message={snackbarMsg} onClose={snackbarClose} />

            {checkRating ? (
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Đánh giá sản phẩm</DialogTitle>
                    <DialogContent className="justify-content-center">
                        <Box
                            sx={{
                                my: 1,
                                justifyContent: "center",
                                display: "flex",
                            }}
                        >
                            <Rating name="customized-10" defaultValue={dataRating.rating} max={10} readOnly />
                        </Box>
                        <Box
                            sx={{
                                mb: 2,
                                minWidth: "25rem",
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Mô tả trải nghiệm"
                                id="fullWidth"
                                defaultValue={dataRating.title}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Box>
                        <TextField
                            id="outlined-multiline-static"
                            label="Chi tiết"
                            defaultValue={dataRating.content}
                            rows={1}
                            fullWidth
                            multiline
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Đóng</Button>
                    </DialogActions>
                </Dialog>
            ) : (
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Đánh giá sản phẩm</DialogTitle>
                    <DialogContent className="justify-content-center">
                        <Box
                            sx={{
                                my: 1,
                                justifyContent: "center",
                                display: "flex",
                            }}
                        >
                            <Rating
                                name="customized-10"
                                value={parseInt(rating)}
                                onChange={(e) => setRating(e.target.value)}
                                max={10}
                            />
                        </Box>
                        <Box
                            sx={{
                                mb: 2,
                                minWidth: "25rem",
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Mô tả trải nghiệm"
                                id="fullWidth"
                                required
                                value={ratingTitle}
                                onChange={(e) => setRatingTitle(e.target.value)}
                            />
                        </Box>
                        <TextField
                            id="outlined-multiline-static"
                            label="Chi tiết"
                            fullWidth
                            multiline
                            rows={1}
                            value={ratingContent}
                            onChange={(e) => setRatingContent(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Huỷ</Button>
                        <Button onClick={handleReviewProduct}>Lưu</Button>
                    </DialogActions>
                </Dialog>
            )}

            <div className="container py-5">
                <div className="row py-4">
                    {loading ? (
                        <Loading />
                    ) : (
                        <>
                            <div className="col-sm-6 d-flex justify-content-center border">
                                <img src={API + product.photos} alt={product.title} height={"400px"} width={"400px"} />
                            </div>
                            <div className="col-md-6">
                                <h1 className="display-5">{product.title}</h1>
                                <p className="lead">Loại sản phẩm: {product.category}</p>

                                <p className="lead">Hiện còn: {product.quantity}</p>

                                {product.discount === 0 ? (
                                    <>
                                        <h3 className="display-6 fw-bold my-4">{VND.format(product.price)} </h3>
                                    </>
                                ) : (
                                    <>
                                        <p className="lead">
                                            Giá: <del className="text-danger">{VND.format(product.price)} </del>
                                        </p>
                                        <h3 className="display-6 fw-bold my-4">
                                            <span className="lead">Chỉ cần: </span>
                                            {VND.format(product.price - (product.price * product.discount) / 100)}
                                        </h3>
                                    </>
                                )}
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBlock: 2,
                                    }}
                                >
                                    <Rating name="read-only" value={product.rating.diem} precision={0.5} max={10} readOnly />
                                    <Box sx={{ ml: 2 }}>
                                        <Typography component="legend">{product.rating.dem} đánh giá</Typography>
                                    </Box>
                                </Box>

                                <p className="">{product.summary}</p>

                                <div className=" d-flex  my-3">
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
                                        min={0}
                                        max={product.quantity}
                                        name="quantity"
                                        value={quantity}
                                        type="number"
                                        className="form-control form-control-sm"
                                        onChange={(e) => {
                                            if (e.target.value < 0) {
                                                setQuantity(0);
                                            } else if (e.target.value > product.quantity) {
                                                setQuantity(product.quantity);
                                            } else {
                                                setQuantity(e.target.value);
                                            }
                                        }}
                                    />

                                    <IconButton
                                        sx={{ mx: 1 }}
                                        onClick={() => {
                                            if (quantity < product.quantity) {
                                                setQuantity((i) => parseInt(i, 10) + 1);
                                            }
                                        }}
                                    >
                                        <AddIcon className="text-primary" />
                                    </IconButton>
                                </div>

                                {localStorage.getItem("token") !== null ? (
                                    <>
                                        {product.status === 1 && product.quantity !== 0 ? (
                                            <>
                                                <button
                                                    className="btn btn-info ms-2 px-3 py-2"
                                                    onClick={() => {
                                                        if (quantity <= 0) {
                                                            setSnackbarOpen(true);
                                                            setSnackbarSeverity("error");
                                                            setSnackbarMsg("Số lượng sản phẩm không hợp lệ");
                                                        } else {
                                                            handleAddToCart();
                                                        }
                                                    }}
                                                >
                                                    Add to Cart
                                                </button>
                                                <button className="btn btn-warning ms-2 px-3 py-2" onClick={handleClickOpen}>
                                                    Đánh giá
                                                </button>
                                            </>
                                        ) : (
                                            <button className="btn btn-danger ms-2 px-3 py-2">
                                                Sản phẩm hiện không khả dụng
                                            </button>
                                        )}
                                    </>
                                ) : null}
                            </div>
                            <div className=" justify-content-center my-4">
                                <div className="card  mb-4 w-100">
                                    <div className="card-header py-3">
                                        <h5 className="mb-0 text-capitalize">Thông tin chi tiết</h5>
                                    </div>
                                    <div className="card-body">
                                        <pre style={{ fontSize: "1rem", fontFamily: "Roboto,Helvetica,Arial" }}>
                                            {product.content}
                                        </pre>
                                    </div>
                                </div>
                                <ShowUser />
                                <CommentForm product={product} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SingleProduct;