// Định dạng tiền tệ của Quốc gia: Việt Nam
export const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
});