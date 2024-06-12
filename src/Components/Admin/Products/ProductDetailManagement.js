import React from "react";
import { Link, useParams } from "react-router-dom";

import { Avatar, Input } from "@mui/material";
import { format } from "date-fns";
import convertToUrl from "../../Unity/ConvertToUrl";
import API from "../../Api/Api";
import SnackbarMessage from "../../Layout/SnackbarMessage";
import axios from "axios";

function ProductDetailManagement() {
    const { id } = useParams();
    const [product, setProduct] = React.useState({
        id: "",
        title: "",
        summary: "",
        price: "",
        discount: "",
        quantity: "",
        content: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        endsAt: new Date(),
        user: [],
    });
    // thông tin của product
    const [title, setTitle] = React.useState({});
    const [slug, setSlug] = React.useState({});
    const [summary, setSumary] = React.useState({});
    const [price, setPrice] = React.useState({});
    const [discount, setDiscount] = React.useState({});
    const [quantity, setQuantity] = React.useState({});
    const [content, setContent] = React.useState({});
    const [categoryItem, setCategoryItem] = React.useState({});
    // image
    const [selectedFile, setSelectedFile] = React.useState();
    const [preview, setPreview] = React.useState();
    const [imageFileName, setImageFileName] = React.useState("");

    // chuyển đổi trạng thái của sản phẩm
    // const [status, setStatus] = React.useState(0);
    const [productCategory, setProductCategory] = React.useState({});
    const [category, setCategory] = React.useState([]);

    const [newImage, setNewImage] = React.useState({});
    //
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("warning");
    //
    const [isDisabled, setIsDisabled] = React.useState("disabled");

    const snackbarClose = () => {
        setSnackbarOpen(false);
    };

    const loadDataProduct = React.useCallback(() => {
        axios
            .get(`${API}/product/auth/${id}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
            .then((res) => {
                // console.log("product", res);
                setProduct(res.data);
                setTitle(res.data.title);
                setSlug(res.data.slug);
                setSumary(res.data.summary);
                setPrice(res.data.price);
                setDiscount(res.data.discount);
                setQuantity(res.data.quantity);
                setContent(res.data.content);
                setNewImage(API + res.data.photos);
                // setStatus(res.data.status);
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("Load product error!");
            });
    }, [id]);
    const loadDataProductCategory = React.useCallback(() => {
        // product category
        axios
            .get(`${API}/product-category/api/${id}`)
            .then((res) => {
                // console.log("product-category", result);
                setProductCategory(res.data.category);
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("Load product-category error!");
            });
    }, [id]);
    const loadDataCategory = React.useCallback(() => {
        axios
            .get(API + "/category/api/filter?title= ")
            .then((res) => {
                // console.log(res.data);
                setCategory(res.data);
            })
            .catch((error) => {
                console.log("error", error);
            });
    }, []);
    // thay đổi slug mặc định
    const handleChangeSlug = (event) => {
        const text = event.target.value;
        const url = convertToUrl(text);
        setTitle(text);
        setSlug(url);
    };

    // Set trạng thái của sản phẩm : status
    // const handleSetStatus = () => {
    //     var url = "/product/auth/admin/setStatus?";
    //     console.log("status: " + status);
    //     fetch(
    //         url +
    //             new URLSearchParams({
    //                 id: product.id,
    //                 status: status,
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
    //                 return response.text();
    //             }
    //             throw Error(response.status);
    //         })
    //         .then((result) => {
    //             console.log("user", result);
    //             setSnackbarOpen(true);
    //             setSnackbarSeverity("success");
    //             loadDataProduct();
    //             if (status === 0) {
    //                 setSnackbarMsg("Sản phẩm được chuyển vào mục Chờ xác nhận");
    //             }
    //             if (status === 1) {
    //                 setSnackbarMsg("Sản phẩm được chuyển vào mục đã duyệt");
    //             }
    //             if (status === 2) {
    //                 setSnackbarMsg("Sản phẩm được chuyển vào mục kiểm duyệt");
    //             }
    //             if (status === 3) {
    //                 setSnackbarMsg("Sản phẩm được chuyển vào mục bị ngưng bán!");
    //             }
    //         })
    //         .catch((error) => {
    //             console.log("error", error);
    //             setSnackbarOpen(true);
    //             setSnackbarSeverity("error");
    //             setSnackbarMsg("error! Chuyển đổi trạng thái sản phẩm không hoạt động!");
    //         });
    // };
    // Chuyển sản phẩm vào mục chờ xác nhận
    // const handleWait = () => {
    //     var url = "/product/auth/admin/setStatus?";
    //     fetch(
    //         url +
    //             new URLSearchParams({
    //                 id: product.id,
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
    //                 return response.text();
    //             }
    //             throw Error(response.status);
    //         })
    //         .then((result) => {
    //             console.log("user", result);
    //             setSnackbarOpen(true);
    //             setSnackbarSeverity("success");
    //             setSnackbarMsg("Sản phẩm được chuyển vào mục Chờ xác nhận");
    //             loadDataProduct();
    //         })
    //         .catch((error) => {
    //             console.log("error", error);
    //             setSnackbarOpen(true);
    //             setSnackbarSeverity("error");
    //             setSnackbarMsg("error! Chuyển đổi trạng thái sản phẩm không hoạt động!");
    //         });
    // };
    // Chuyển sản phẩm vào mục đã xác nhận
    const handleConfirm = () => {
        var url = API + "/product/auth/admin/setStatus?";
        fetch(
            url +
                new URLSearchParams({
                    id: product.id,
                    status: 1,
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
                    return response.text();
                }
                throw Error(response.status);
            })
            .then((result) => {
                console.log("user", result);
                setSnackbarOpen(true);
                setSnackbarSeverity("success");
                setSnackbarMsg("Sản phẩm được chuyển vào mục Đã xác nhận");
                loadDataProduct();
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("error! Chuyển đổi trạng thái sản phẩm không hoạt động!");
            });
    };
    // Chuyển sản phẩm vào mục kiểm duyệt
    const handleCensorship = () => {
        var url = API + "/product/auth/admin/setStatus?";
        fetch(
            url +
                new URLSearchParams({
                    id: product.id,
                    status: 2,
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
                    return response.text();
                }
                throw Error(response.status);
            })
            .then((result) => {
                console.log("user", result);
                setSnackbarOpen(true);
                setSnackbarSeverity("success");
                setSnackbarMsg("Đã huỷ đăng bán sản phẩm");
                loadDataProduct();
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("error! Chuyển đổi trạng thái sản phẩm không hoạt động!");
            });
    };
    // Chuyển sản phẩm vào mục ngưng bán
    const handleStop = () => {
        var url = "/product/auth/admin/setStatus?";
        fetch(
            url +
                new URLSearchParams({
                    id: product.id,
                    status: 3,
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
                    return response.text();
                }
                throw Error(response.status);
            })
            .then((result) => {
                console.log("user", result);
                setSnackbarOpen(true);
                setSnackbarSeverity("success");
                setSnackbarMsg("Sản phẩm được chuyển vào mục ngưng bán");
                loadDataProduct();
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("error! Chuyển đổi trạng thái sản phẩm không hoạt động!");
            });
    };

    React.useEffect(() => {
        loadDataProduct();
        loadDataCategory();
        loadDataProductCategory();
        if (!selectedFile) {
            setPreview(undefined);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [loadDataProduct, loadDataCategory, loadDataProductCategory, selectedFile]);
    // ---------------------------------------------------------------
    // Thay đổi thuộc tính sản phẩm
    const handleChangeProduct = () => {
        var formdata = new FormData();
        formdata.append("id", id);
        formdata.append("slug", slug);
        formdata.append("title", title);
        formdata.append("summary", summary);
        formdata.append("price", price);
        formdata.append("discount", discount);
        formdata.append("quantity", quantity);
        formdata.append("content", content);
        fetch(API + "/product/auth/admin/handleChangeProduct", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: formdata,
        })
            .then((response) => {
                if (response.ok) {
                    return response.text();
                }
                throw Error(response.status);
            })
            .then((result) => {
                console.log(result);
                if (result === "true") {
                    setSnackbarOpen(true);
                    setSnackbarSeverity("success");
                    setSnackbarMsg("Cập nhật thông tin thành công.");
                } else {
                    setSnackbarOpen(true);
                    setSnackbarSeverity("error");
                    setSnackbarMsg("Cập nhật thông tin không thành công.");
                }
                // loadDataProduct();
                setSelectedFile();
                setPreview();
                setImageFileName();
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("Thực hiện Cập nhật thông tin không thành công.");
            });
    };
    // Cập nhật loại sản phẩm
    const handleChangeProductCategory = () => {
        axios
            .put(
                `${API}/product-category/auth/product/${id}/category/${categoryItem}`,
                // `${API}/product-category/auth/handleChangeProductCategory?productId=${id}&categoryId=${categoryItem}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )

            .then((res) => {
                console.log(res);
                if (res.data === true) {
                    setSnackbarOpen(true);
                    setSnackbarSeverity("success");
                    setSnackbarMsg("Cập nhật loại sản phẩm thành công.");
                    setIsDisabled('disabled')
                } else {
                    setSnackbarOpen(true);
                    setSnackbarSeverity("error");
                    setSnackbarMsg("Cập nhật loại sản phẩm không thành công.");
                }
                // loadDataProduct();
            })
            .catch((error) => {
                console.error("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("Thực hiện Cập nhật loại sản phẩm không thành công.");
            });
    };

    // select image file
    const onSelectFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined);
            return;
        }

        // I've kept this example simple by using the first image instead of multiple
        const file = e.target.files[0];
        setSelectedFile(file);
        setImageFileName(file.name);
    };
    // sự kiện đổi ảnh
    const handleChangeImage = () => {
        var formdata = new FormData();
        formdata.append("image", selectedFile, imageFileName);
        formdata.append("slug", product.slug);
        fetch(API + "/product/auth/image", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: formdata,
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
                setSnackbarMsg("Cập nhật ảnh thành công.");
                setSelectedFile();
                setPreview();
                setImageFileName();
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("Thực hiện Cập nhật ảnh không thành công.");
            });
    };
    //----------------------------------------------------------------

    return (
        <div>
            <SnackbarMessage open={snackbarOpen} severity={snackbarSeverity} message={snackbarMsg} onClose={snackbarClose} />
            <section className="h-100 gradient-custom" style={{ backgroundColor: "#eee" }}>
                <div className="container py-5">
                    <form
                        className="row d-flex justify-content-center my-4"
                        noValidate="novalidate"
                        encType="multipart/form-data"
                    >
                        <div className="col-lg-7 ">
                            <div className="card mb-4">
                                <div className="card-header d-flex justify-content-between py-3">
                                    <h5 className="mb-0 text-capitalize">Thông tin sản phẩm</h5>

                                    {product.status === 0 ? (
                                        <span className="badge bg-warning text-capitalize ms-2">Chờ xét duyệt</span>
                                    ) : null}
                                    {product.status === 1 ? (
                                        <span className="badge bg-info text-capitalize ms-2">Được đăng bán</span>
                                    ) : null}
                                    {product.status === 2 ? (
                                        <span className="badge bg-secondary text-capitalize ms-2">Chưa đăng bán</span>
                                    ) : null}
                                    {product.status === 3 ? (
                                        <span className="badge bg-danger text-capitalize ms-2">Ngưng bán</span>
                                    ) : null}
                                </div>
                                <div className="card-body">
                                    <div className="form-outline d-flex justify-content-between mt-4">
                                        <label className="form-label">Tên sản phẩm</label>
                                        <input
                                            id="form1"
                                            name="title"
                                            type="text"
                                            value={title}
                                            className="form-control text-right w-75  word-wrap"
                                            onChange={handleChangeSlug}
                                        />
                                    </div>
                                    <div className="form-outline d-flex justify-content-between mt-4">
                                        <label className="form-label">Slug</label>
                                        <input
                                            id="form1"
                                            name="slug"
                                            type="text"
                                            value={slug}
                                            className="form-control w-75"
                                            onChange={(e) => setSlug(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-outline d-flex justify-content-between mt-4">
                                        <label className="form-label">Summary</label>
                                        <input
                                            id="form1"
                                            name="summary"
                                            type="text"
                                            value={summary}
                                            className="form-control w-75"
                                            onChange={(e) => setSumary(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-outline d-flex justify-content-between mt-4">
                                        <label className="form-label">Giá (₫)</label>
                                        <input
                                            id="form1"
                                            name="price"
                                            type="number"
                                            min={0}
                                            value={price}
                                            className="form-control w-50"
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-outline d-flex justify-content-between mt-4">
                                        <label className="form-label">Giảm giá (%)</label>
                                        <input
                                            id="form1"
                                            name="discount"
                                            type="number"
                                            min={0}
                                            value={discount}
                                            className="form-control w-50"
                                            onChange={(e) => setDiscount(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-outline d-flex justify-content-between mt-4">
                                        <label className="form-label">Số lượng</label>
                                        <input
                                            id="form1"
                                            name="quantity"
                                            type="number"
                                            min={0}
                                            value={quantity}
                                            className="form-control w-50"
                                            onChange={(e) => setQuantity(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-outline d-flex justify-content-between mt-4">
                                        <label className="form-label">Content</label>
                                        <textarea
                                            id="form1"
                                            name="content"
                                            type="text"
                                            value={content}
                                            rows={3}
                                            className="form-control w-75"
                                            onChange={(e) => setContent(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-outline d-flex justify-content-between mt-4">
                                        <label className="form-label">Created At</label>
                                        <Input
                                            type="datetime-local"
                                            value={format(new Date(product.createdAt), "yyyy-MM-dd'T'hh:mm:ss")}
                                        />
                                    </div>
                                    <div className="form-outline d-flex justify-content-between mt-4">
                                        <label className="form-label">Updated At</label>
                                        <Input
                                            type="datetime-local"
                                            value={format(new Date(product.updatedAt), "yyyy-MM-dd'T'hh:mm:ss")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card mb-4 ">
                                <div className="card-header py-3">
                                    <h5 className="mb-0">Loại Sản Phẩm</h5>
                                </div>
                                <div className="card-body">
                                    <div className="form-group">
                                        <select
                                            className="form-control"
                                            name="category"
                                            onChange={(e) => {
                                                setCategoryItem(e.target.value);
                                                setIsDisabled('');
                                                // console.log(e.target.value);
                                            }}
                                        >
                                            <option value={productCategory.id ? productCategory.id : ""}>
                                                {productCategory.title ? productCategory.title : "Chọn thể loại"}
                                            </option>
                                            {category.map((item, i) => (
                                                <option value={item.id} key={i}>
                                                    {item.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="card mb-4 ">
                                <div className="card-header py-3">
                                    <h5 className="mb-0">Người bán</h5>
                                </div>
                                <div className="card-body d-flex">
                                    <Avatar alt="Remy Sharp" src={API + product.user.photos} variant="rounded" />
                                    <p className="my-auto mx-3">
                                        <strong>{product.user.firstName + " " + product.user.lastName}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card mb-4">
                                <div className="card-header py-3">
                                    <h5 className="mb-0 text-capitalize">Ảnh sản phẩm</h5>
                                </div>
                                <div className="card-body ">
                                    {!selectedFile && (
                                        <img
                                            src={newImage}
                                            alt="Images"
                                            className="img-thumbnail form-control form-control-lg col-md-2 m-auto"
                                            style={{ width: "auto", maxHeight: "250px", maxWidth: "250px" }}
                                        ></img>
                                    )}
                                    {/*  */}
                                    {selectedFile && (
                                        <img
                                            src={preview}
                                            alt="Images"
                                            className="img-thumbnail form-control  m-auto"
                                            style={{ height: "300px", width: "300px" }}
                                        ></img>
                                    )}
                                    <input
                                        id="form1"
                                        name="photos"
                                        type="file"
                                        accept="image/png, image/gif, image/jpeg"
                                        className="form-control mt-2 mx-auto"
                                        style={{ width: "300px" }}
                                        onChange={onSelectFile}
                                    />
                                </div>
                            </div>
                            {selectedFile && (
                                <div className="card mb-4 card-body ">
                                    <div className=" row form-group justify-content-between">
                                        <button type="button" className="btn btn-info col-auto" onClick={handleChangeImage}>
                                            Đổi ảnh sản phẩm
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="card mb-4 card-body ">
                                <div className=" row form-group justify-content-between">
                                    <button type="button" className="btn btn-info" onClick={handleChangeProduct}>
                                        Cập nhật thông tin sản phẩm
                                    </button>
                                </div>
                            </div>
                            {categoryItem && (
                                <div className="card mb-4 card-body ">
                                    <div className=" row form-group justify-content-between">
                                        <button
                                            type="button"
                                            className={`btn btn-info ${isDisabled}`}
                                            onClick={handleChangeProductCategory}
                                        >
                                            Cập nhật loại sản phẩm
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="card mb-4 card-body ">
                                <div className=" row form-group justify-content-between">
                                    <Link to={"/admin/product"} className="col-auto">
                                        <button type="button" className="btn btn-dark  ">
                                            Cancel
                                        </button>
                                    </Link>
                                    {product.status === 1 ? (
                                        <Link to={`/product/${product.slug}`} className="col-auto">
                                            <button type="button" className="btn btn-primary">
                                                View
                                            </button>
                                        </Link>
                                    ) : null}
                                    {product.status === 1 || product.status === 3 ? (
                                        <button type="button" className="btn btn-warning col-auto" onClick={handleCensorship}>
                                            Huỷ đăng bài
                                        </button>
                                    ) : null}
                                    {product.status === 1 ? (
                                        <button type="button" className="btn btn-danger col-auto " onClick={handleStop}>
                                            Ngừng bán
                                        </button>
                                    ) : null}

                                    {product.status === 0 ? (
                                        <button type="reset" className="btn btn-info col-auto " onClick={handleConfirm}>
                                            Duyệt bài
                                        </button>
                                    ) : null}

                                    {/* <button type="reset" className="btn btn-warning col-auto " onClick={handleWait}>
                                            Chờ xác nhận
                                        </button> */}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default ProductDetailManagement;