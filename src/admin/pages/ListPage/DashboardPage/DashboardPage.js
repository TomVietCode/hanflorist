import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { getLocalStorage } from "../../../../share/hepler/localStorage";
import Loading from "../../../components/loading/loding";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalAdmins: 0,
    totalClients: 0,
    totalNewClients: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [monthlyOrders, setMonthlyOrders] = useState([]);
  const [usersMap, setUsersMap] = useState({}); // Lưu thông tin người dùng theo userID
  const [loading, setLoading] = useState(true);
  const token = getLocalStorage("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Gọi API để lấy dữ liệu
        const [productsRes, categoriesRes, adminsRes, clientsRes, ordersRes] = await Promise.all([
          fetch("http://localhost:3001/admin/products", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3001/admin/categories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3001/admin/users?role=admin", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3001/admin/users?role=client", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3001/admin/orders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!productsRes.ok || !categoriesRes.ok || !adminsRes.ok || !clientsRes.ok || !ordersRes.ok) {
          throw new Error("Không thể tải dữ liệu");
        }

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const adminsData = await adminsRes.json();
        const clientsData = await clientsRes.json();
        const ordersData = await ordersRes.json();

        // Xử lý dữ liệu linh hoạt
        const products = Array.isArray(productsData) ? productsData : productsData.data || [];
        const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData.data || [];
        const admins = Array.isArray(adminsData) ? adminsData : adminsData.data || [];
        const clients = Array.isArray(clientsData) ? clientsData : clientsData.data || [];
        const orders = Array.isArray(ordersData) ? ordersData : ordersData.data || [];

        // Tạo map người dùng để tra cứu nhanh theo userID
        const usersMapTemp = {};
        const allUsers = [...admins, ...clients]; // Gộp danh sách admin và client để tạo map
        allUsers.forEach((user) => {
          usersMapTemp[user._id] = user.name; // Lưu tên người dùng theo _id
        });
        setUsersMap(usersMapTemp);

        // Tính khách hàng mới (trong 30 ngày qua, dựa trên `createdAt`)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newClients = clients.filter(
          (client) => new Date(client.createdAt) >= thirtyDaysAgo
        );

        // Tính tổng doanh thu
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Sắp xếp đơn hàng theo ngày mới nhất
        const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Tính đơn hàng theo tháng
        const monthlyOrderCount = orders.reduce((acc, order) => {
          const date = new Date(order.createdAt);
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
          acc[monthYear] = (acc[monthYear] || 0) + 1;
          return acc;
        }, {});

        const monthlyData = Object.entries(monthlyOrderCount).map(([name, value]) => ({
          name,
          orders: value,
        }));

        // Cập nhật state
        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          totalAdmins: admins.length,
          totalClients: clients.length,
          totalNewClients: newClients.length,
          totalOrders: orders.length,
          revenue: totalRevenue,
        });

        setRecentOrders(sortedOrders.slice(0, 5));
        setMonthlyOrders(monthlyData);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <Loading />
        </Box>
      ) : (
        <>
          {/* Widgets tóm tắt - Trên cùng một hàng */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={2}>
              <Card sx={{ bgcolor: "#1976d2", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">Sản phẩm</Typography>
                  <Typography variant="h4">{stats.totalProducts}</Typography>
                  <Button
                    size="small"
                    color="inherit"
                    onClick={() => navigate("/admin/products")}
                  >
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Card sx={{ bgcolor: "#28a745", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">Danh mục</Typography>
                  <Typography variant="h4">{stats.totalCategories}</Typography>
                  <Button
                    size="small"
                    color="inherit"
                    onClick={() => navigate("/admin/categories")}
                  >
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Card sx={{ bgcolor: "#ff9800", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">Admin</Typography>
                  <Typography variant="h4">{stats.totalAdmins}</Typography>
                  <Button
                    size="small"
                    color="inherit"
                    onClick={() => navigate("/admin/users")}
                  >
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Card sx={{ bgcolor: "#d81b60", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">Khách hàng</Typography>
                  <Typography variant="h4">{stats.totalClients}</Typography>
                  <Button
                    size="small"
                    color="inherit"
                    onClick={() => navigate("/admin/users")}
                  >
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Card sx={{ bgcolor: "#6d4c41", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">Khách mới</Typography>
                  <Typography variant="h4">{stats.totalNewClients}</Typography>
                  <Button
                    size="small"
                    color="inherit"
                    onClick={() => navigate("/admin/users")}
                  >
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Card sx={{ bgcolor: "#0288d1", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">Đơn hàng</Typography>
                  <Typography variant="h4">{stats.totalOrders}</Typography>
                  <Button
                    size="small"
                    color="inherit"
                    onClick={() => navigate("/admin/orders")}
                  >
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Biểu đồ và danh sách */}
          <Grid container spacing={3}>
            {/* Biểu đồ cột đơn hàng theo tháng */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Đơn hàng theo tháng
                </Typography>
                <BarChart width={400} height={300} data={monthlyOrders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#8884d8" />
                </BarChart>
              </Paper>
            </Grid>

            {/* Danh sách đơn hàng gần đây */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Đơn hàng gần đây
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "primary.main" }}>
                        <TableCell sx={{ color: "white" }}>Khách hàng</TableCell>
                        <TableCell sx={{ color: "white" }}>Tổng tiền</TableCell>
                        <TableCell sx={{ color: "white" }}>Ngày tạo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>
                            {order.shippingInfo?.name || usersMap[order.userID] || "Không có thông tin"}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(order.totalAmount || 0)}
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default AdminDashboard;