import React from "react";
import ProductItem from "./ProductItem";
import API from "../Api/Api";
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner';

function LastestProduct() {
    const [product, setProduct] = React.useState([]);

    const [loading, setLoading] = React.useState(false);

    const loadDataProduct = React.useCallback(() => {
        setLoading(true);
        axios
            .get(API + "/product/api/lastest-product?field=")
            .then((res) => {
                setLoading(false);
                setProduct(res.data.data);
            })
            .catch((error) => {
                console.log("error", error);
            });
        
    }, []);
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
                    <h1 className="display-6 fw-bolder text-center">Sách mới phát hành</h1>
                    <hr />
                </div>
            </div>
            <div className="row justify-content-center">{loading ? <Loading /> : <ShowProducts />}</div>
        </div>
    );
}

export default LastestProduct;