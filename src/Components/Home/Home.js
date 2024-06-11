import React from "react";
import Banner from "../Layout/Banner";
import LastestProduct from "../Layout/LastestProduct";
import ProductByCategory from "../Layout/ProductByCategory";
import BestSellingProduct from "../Layout/BestSellingProduct";

function Home() {
    return (
        <div>
            <Banner/>
            <ProductByCategory/>
            <LastestProduct/>
            <BestSellingProduct/>
        </div>
    );
}

export default Home;