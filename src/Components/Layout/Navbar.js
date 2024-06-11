import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AssignmentIcon from "@mui/icons-material/Assignment";
// test redux
import DrawerHeader from "../common/DrawerHeader";
import API from "../Api/Api";
import axios from "axios";

//
function Navbar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [user, setUser] = React.useState({});

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
    };

    const loadDataUser = React.useCallback(() => {
        if (localStorage.getItem("token") !== null) {
            
            axios.get(API + "/user/auth/info", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
                .then((res) => {
                    setUser(res.data);
                })
                .catch((error) => {
                    console.log("error", error);
                    handleLogout();
                });
        }
    }, []);
    const handleChangeVendor = () => {
        
        axios.put(API + "/user/auth/change-vendor?id=" + user.id + "&vendor=2", null, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then((response) => {
                loadDataUser();
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    React.useEffect(() => {
        loadDataUser();
    }, [loadDataUser]);
    return (
        <Box>
            <AppBar position="fixed" className="navbar p-0">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        {/* Toàn màn hình */}
                        <HomeIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />

                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: "none", md: "flex" },
                                fontWeight: 700,
                            }}
                        >
                            <Link to={"/"}>Trang chủ</Link>
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: "block", md: "none" },
                                }}
                            >
                                {/* Các page */}
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">
                                        <Link to={"/product"}>Sản phẩm</Link>
                                    </Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                        {/* Màn hình hẹp */}
                        <HomeIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
                        <Typography
                            variant="h5"
                            sx={{
                                mr: 2,
                                display: { xs: "flex", md: "none" },
                                flexGrow: 1,
                                fontWeight: 700,
                            }}
                        >
                            <Link to={"/"}>Trang chủ</Link>
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                            {/* Các page */}
                            <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: "white", display: "block" }}>
                                <Link to={"/product"}>Sản phẩm</Link>
                            </Button>
                        </Box>
                        {/* fff */}
                        <Box sx={{ flexGrow: 0 }}>
                            {localStorage.getItem("token") === null ? (
                                <>
                                    <Typography className="btn btn-outline-light btn-rounded">
                                        <Link to={"signin"}>Đăng nhập</Link>
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <>
                                        <Tooltip title={user.firstName + " " + user.lastName} style={{ background: "#fff" }}>
                                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                                <Avatar alt="" src={API+user.photos} />
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            sx={{ mt: "45px" }}
                                            id="menu-appbar"
                                            anchorEl={anchorElUser}
                                            anchorOrigin={{
                                                vertical: "top",
                                                horizontal: "right",
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: "right",
                                            }}
                                            open={Boolean(anchorElUser)}
                                            onClose={handleCloseUserMenu}
                                            className="menu-setting"
                                        >
                                            {/* "Profile", "Account", "Dashboard", "Logout" */}
                                            <Link to={"/profile"}>
                                                <MenuItem onClick={handleCloseUserMenu}>
                                                    <Typography>Trang cá nhân</Typography>
                                                </MenuItem>
                                            </Link>
                                            <Link to={"/carts"}>
                                                <MenuItem onClick={handleCloseUserMenu}>
                                                    <Typography>Giỏ hàng</Typography>
                                                </MenuItem>
                                            </Link>
                                            <Link to={"/orders"}>
                                                <MenuItem onClick={handleCloseUserMenu}>
                                                    <Typography>Đơn hàng</Typography>
                                                </MenuItem>
                                            </Link>
                                            {/* <Link to={"/dashboard"}>
                                            <MenuItem onClick={handleCloseUserMenu}>
                                                <Typography textAlign="center">Dashboard</Typography>
                                            </MenuItem>
                                        </Link>
                                        <Link to={"/tabs"}>
                                            <MenuItem onClick={handleCloseUserMenu}>
                                                <Typography textAlign="center">Tabs</Typography>
                                            </MenuItem>
                                    </Link>*/}
                                            <Link to={"/test"}>
                                                <MenuItem onClick={handleCloseUserMenu}>
                                                    <Typography>Test</Typography>
                                                </MenuItem>
                                            </Link>

                                            <div>
                                                <hr />
                                                {user.vendor === 0 ? (
                                                    <MenuItem onClick={handleChangeVendor}>
                                                        <Typography>Ứng tuyển</Typography>
                                                    </MenuItem>
                                                ) : null}

                                                {user.vendor === 1 ? (
                                                    <Link to={`/management/${"list-products"}`}>
                                                        <MenuItem onClick={handleCloseUserMenu}>
                                                            <Typography>Sản phẩm của tôi</Typography>
                                                        </MenuItem>
                                                    </Link>
                                                ) : null}
                                                {user.vendor === 2 ? (
                                                    <MenuItem onClick={handleCloseUserMenu}>
                                                        <Typography>Chờ xác nhận</Typography>
                                                    </MenuItem>
                                                ) : null}
                                            </div>

                                            {user.role === "ADMIN" ? (
                                                <div>
                                                    <hr />
                                                    <Link to={"/admin"}>
                                                        <MenuItem onClick={handleCloseUserMenu}>
                                                            <Typography>Trang Admin</Typography>
                                                        </MenuItem>
                                                    </Link>
                                                </div>
                                            ) : null}

                                            <hr />
                                            <Link to={"/"}>
                                                <MenuItem onClick={handleCloseUserMenu}>
                                                    <Typography onClick={handleLogout}>Đăng xuất</Typography>
                                                </MenuItem>
                                            </Link>
                                        </Menu>
                                        <Tooltip title={"Giỏ hàng"}>
                                            <Link to={"/carts"}>
                                                <IconButton sx={{ p: 0, ml: 1 }}>
                                                    <ShoppingCartIcon style={{ color: "white", fontSize: "30px" }} />
                                                </IconButton>
                                            </Link>
                                        </Tooltip>
                                        <Tooltip title={"Đơn hàng"}>
                                            <Link to={"/orders"}>
                                                <IconButton sx={{ p: 0, ml: 1 }}>
                                                    <AssignmentIcon style={{ color: "white", fontSize: "30px" }} />
                                                </IconButton>
                                            </Link>
                                        </Tooltip>
                                    </>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <DrawerHeader/>
        </Box>
    );
}

// const mapStateToProps = (state) => {
//     return {
//         data: state.users,
//     };
// };

// export default connect(mapStateToProps)(Navbar);
export default Navbar;