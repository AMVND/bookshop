import React from "react";
import ProductCategoryItem from "./ProductCategoryItem";
import API from "../Api/Api";
import Spinner from 'react-bootstrap/Spinner';
function ProductByCategory() {
    const [productData, setProductData] = React.useState([]);

    const [loading, setLoading] = React.useState(false);

    const loadDataProduct = () => {
        setLoading(true);
        fetch(API+"/product/api/filter_product_by_category").then((resp) => {
            resp.json().then((result) => {
                // console.log(result);
                setLoading(false);
                setProductData(result);
            });
        });
    };
    // Hàm hỗ trợ để nhóm sản phẩm theo danh mục
    const groupProductsByCategory = () => {
        const groupedProducts = {};

        productData.forEach((product) => {
            const { category } = product;

            if (groupedProducts[category]) {
                groupedProducts[category].push(product);
            } else {
                groupedProducts[category] = [product];
            }
        });

        return groupedProducts;
    };

    const groupedProducts = groupProductsByCategory();
    const Loading = () => {
        return (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          );
    };

    React.useEffect(() => {
        loadDataProduct();
    }, []);
    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <>
                    {Object.keys(groupedProducts).map((category) => (
                        <ProductCategoryItem key={category} category={category} products={groupedProducts[category]} />
                    ))}
                </>
            )}
        </div>
    );
}

export default ProductByCategory;