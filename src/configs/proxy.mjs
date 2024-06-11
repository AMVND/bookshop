import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
const app = express();
const port = 3001; // Chọn một cổng cho máy chủ proxy

app.use(
  '', // Thay đổi '/api' thành đường dẫn bạn muốn
  createProxyMiddleware({
    // target: 'https://rhy4pj-8080.csb.app', // URL của máy chủ API
    target: "http://localhost:8080", // URL của máy chủ API
    changeOrigin: true,
  })
);

app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});