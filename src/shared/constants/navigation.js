import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CategoryIcon from "@mui/icons-material/Category";
import AssignmentIcon from "@mui/icons-material/Assignment";
import StoreIcon from "@mui/icons-material/Store";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CommentIcon from '@mui/icons-material/Comment';

export const ADMIN_TAB_LINKS = [
    {
        key: "user",
        label: "Người dùng",
        path: "/admin/user",
        icon: <AccountCircleIcon />,
    },
    {
        key: "product",
        label: "Sản phẩm",
        path: "/admin/product",
        icon: <StoreIcon />,
    },
    {
        key: "category",
        label: "Danh mục",
        path: "/admin/category",
        icon: <CategoryIcon />,
    },
    {
        key: "order",
        label: "Đơn hàng",
        path: "/admin/order",
        icon: <AssignmentIcon />,
    },
    {
        key: "transaction",
        label: "Đơn thanh toán",
        path: "/admin/transaction",
        icon: <ReceiptLongIcon />,
    },
    {
        key: "comment",
        label: "Bình luận",
        path: "/admin/comment",
        icon: <CommentIcon />,
    },
];