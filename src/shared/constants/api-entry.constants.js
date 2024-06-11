const userApi = {
    create: "/user/api/user",
    update: (id) => `/api/user/${id}`,
    filter: "/api/user/filter",
    getById: (id) => `/api/user/${id}`,
    delete: (id) => `/api/user/${id}`,
};
const categoryApi = {
    create: "/api/category/",
    update: (id) => `/api/category/${id}`,
    filter: "/api/category/filter",
    getById: (id) => `/api/category/${id}`,
    delete: (id) => `/api/category/${id}`,
};
const productApi = {
    getAllProductByPage: "/product/api",
}
const API_ENTRY = {
    user: userApi,
    category: categoryApi,
    product: productApi,
}

export default API_ENTRY;