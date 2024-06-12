import React from "react";
import { Link, useParams } from "react-router-dom";
//
import { Box } from "@mui/material";
import convertToUrl from "../../Unity/ConvertToUrl";
import API from "../../Api/Api";
import SnackbarMessage from "../../Layout/SnackbarMessage";
import { useCallback } from "react";
import axios from "axios";

export default function CategoryDetailManagement() {
    const { id } = useParams();
    const [title, setTitle] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [content, setContent] = React.useState("");

    //
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("warning");

    const snackbarClose = () => {
        setSnackbarOpen(false);
    };
    const handleChangeSlug = (event) => {
        const text = event.target.value;
        const url = convertToUrl(text);
        setTitle(text);
        setSlug(url);
    };
    const loadDataCategory = useCallback(() => {
        axios
            .get(`${API}/category/api/${id}`)
            .then((res) => {
                console.log("category ", res);
                setTitle(res.data.title);
                setSlug(res.data.slug);
                setContent(res.data.content);
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("Load product error!");
            });
    }, [id]);
    // Đổi data
    const handleEditCategory = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (title === "" || slug === "") {
            setSnackbarOpen(true);
            setSnackbarSeverity("error");
            setSnackbarMsg("Thông tin chưa hợp lệ!");
        } else {
            axios
                .put(
                    `${API}/category/auth/admin/${id}`,
                    {
                        title: data.get("title"),
                        slug: data.get("slug"),
                        content: data.get("content"),
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                            "Content-Type": "application/json",
                        },
                    }
                )
                .then((response) => {
                    if (response.status === 200) {
                        console.log(response.status);
                        setSnackbarOpen(true);
                        setSnackbarSeverity("success");
                        setSnackbarMsg("Lưu thành công.");
                        loadDataCategory();
                    } else {
                        throw new Error(response.statusText);
                    }
                })
                .catch((error) => {
                    console.log("error", error);
                    setSnackbarOpen(true);
                    setSnackbarSeverity("error");
                    setSnackbarMsg("Load product error!");
                });
        }
    };
    React.useEffect(() => {
        loadDataCategory();
    }, [loadDataCategory]);

    return (
        <div>
            <SnackbarMessage open={snackbarOpen} severity={snackbarSeverity} message={snackbarMsg} onClose={snackbarClose} />

            <section className="h-100 gradient-custom" style={{ backgroundColor: "#eee" }}>
                <div className="container py-5">
                    <Box component="form" onSubmit={handleEditCategory} className="row d-flex justify-content-center my-4">
                        <div className="col-lg-7 ">
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between py-3">
                                    <h5 className="mb-0 text-capitalize">Thông tin Category</h5>
                                </div>

                                <div className="card-body px-5">
                                    <div className="form-outline mt-4  ">
                                        <label className="form-label">Id</label>
                                        <input
                                            type="text"
                                            defaultValue={id}
                                            className="form-control"
                                            id="id"
                                            name="id"
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-outline mt-4  ">
                                        <label className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={title}
                                            name="title"
                                            onChange={handleChangeSlug}
                                        />
                                    </div>
                                    <div className="form-outline mt-4  ">
                                        <label className="form-label">Slug</label>
                                        <input
                                            type="text"
                                            value={slug}
                                            className="form-control"
                                            id="slug"
                                            name="slug"
                                            onChange={(e) => setSlug(convertToUrl(e.target.value))}
                                        />
                                    </div>

                                    <div className="form-outline mt-4  ">
                                        <label className="form-label">Content</label>
                                        <textarea
                                            type="text"
                                            value={content}
                                            className="form-control"
                                            id="content"
                                            name="content"
                                            onChange={(e) => setContent(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card mb-4 ">
                                <div className="card-header py-3">
                                    <h5 className="mb-0">Action</h5>
                                </div>
                                <div className="card-body">
                                    <div className=" row form-group ">
                                        <Link to={"/admin/category"} className="col-auto m-auto">
                                            <button type="button" className="btn btn-dark  ">
                                                Cancel
                                            </button>
                                        </Link>
                                        {/* <button type="reset" className="btn btn-secondary col-auto m-auto">
                                            Reset
                                        </button> */}
                                        <button type="submit" className="btn btn-primary col-auto m-auto">
                                            Lưu thay đổi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Box>
                </div>
            </section>
        </div>
    );
}