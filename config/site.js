export const siteConfig = {
  name: "SSE Express",
  shortName: "SSE",
  description:
    "Nền tảng quản trị và vận hành giao hàng dành cho doanh nghiệp vận chuyển và logistics.",
  trackingPlaceholder: "Theo dõi vận đơn của bạn",
  navigationSections: [
    {
      title: "TỔNG QUAN",
      items: [
        { id: "dashboard", label: "Bảng điều khiển", badge: "DB" },
        { id: "reports", label: "Báo cáo điều hành", badge: "BC" },
      ],
    },
    {
      title: "TÁC VỤ",
      items: [
        { id: "orders", label: "Đơn hàng", badge: "DH" },
        { id: "quick-order", label: "Tạo đơn nhanh", badge: "Q" },
        { id: "debt", label: "Quản lý công nợ", badge: "CN" },
      ],
    },
    {
      title: "KHÁCH HÀNG",
      items: [
        { id: "customers", label: "Khách hàng", badge: "KH" },
        { id: "addresses", label: "Địa chỉ nhận", badge: "ĐC" },
        { id: "collaborators", label: "Cộng tác viên", badge: "CTV" },
      ],
    },
    {
      title: "NHÂN SỰ",
      items: [
        { id: "sales", label: "Danh sách Sale", badge: "S" },
        { id: "internal", label: "Nhân viên nội bộ", badge: "NB" },
        { id: "managers", label: "Nhân sự quản lý", badge: "QL" },
        { id: "staff", label: "Nhân viên hiện trường", badge: "NV" },
      ],
    },
    {
      title: "DỮ LIỆU",
      items: [
        { id: "services", label: "Dịch vụ", badge: "DV" },
        { id: "units", label: "Đơn vị", badge: "ĐV" },
        { id: "categories", label: "Phân loại", badge: "PL" },
        { id: "countries", label: "Quốc gia", badge: "QG" },
        { id: "agents", label: "Đại lý", badge: "ĐL" },
        { id: "rates", label: "Tỷ giá", badge: "TG" },
      ],
    },
    {
      title: "VẬN HÀNH",
      items: [
        { id: "workflow", label: "Quy trình xử lý", badge: "WF" },
        { id: "tracking", label: "Theo dõi vận đơn", badge: "TR" },
        { id: "awb", label: "Vận đơn (AWB)", badge: "AWB" },
        { id: "commission", label: "Hoa hồng", badge: "HH" },
      ],
    },
    {
      title: "HỆ THỐNG",
      items: [
        { id: "notifications", label: "Thông báo", badge: "TB" },
        { id: "system", label: "Cấu hình hệ thống", badge: "HT" },
      ],
    },
  ],
  orderStatuses: [
    { id: "all", label: "Tất cả", count: 124 },
    { id: "ready", label: "Sẵn sàng", count: 13 },
    { id: "incoming", label: "Nhận hàng", count: 63 },
    { id: "ready-to-go", label: "Ready to go", count: 21 },
    { id: "delivering", label: "Đang phát hàng", count: 37 },
    { id: "cancelled", label: "Hủy", count: 3 },
    { id: "returning", label: "Đang chuyển hoàn", count: 16 },
    { id: "issue", label: "Sự cố", count: 2 },
    { id: "completed", label: "Hoàn tất", count: 45 },
  ],
  quickActions: [
    { id: "create", label: "Tạo đơn" },
    { id: "print", label: "In phiếu" },
    { id: "export", label: "Xuất dữ liệu" },
    { id: "sync", label: "Đồng bộ" },
    { id: "settings", label: "Thiết lập" },
    { id: "scan", label: "Quét mã" },
  ],
  user: {
    name: "Trần Phúc Dương",
    role: "Administrator",
    avatarInitials: "TD",
  },
};
