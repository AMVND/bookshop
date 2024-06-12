import React from "react";
import { Link, useNavigate } from "react-router-dom";
//

import { Box } from "@mui/material";
import convertToUrl from "../../Unity/ConvertToUrl";
import API from "../../Api/Api";
import SnackbarMessage from "../../Layout/SnackbarMessage";

export default function CreatedCategory() {
    const [title, setTitle] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [content, setContent] = React.useState("");
    const navigation = useNavigate();
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

    // thêm category
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (data.get("title") === null || data.get("title") === "" || data.get("slug") === null || data.get("slug") === "") {
            setSnackbarOpen(true);
            setSnackbarSeverity("error");
            setSnackbarMsg("Thông tin chưa hợp lệ!");
        } else {
            fetch(`${API}/category/auth/admin`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: data.get("title"),
                    slug: data.get("slug"),
                    content: data.get("content"),
                }),
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
                    setSnackbarMsg("Thêm mới category thành công.");
                    navigation("/admin/category");
                })
                .catch((error) => {
                    console.log("error", error);
                    setSnackbarOpen(true);
                    setSnackbarSeverity("error");
                    setSnackbarMsg("Thêm mới không thành công!");
                });
        }
    };

    return (
        <div>
            <SnackbarMessage open={snackbarOpen} severity={snackbarSeverity} message={snackbarMsg} onClose={snackbarClose} />

            <section className="h-100 gradient-custom" style={{ backgroundColor: "#eee" }}>
                <div className="container py-5">
                    <Box component="form" onSubmit={handleSubmit} className="row d-flex justify-content-center my-4">
                        <div className="col-lg-7 ">
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between py-3">
                                    <h5 className="mb-0 text-capitalize">Thông tin Category</h5>
                                </div>

                                <div className="card-body px-5">
                                    <div className="form-outline mt-4  ">
                                        <label className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="title"
                                            name="title"
                                            value={title}
                                            onChange={handleChangeSlug}
                                        />
                                    </div>
                                    <div className="form-outline mt-4  ">
                                        <label className="form-label">Slug</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="slug"
                                            name="slug"
                                            value={slug}
                                            onChange={(e) => setSlug(convertToUrl(e.target.value))}
                                        />
                                    </div>

                                    <div className="form-outline mt-4  ">
                                        <label className="form-label">Content</label>
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            id="content"
                                            name="content"
                                            value={content}
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
                                        <button type="reset" className="btn btn-secondary col-auto m-auto">
                                            Reset
                                        </button>
                                        <button type="submit" className="btn btn-primary col-auto m-auto">
                                            Save
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