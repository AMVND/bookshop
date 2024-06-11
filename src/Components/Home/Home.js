import React from "react";
import Banner from "../Layout/Banner";
import LastestProduct from "../Layout/LastestProduct";
import ProductsByCategory from "../Layout/ProductsByCategory";
import BestSellingProduct from "../Layout/BestSellingProduct";

function Home() {
    return (
        <div>
            <Banner/>
            <LastestProduct/>
            <BestSellingProduct/>
            <ProductsByCategory/>
        </div>
    );
}

export default Home;