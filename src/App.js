import "./App.css";
import { Fragment } from "react";
import NavigationBar from "./Components/Layout/Navbar";
import ScrollToTop from "react-scroll-to-top";
import Footer from "./Components/Layout/Footer";
import Router from "./Components/Routes/Router";


function App(props) {
    return (
        <Fragment>
            <NavigationBar />
            {/* <br/><br/><br/> */}
            <ScrollToTop smooth />
            <Router />
            <hr/>
            <Footer />
        </Fragment>
    );
}

export default App;