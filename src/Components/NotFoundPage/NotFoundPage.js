import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">404 - Không tìm thấy trang</h1>
              <p className="card-text">Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
              <Link to="/" className="btn btn-primary">Quay lại trang chủ</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}