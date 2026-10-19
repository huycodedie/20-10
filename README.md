# Mã nguồn web bó hoa 20.10

Bản dựng lại từ trang tham chiếu:
https://bo-hoa-2010-tron-ven.arcane-crow-4411.chatgpt.site/

## Các tệp

- `index.html`: nội dung và bố cục trang.
- `style.css`: giao diện và các kích thước màn hình.
- `app.js`: danh sách người, tìm tên không dấu, mở/đóng thiệp, lời chúc thay đổi, chia sẻ liên kết, lưu thiệp PNG, bật/tắt hiệu ứng.
- `assets/flowers`: hình hoa và giấy gói dạng SVG.
- `assets/people`: ảnh chân dung trong danh sách của bạn.
- `assets/fonts`: phông chữ Noto Sans và Noto Serif.

Không cần cài thư viện hoặc biên dịch. Có thể chỉnh sửa trực tiếp các tệp HTML/CSS/JavaScript, rồi đặt toàn bộ thư mục lên hosting tĩnh.

Để đổi tên hoặc ảnh, sửa mảng `people` ở đầu `app.js` và thay ảnh tương ứng trong `assets/people`.

## Phạm vi bản sao

Giao diện, phông chữ, hình hoa và ảnh chân dung được lấy từ phần công khai của trang đang chạy. Mã JavaScript tương tác được dựng lại. Đây không phải mã nguồn máy chủ gốc: lời chúc được ghép từ nội dung trong `app.js`, thay đổi qua mỗi lần mở và không gọi API của trang gốc. Không kèm cơ sở dữ liệu, khóa API, thông tin đăng nhập hoặc cấu hình Sites.

Tính năng sao chép liên kết cần HTTPS hoặc localhost; khi trình duyệt không cho phép truy cập clipboard, trang hiển thị cách sao chép thủ công. Lưu thiệp PNG nên dùng qua HTTP/HTTPS để tránh hạn chế ảnh canvas của giao thức file://.

Đã kiểm tra tìm tên không dấu, mở đúng thiệp, sao chép liên kết và xuất PNG. Không triển khai website lên mạng.

## Cập nhật bố cục tự co giãn

Số hoa tự khớp số người trong mảng `people` của `app.js`. Thêm hoặc bớt người không cần chỉnh tọa độ: hoa, cành, số hàng, kích thước và nội dung số lượng tự cập nhật. Với 11 người hiện tại, hoa xếp 3–4–4. Danh sách người và ảnh riêng được giữ nguyên.

`index.html` cần nạp `bouquet-layout.js` trước `app.js`. Giữ cả hai tệp khi sao chép hoặc chuyển hosting. Không cần cài thư viện hoặc biên dịch.
