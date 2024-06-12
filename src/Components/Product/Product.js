import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useLocation, useNavigate } from "react-router-dom";
import { InputBase, Paper, Skeleton } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ProductItem from "../Layout/ProductItem";
import API from "../Api/Api";

function Product() {
    // Lấy thông tin từ url
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    let categoryParams = searchParams.get("category");
    //
    const navigation = useNavigate();
    //
    const [page, setPage] = React.useState(1);
    // product data
    const [product, setProduct] = React.useState([]);
    const [category, setCategory] = React.useState([]);
    // size của 1 page
    const [pageSize] = React.useState(12);
    // sort by filde
    const [field] = React.useState("id");
    // thứ tự của page
    const [offset, setOffset] = React.useState(0);
    // tổng số product
    const [totalElements, setTotalElements] = React.useState();
    // Tổng số trang
    const [totalPages, setTotalPages] = React.useState();
    // key search
    const [title, setTitle] = React.useState("");
    const [categoryId, setCategoryId] = React.useState("");
    // loading
    const [loading, setLoading] = React.useState(false);

    // Sự kiện
    const handleChange = (event, value) => {
        setPage(value);
        setOffset(value - 1);
        loadDataProduct();
    };
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        // loadDataProduct();
    };

    const loadDataProduct = React.useCallback(() => {
        setLoading(true);
        fetch(
            API +
                "/product/api/paginationAndSort/" +
                offset +
                "/" +
                pageSize +
                "/" +
                field +
                "?" +
                new URLSearchParams({
                    title: title,
                    categoryId: categoryId,
                })
        ).then((resp) => {
            resp.json().then((result) => {
                setLoading(false);
                setProduct(result.response.content);
                setTotalElements(result.response.totalElements);
                setTotalPages(result.response.totalPages);
            });
        });
    }, [categoryId, field, offset, pageSize, title]);
    const Loading = () => {
        return (
            <Stack direction="row" spacing={2} sx={{ m: 1, justifyContent: "center" }}>
                <Skeleton variant="rectangular" width={250} height={350} />
                <Skeleton variant="rectangular" width={250} height={350} />
                <Skeleton variant="rectangular" width={250} height={350} />
                <Skeleton variant="rectangular" width={250} height={350} />
            </Stack>
        );
    };
    const loadDataCategory = React.useCallback(() => {
        fetch(API + "/category/api/filter?title=")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.status);
            })
            .then((result) => {
                setCategory(result);
            })
            .catch((error) => {
                console.log("error", error);
            });
    },[]);

    React.useEffect(() => {
        loadDataProduct();
        loadDataCategory();
        if (categoryParams) {
            setCategoryId(categoryParams);
        } else{
            setCategoryId("")
        }
    }, [page, offset, categoryId, categoryParams, loadDataProduct, loadDataCategory]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setPage(1);
        setOffset(0);
        loadDataProduct();
    };
    // const handleClickCategory = (item) => {
    //     setCategoryId(item.id);
    //     setOffset(0);
    // };
    return (
        <div>
            <div className="container  py-5">
                <div className="row">
                    <div className="col-12 mb-3 d-flex justify-content-center">
                        <Paper
                            component="form"
                            onSubmit={handleSubmit}
                            className="d-flex justify-content-center w-50 border"
                            sx={{ p: "4px 8px" }}
                        >
                            <InputBase
                                sx={{ ml: 1, flex: 1, fontSize: 18 }}
                                placeholder="Tìm kiếm sản phẩm"
                                name="title"
                                value={title}
                                onChange={(event) => handleTitleChange(event)}
                            />
                            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <hr />
                    <div className="buttons justify-content-center mb-2 pb-2">
                        <button
                            className="btn btn-outline-dark m-1"
                            onClick={() => {
                                // setCategoryId("");
                                // // loadDataProduct();
                                // setPage(1);
                                navigation("/product");
                            }}
                        >
                            Tất cả ({totalElements})
                        </button>
                        {category.map((item) => {
                            return (
                                <button
                                    className="btn btn-outline-dark m-1"
                                    key={item.id}
                                    onClick={() =>
                                        // handleClickCategory(item);
                                        navigation(`/product?category=${item.id}`)
                                    }
                                >
                                    {item.title}
                                </button>
                            );
                        })}
                    </div>
                    <hr />

                    {loading ? (
                        <Loading />
                    ) : (
                        <>
                            {product.length > 0 ? (
                                product.map((item, i) => {
                                    return <ProductItem {...item} key={item.id} />;
                                })
                            ) : (
                                <div className="alert alert-info" role="alert">
                                    Không có sản phẩm phù hợp.
                                </div>
                            )}
                        </>
                    )}
                    <div className="container d-flex justify-content-center">
                        <Stack spacing={2}>
                            {/* <Typography>Page: {page}</Typography> */}
                            <Pagination
                                // Tổng số items
                                count={totalPages}
                                // Số page hiện tại
                                page={page}
                                // Xử lý chuyển page
                                onChange={handleChange}
                                // định dạng nút bấm
                                variant="outlined"
                                // màu nút bấm
                                color="primary"
                                // Kiểm xoát số nút bấm 2 bên khi đang ở page giữa. ví dụ là xuất hiện nút : 1 2 . . . 6 . . . 11 12
                                boundaryCount={1}
                                // Hiện nút bấm trở về trang đầu tiên
                                showFirstButton
                                // Hiện nút bấm trở về trang cuối cùng
                                showLastButton
                            />
                        </Stack>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Product;