# DATN – Đồ Án Tốt Nghiệp

DATN là một dự án web ứng dụng được phát triển nhằm phục vụ cho đồ án tốt nghiệp, bao gồm cả phần frontend và backend, cùng với hệ thống giao tiếp thời gian thực thông qua WebSocket.

## 🌐 Demo

Truy cập bản demo tại: [https://datn-beryl.vercel.app](https://datn-beryl.vercel.app)

## 📁 Cấu trúc thư mục

- `FE/`: Mã nguồn frontend (giao diện người dùng).
- `BE/`: Mã nguồn backend (API và xử lý dữ liệu).
- `Socket/`: Thành phần xử lý giao tiếp thời gian thực bằng WebSocket.
- `.vscode/`: Cấu hình cho môi trường phát triển Visual Studio Code.

## 🛠️ Công nghệ sử dụng

- **Frontend**: React.js, TypeScript, CSS
- **Backend**: Node.js, Express.js
- **Realtime**: Socket.IO
- **Triển khai**: Vercel

## 🚀 Hướng dẫn chạy dự án

### 1. Cài đặt Node.js (nếu chưa có)

Tải và cài đặt Node.js từ [https://nodejs.org](https://nodejs.org)

### 2. Khởi động Backend

````bash
cd BE
npm install
npm start


### 3. Khởi động FrontEnd

```bash
cd FE
npm install
npm run dev

### 4. Khởi động server socket
cd Socket
npm install
npm run dev


Sau khi khởi động, truy cập frontend tại http://localhost:3000 (hoặc cổng được chỉ định).

📌 Tính năng chính
Giao diện người dùng thân thiện và dễ sử dụng.

Xử lý dữ liệu hiệu quả với backend mạnh mẽ.

Giao tiếp thời gian thực giữa người dùng thông qua WebSocket.

Triển khai dễ dàng trên nền tảng Vercel.


✅ Nếu bạn cần thêm hướng dẫn về cấu hình môi trường `.env` hoặc chi tiết API route, mình có thể bổ sung.


````
