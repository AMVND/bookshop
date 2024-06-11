import React from "react";
import { VND } from "../Unity/VND";
import { Link } from "react-router-dom";
import API from "../Api/Api";
export default function ProductItem({ id, title, slug, price, discount, photos }) {
    
    return (
        <div className="col-lg-3 col-md-4 col-sm-6 mb-4 col-auto p-2">
            <div className="card h-100 text-center p-2" style={{ width: "auto" }}>
                <Link to={`/product/${slug}`} className="text-dark">
                    <img
                        src={API+photos}
                        className="card-img-top w-100"
                        title={title}
                        alt={title}
                        height="250px"
                        loading="lazy"
                        // onClick={() => handleClick(item)}
                    />
                </Link>
                <div className="card-body">
                    <div className="mask">
                        <div className="d-flex justify-content-center h-100">
                            <h5>
                                {/* <span className="badge bg-primary ms-2">New</span> */}
                                {/* <span className="badge bg-success ms-2">Eco</span> */}
                                {discount > 0 ? <span className="badge bg-danger ms-2">-{discount}%</span> : null}
                            </h5>
                        </div>
                    </div>

                    <h5
                        className="card-title mb-0 text-nowrap text-truncate text-capitalize"
                        title={title}
                        // onClick={() => handleClick(item)}
                    >
                        <Link to={`/product/${slug}`} className="text-dark">
                            {title}
                        </Link>
                    </h5>
                    <p className="card-text lead fw-bold">{VND.format(price)}</p>
                    
                </div>
            </div>
        </div>
    );
}