import React from "react";
import ProductItem from "./ProductItem";

export default function ProductCategoryItem({ category, products }) {
    return (
        <div className="container my-3 py-3">
            <div className="row">
                <div className="col-12 mb-5">
                    <h1 className="display-6 fw-bolder text-center text-primary">{category}</h1>
                    <hr />
                </div>
            </div>
            <div className="row justify-content-center">
                {products.map((item, i) => {
                    return <ProductItem {...item} key={item.id} />;
                })}
            </div>
        </div>
    );
}