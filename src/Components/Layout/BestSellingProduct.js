import React from "react";
import ProductItem from "./ProductItem";
import API from "../Api/Api";
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner';
export default function BestSellingProduct() {
    const [product, setProduct] = React.useState([]);
    const [time1] = React.useState(new Date("2021-12-30"));
    const [time2] = React.useState(new Date("2023-12-30"));

    const [loading, setLoading] = React.useState(false);

    const loadDataProduct = React.useCallback(() => {
        setLoading(true);
        axios
            .get(
                API +
                    "/product/api/best_selling_product/0/8?title=&time1=" +
                    time1.toISOString().slice(0, 10) +
                    "&time2=" +
                    time2.toISOString().slice(0, 10) +
                    "&sort=DESC&field=count"
            )
            .then((res) => {
                // console.log(result);
                setLoading(false);
                setProduct(res.data.response.content);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [time1, time2]);
    const Loading = () => {
        return (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          );
    };
    const ShowProducts = () => {
        return product.map((item, i) => {
            return <ProductItem {...item} key={item.id} />;
        });
    };
    React.useEffect(() => {
        loadDataProduct();
    }, [loadDataProduct]);
    return (
        <div className="container my-5 py-5">
            <div className="row">
                <div className="col-12 mb-5">
                    <h1 className="display-6 fw-bolder text-center">Sách bán chạy</h1>
                    <hr />
                </div>
            </div>
            <div className="row justify-content-center">{loading ? <Loading /> : <ShowProducts />}</div>
        </div>
    );
}