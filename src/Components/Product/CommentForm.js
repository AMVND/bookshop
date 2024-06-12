import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";
import API from "../Api/Api";
import SnackbarMessage from "../Layout/SnackbarMessage";

export default function CommentForm(product) {
    const [replyParentId, setReplyParentId] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [commentTextReply, setCommentTextReply] = useState("");
    const [comment, setComment] = useState([]);
    const [commentReply, setCommentReply] = useState([]);
    const [user, setUser] = useState({});

    const [productId, setProductId] = useState({});
    //
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("warning");

    const [openDialog, setOpenDialog] = React.useState(false);
    const [dialogItem, setDialogItem] = React.useState();
    const handleClickOpenDialog = () => {
        // console.log(item);
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDialogItem();
    };
    const snackbarClose = () => {
        setSnackbarOpen(false);
    };
    const handleReply = (item) => {
        setCommentText("");
        setCommentTextReply("");
        setReplyParentId(item.id);
    };
    const handleDeleteComment = () => {
        fetch(
            `${API}/comment/auth?` +
                new URLSearchParams({
                    commentId: dialogItem.id,
                }),
            {
                method: "DELETE",
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
                setSnackbarMsg("Đã xoá thành công ");
                handleCloseDialog();
                filterCommentByProduct();
                filterCommentReply();
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("error! Xoá không thành công");
                handleCloseDialog();
            });
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!commentText.trim()) return;
        fetch(API + "/comment/auth", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId: product.product.id,
                content: commentText,
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
                setSnackbarMsg("Bình luận thành công.");
                filterCommentByProduct();
                filterCommentReply();
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("False");
            });
        setCommentText("");
        setReplyParentId(null);
    };
    const handleSubmitReply = (event) => {
        event.preventDefault();
        if (!commentTextReply.trim()) return;
        fetch(API + "/comment/auth", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId: product.product.id,
                content: commentTextReply,
                parentId: replyParentId,
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
                setSnackbarMsg("Bình luận thành công.");
                filterCommentByProduct();
                filterCommentReply();
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("False");
            });
        setCommentText("");
        setReplyParentId(null);
    };
    const handleCommentTextChange = (event) => {
        setCommentText(event.target.value);
    };
    const handleCommentTextReplyChange = (event) => {
        setCommentTextReply(event.target.value);
    };

    const filterCommentByProduct = React.useCallback(() => {
        fetch(API + "/comment/api/find-by-product?productId=" + productId, {
            method: "GET",
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw Error(response.status);
            })
            .then((result) => {
                setComment(result);
            })
            .catch((error) => console.log("error", error));
    }, [productId]);
    const filterCommentReply = React.useCallback(() => {
        fetch(API + "/comment/api/filter-comment-reply?productId=" + productId, {
            method: "GET",
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw Error(response.status);
            })
            .then((result) => {
                setCommentReply(result);
                console.log(result);
            })
            .catch((error) => console.log("error", error));
    }, [productId]);
    const loadDataUser = React.useCallback(() => {
        if (localStorage.getItem("token") !== null) {
            fetch(API + "/user/auth/info", {
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
                    // console.log(result);
                    setUser(result);
                })
                .catch((error) => {
                    console.log("error", error);
                });
        }
    }, []);
    useEffect(() => {
        setProductId(product.product.id);
        if (typeof productId === "number") {
            filterCommentByProduct();
            filterCommentReply();
        }

        loadDataUser();
    }, [productId, product.product.id, filterCommentByProduct, filterCommentReply, loadDataUser]);

    return (
        <div>
            <SnackbarMessage open={snackbarOpen} severity={snackbarSeverity} message={snackbarMsg} onClose={snackbarClose} />
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {dialogItem ? (
                    <>
                        <DialogTitle id="alert-dialog-title">Xoá comment</DialogTitle>

                        <DialogContent className="d-flex justify-content-center">
                            <DialogContentText>
                                Thực hiện xoá comment: <q>{dialogItem.content}</q> ?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Không</Button>
                            <Button onClick={handleDeleteComment}>Xoá</Button>
                        </DialogActions>
                    </>
                ) : null}
            </Dialog>
            <h1>Comments</h1>
            {localStorage.getItem("token") ? (
                <form onSubmit={handleSubmit}>
                    <Paper style={{ padding: "20px 20px", marginTop: 10 }}>
                        <Grid container wrap="nowrap" spacing={2}>
                            <Grid item className="w-100">
                                <textarea
                                    className="form-control"
                                    placeholder="Nhập bình luận"
                                    value={commentText}
                                    onChange={handleCommentTextChange}
                                ></textarea>
                            </Grid>
                            <Grid item justifyContent="left">
                                <Button type="submit" variant="outlined" className="h-100">
                                    Gửi
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </form>
            ) : null}

            {/*  */}
            {comment.map((item) => (
                <div key={item.id}>
                    <Paper style={{ padding: "10px 20px 0 20px", marginTop: 10, backgroundColor: "#f8f8f8" }}>
                        <Grid container wrap="nowrap" spacing={2}>
                            <Grid item>
                                <Avatar alt="" src={API + item.user.photos} />
                            </Grid>
                            <Grid justifyContent="left" item xs zeroMinWidth>
                                <p>{item.content}</p>
                                <div className="d-flex" style={{ fontSize: "12px", color: "gray" }}>
                                    {localStorage.getItem("token") ? (
                                        <>
                                            <p className="me-1" onClick={() => handleReply(item)}>
                                                Trả lời
                                            </p>
                                            -
                                            {user.id === item.user.id || user.role === "ADMIN" ? (
                                                <>
                                                    <p
                                                        className="mx-1"
                                                        onClick={() => {
                                                            setDialogItem(item);
                                                            handleClickOpenDialog();
                                                        }}
                                                    >
                                                        Xoá
                                                    </p>
                                                    -
                                                </>
                                            ) : null}
                                        </>
                                    ) : null}
                                    <p className="mx-1">{item.user.firstName + " " + item.user.lastName}</p>-
                                    <p className="mx-1">
                                        {formatDistanceToNow(new Date(item.createdAt), {
                                            locale: vi,
                                            addSuffix: true,
                                        })}
                                    </p>
                                </div>
                            </Grid>
                        </Grid>
                    </Paper>

                    {commentReply.map((itemReply) => (
                        <div key={itemReply.id}>
                            {itemReply.parentId === item.id ? (
                                <Paper
                                    style={{
                                        padding: "10px 20px 0 20px",
                                        marginTop: 10,
                                        backgroundColor: "#f8f8f8",
                                        marginLeft: "3rem",
                                    }}
                                >
                                    <Grid container wrap="nowrap" spacing={2}>
                                        <Grid item>
                                            <Avatar alt="Remy Sharp" src={API + itemReply.user.photos} />
                                        </Grid>
                                        <Grid justifyContent="left" item xs zeroMinWidth>
                                            <p>{itemReply.content}</p>
                                            <div className="d-flex" style={{ fontSize: "12px", color: "gray" }}>
                                                {localStorage.getItem("token") ? (
                                                    <>
                                                        <p className="me-1" onClick={() => handleReply(item)}>
                                                            Trả lời
                                                        </p>
                                                        -
                                                        <p
                                                            className="mx-1"
                                                            onClick={() => {
                                                                setDialogItem(itemReply);
                                                                handleClickOpenDialog();
                                                            }}
                                                        >
                                                            Xoá
                                                        </p>
                                                        -
                                                    </>
                                                ) : null}
                                                <p className="mx-1">{itemReply.user.firstName + " " + itemReply.user.lastName}</p>
                                                -
                                                <p className="mx-1">
                                                    {formatDistanceToNow(new Date(itemReply.createdAt), {
                                                        locale: vi,
                                                        addSuffix: true,
                                                    })}
                                                </p>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ) : null}
                        </div>
                    ))}
                    {replyParentId && replyParentId === item.id ? (
                        <form onSubmit={handleSubmitReply}>
                            <Paper style={{ padding: "20px 20px", marginTop: 10, marginLeft: "3rem" }}>
                                <Grid container wrap="nowrap" spacing={2}>
                                    <Grid item className="w-100">
                                        <textarea
                                            className="form-control"
                                            placeholder="Nhập bình luận"
                                            value={commentTextReply}
                                            onChange={handleCommentTextReplyChange}
                                        ></textarea>
                                    </Grid>
                                    <Grid item justifyContent="left">
                                        <Button type="submit" variant="outlined" className="h-100">
                                            Gửi
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </form>
                    ) : null}
                </div>
            ))}
        </div>
    );
}