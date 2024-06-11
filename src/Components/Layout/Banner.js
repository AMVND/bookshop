import React from "react";

function Banner() {
    return (
        <div className="banner container-fluid">
            <div className="row border-0">
                <div className="col-md-6 d-flex flex-column justify-content-center">
                    <div className="container ">
                        <h5 className="display-3 fw-bolder mb-0">Devchido</h5>
                        <p className="lead fs-2">
                        Success isn't always about greatness. It's about consistency. Consistent hard work gains success.
                            Greatness will come.
                        </p>
                    </div>
                </div>
                <img
                    src="https://raw.githubusercontent.com/devchido/frontend-ecommerce-website/main/images/image1.png"
                    className="col-md-6"
                    alt="..."
                    height={"550px"}
                />
            </div>
        </div>
    );
}

export default Banner;