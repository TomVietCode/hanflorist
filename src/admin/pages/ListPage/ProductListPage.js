import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const columns = [
  {
    field: 'stt',
    headerName: 'STT',
    flex: 0.5, // 5% (giả sử tổng flex là 10)
    align: 'center',
  },
  {
    field: 'image',
    headerName: 'Hình ảnh',
    flex: 1, // 10%
    renderCell: (params) => (
      <img src={params.value} alt="image" style={{ width: 50, height: 50, objectFit: 'cover' }} />
    ),
  },
  {
    field: 'title',
    headerName: 'Tiêu đề',
    flex: 2.5, // 25%
  },
  {
    field: 'price',
    headerName: 'Giá',
    flex: 1.2, // 12%
    align: 'right',
  },
  {
    field: 'stock',
    headerName: 'Số lượng',
    flex: 0.9, // 9%
    align: 'center',
  },
  {
    field: 'status',
    headerName: 'Trạng thái',
    flex: 1.7, // 17%
    renderCell: (params) => (
      <span
        style={{
          color: 'white',
          padding: '6px 12px',
          borderRadius: 10,
          fontWeight: 600,
          cursor: 'pointer',
          textAlign: 'center',
        }}
        onClick={() => {
          console.log(`Trạng thái: ${params.value}`);
        }}
        // onMouseEnter={(e) => {
        //   e.target.style.backgroundColor = params.value === 'active' ? '#388E3C' : '#D32F2F';
        // }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = params.value === 'active' ? 'green' : 'red';
        }}
      >
        {params.value === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
      </span>
    ),
  },
  {
    field: 'createdBy',
    headerName: 'Tạo bởi',
    flex: 1.5, // 15%
  },
  {
    field: 'updatedAt',
    headerName: 'Cập nhật',
    flex: 1.8, // 18%
    renderCell: (params) => new Date(params.value).toLocaleString(),
  },  
];


const rows = [
  {
    id: 1,
    stt: 1,
    image: 'https://content.pancake.vn/2-24/s1800x1650/2024/9/28/7bd18e1c377f1791653dd50f216e3db14f0be4cb.jpg',
    title: 'Sản phẩm 1',
    price: '100.000 VND',
    stock: '2',
    status: 'active',
    createdBy: 'Nguyên Mạnh Mạnh Cường',
    updatedAt: '2025-01-10T14:00:00Z',
  },
  {
    id: 2,
    stt: 2,
    image: 'https://content.pancake.vn/2-24/s1800x1650/2024/9/28/7bd18e1c377f1791653dd50f216e3db14f0be4cb.jpg',
    title: 'Sản phẩm 2',
    price: '150.000 VND',
    stock: '3',
    status: 'inactive',
    createdBy: 'Admin',
    updatedAt: '2025-01-09T14:00:00Z',
  },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function ProductListPage() {
  return (
    <Paper sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{
          '& .MuiDataGrid-cell:focus': {
            outline: 'none', // Loại bỏ outline khi nhấp vào ô
          },
          '& .MuiDataGrid-columnHeader:focus': {
            outline: 'none', // Loại bỏ outline khi nhấp vào tiêu đề cột
          },
          userSelect: 'none',
        }}
      />
    </Paper>
  );
}