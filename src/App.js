import "./App.css";
import { Fragment } from "react";
import Navbar from "./Components/Layout/Navbar";
import ScrollToTop from "react-scroll-to-top";
import Footer from "./Components/Layout/Footer";
import Router from "./Components/Routes/Router";


function App(props) {
    return (
        <Fragment>
            <Navbar />
            {/* <DrawerHeader /> */}
            {/* <Sidenav /> */}
            {/* <br/><br/><br/> */}
            <ScrollToTop smooth />
            <Router />
            <Footer />
        </Fragment>
    );
}

export default App;