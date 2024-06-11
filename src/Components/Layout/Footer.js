import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <div>
            <section className="footer">
                {/* Footer */}
                <footer className="text-center text-white" style={{ backgroundColor: "#1976d2" }}>
                    
                    {/* Copyright */}
                    <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
                        © 2023 Copyright:
                        <Link className="text-white" to={"https://mdbootstrap.com/"}>
                            &nbsp;DevChido
                        </Link>
                    </div>
                </footer>
            </section>
        </div>
    );
}

export default Footer;