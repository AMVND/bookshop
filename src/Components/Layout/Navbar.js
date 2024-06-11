import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AssignmentIcon from "@mui/icons-material/Assignment";
// test redux
import API from "../Api/Api";
import axios from "axios";

//
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

//
function NavigationBar() {
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [user, setUser] = React.useState({});

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
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
    <Navbar collapseOnSelect expand="lg" className="color-">
      <Container>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link><Link to={"/"}>Trang chủ</Link></Nav.Link>
            <Nav.Link><Link to={"/product"}>Danh mục sách</Link></Nav.Link>
            <NavDropdown title="Dropdown" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link>
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
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;