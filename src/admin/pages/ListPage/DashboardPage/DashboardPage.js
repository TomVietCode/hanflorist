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
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { getLocalStorage } from "../../../../share/hepler/localStorage";
import Loading from "../../../components/loading/loding";
import { get } from "../../../../share/utils/http";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    overview: {
      revenue: 0,
      orderCount: 0,
      productCount: 0,
      userCount: 0,
      recentOrders: [],
      orderStatusCounts: {},
      paymentStatusCounts: {},
    },
    revenue: {
      revenueByDate: [],
      totalRevenue: 0,
      orderCount: 0,
      revenueByPaymentMethod: {},
    },
    orders: {
      ordersByStatus: {},
      ordersByPaymentMethod: {},
      ordersByPaymentStatus: {},
      ordersByDate: [],
    },
    products: {
      productsByCategory: [],
      topSellingProducts: [],
      lowStockProducts: [],
      productsByStatus: {},
    },
    users: {
      usersByRole: {},
      usersByStatus: {},
      usersByMonth: [],
      topCustomers: [],
    },
  });
  const [period, setPeriod] = useState("week");
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = getLocalStorage("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, [token, period]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Gọi tất cả API dashboard
      const [overviewData, revenueData, orderData, productData, userData] = await Promise.all([
        get(token, "/admin/dashboard/overview"),
        get(token, `/admin/dashboard/revenue?period=${period}`),
        get(token, `/admin/dashboard/orders?period=${period}`),
        get(token, "/admin/dashboard/products"),
        get(token, "/admin/dashboard/users"),
      ]);

      setDashboardData({
        overview: overviewData.data || {},
        revenue: revenueData.data || {},
        orders: orderData.data || {},
        products: productData.data || {},
        users: userData.data || {},
      });
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

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
            <Grid item xs={12} sm={3}>
              <Card sx={{ bgcolor: "#1976d2", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">Doanh thu</Typography>
                  <Typography variant="h4">{formatCurrency(dashboardData.overview.revenue)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card sx={{ bgcolor: "#0288d1", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">Đơn hàng</Typography>
                  <Typography variant="h4">{dashboardData.overview.orderCount}</Typography>
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
            <Grid item xs={12} sm={3}>
              <Card sx={{ bgcolor: "#1976d2", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">Sản phẩm</Typography>
                  <Typography variant="h4">{dashboardData.overview.productCount}</Typography>
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
            <Grid item xs={12} sm={3}>
              <Card sx={{ bgcolor: "#d81b60", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">Khách hàng</Typography>
                  <Typography variant="h4">{dashboardData.overview.userCount}</Typography>
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
          </Grid>

          {/* Tabs để chuyển đổi giữa các loại thống kê */}
          <Box sx={{ mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Tổng quan" />
              <Tab label="Doanh thu" />
              <Tab label="Đơn hàng" />
              <Tab label="Sản phẩm" />
              <Tab label="Người dùng" />
            </Tabs>
          </Box>

          {/* Tab Tổng quan */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              {/* Tình trạng đơn hàng */}
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Tình trạng đơn hàng
                  </Typography>
                  <PieChart width={400} height={300}>
                    <Pie
                      data={Object.entries(dashboardData.overview.orderStatusCounts || {}).map(([name, value], index) => ({
                        name,
                        value
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {Object.entries(dashboardData.overview.orderStatusCounts || {}).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Số lượng']} />
                  </PieChart>
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
                          <TableCell sx={{ color: "white" }}>Mã đơn</TableCell>
                          <TableCell sx={{ color: "white" }}>Tổng tiền</TableCell>
                          <TableCell sx={{ color: "white" }}>Trạng thái</TableCell>
                          <TableCell sx={{ color: "white" }}>Ngày tạo</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dashboardData.overview.recentOrders?.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order.orderCode}</TableCell>
                            <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                            <TableCell>{order.status}</TableCell>
                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Tab Doanh thu */}
          {tabValue === 1 && (
            <>
              <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button 
                  variant={period === "week" ? "contained" : "outlined"} 
                  sx={{ mr: 1 }}
                  onClick={() => handlePeriodChange("week")}
                >
                  Tuần
                </Button>
                <Button 
                  variant={period === "month" ? "contained" : "outlined"} 
                  sx={{ mr: 1 }}
                  onClick={() => handlePeriodChange("month")}
                >
                  Tháng
                </Button>
                <Button 
                  variant={period === "year" ? "contained" : "outlined"}
                  onClick={() => handlePeriodChange("year")}
                >
                  Năm
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Doanh thu theo thời gian
                    </Typography>
                    <Typography variant="h5" color="primary" gutterBottom>
                      Tổng doanh thu: {formatCurrency(dashboardData.revenue.totalRevenue)}
                    </Typography>
                    <BarChart width={800} height={300} data={dashboardData.revenue.revenueByDate}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" name="Doanh thu" />
                    </BarChart>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Doanh thu theo phương thức thanh toán
                    </Typography>
                    <PieChart width={400} height={300}>
                      <Pie
                        data={Object.entries(dashboardData.revenue.revenueByPaymentMethod || {}).map(([name, data], index) => ({
                          name,
                          value: data.total
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {Object.entries(dashboardData.revenue.revenueByPaymentMethod || {}).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}

          {/* Tab Đơn hàng */}
          {tabValue === 2 && (
            <>
              <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button 
                  variant={period === "week" ? "contained" : "outlined"} 
                  sx={{ mr: 1 }}
                  onClick={() => handlePeriodChange("week")}
                >
                  Tuần
                </Button>
                <Button 
                  variant={period === "month" ? "contained" : "outlined"} 
                  sx={{ mr: 1 }}
                  onClick={() => handlePeriodChange("month")}
                >
                  Tháng
                </Button>
                <Button 
                  variant={period === "year" ? "contained" : "outlined"}
                  onClick={() => handlePeriodChange("year")}
                >
                  Năm
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Đơn hàng theo thời gian
                    </Typography>
                    <BarChart width={800} height={300} data={dashboardData.orders.ordersByDate}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#82ca9d" name="Số đơn hàng" />
                    </BarChart>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Đơn hàng theo trạng thái
                    </Typography>
                    <PieChart width={400} height={300}>
                      <Pie
                        data={Object.entries(dashboardData.orders.ordersByStatus || {}).map(([name, value], index) => ({
                          name,
                          value
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {Object.entries(dashboardData.orders.ordersByStatus || {}).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Số lượng']} />
                    </PieChart>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Đơn hàng theo phương thức thanh toán
                    </Typography>
                    <PieChart width={400} height={300}>
                      <Pie
                        data={Object.entries(dashboardData.orders.ordersByPaymentMethod || {}).map(([name, value], index) => ({
                          name,
                          value
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {Object.entries(dashboardData.orders.ordersByPaymentMethod || {}).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Số lượng']} />
                    </PieChart>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}

          {/* Tab Sản phẩm */}
          {tabValue === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Sản phẩm theo danh mục
                  </Typography>
                  <PieChart width={400} height={300}>
                    <Pie
                      data={dashboardData.products.productsByCategory || []}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="category"
                      label={({category, percent}) => `${category}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {(dashboardData.products.productsByCategory || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Số lượng']} />
                  </PieChart>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Sản phẩm theo trạng thái
                  </Typography>
                  <PieChart width={400} height={300}>
                    <Pie
                      data={Object.entries(dashboardData.products.productsByStatus || {}).map(([name, value], index) => ({
                        name,
                        value
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {Object.entries(dashboardData.products.productsByStatus || {}).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Số lượng']} />
                  </PieChart>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Sản phẩm bán chạy nhất
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "primary.main" }}>
                          <TableCell sx={{ color: "white" }}>Sản phẩm</TableCell>
                          <TableCell sx={{ color: "white" }}>Số lượng bán</TableCell>
                          <TableCell sx={{ color: "white" }}>Doanh thu</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dashboardData.products.topSellingProducts?.map((item) => (
                          <TableRow key={item.product?._id}>
                            <TableCell>{item.product?.title}</TableCell>
                            <TableCell>{item.totalSold}</TableCell>
                            <TableCell>{formatCurrency(item.revenue)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Sản phẩm tồn kho thấp
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "primary.main" }}>
                          <TableCell sx={{ color: "white" }}>Sản phẩm</TableCell>
                          <TableCell sx={{ color: "white" }}>Giá</TableCell>
                          <TableCell sx={{ color: "white" }}>Tồn kho</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dashboardData.products.lowStockProducts?.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>{product.title}</TableCell>
                            <TableCell>{formatCurrency(product.price)}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Tab Người dùng */}
          {tabValue === 4 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Người dùng theo vai trò
                  </Typography>
                  <PieChart width={400} height={300}>
                    <Pie
                      data={Object.entries(dashboardData.users.usersByRole || {}).map(([name, value], index) => ({
                        name,
                        value
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {Object.entries(dashboardData.users.usersByRole || {}).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Số lượng']} />
                  </PieChart>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Người dùng theo trạng thái
                  </Typography>
                  <PieChart width={400} height={300}>
                    <Pie
                      data={Object.entries(dashboardData.users.usersByStatus || {}).map(([name, value], index) => ({
                        name,
                        value
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {Object.entries(dashboardData.users.usersByStatus || {}).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Số lượng']} />
                  </PieChart>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Đăng ký người dùng theo tháng
                  </Typography>
                  <BarChart width={800} height={300} data={dashboardData.users.usersByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Số người dùng" />
                  </BarChart>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Khách hàng chi tiêu nhiều nhất
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "primary.main" }}>
                          <TableCell sx={{ color: "white" }}>Khách hàng</TableCell>
                          <TableCell sx={{ color: "white" }}>Email</TableCell>
                          <TableCell sx={{ color: "white" }}>Số đơn hàng</TableCell>
                          <TableCell sx={{ color: "white" }}>Tổng chi tiêu</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dashboardData.users.topCustomers?.map((customer) => (
                          <TableRow key={customer.user?._id}>
                            <TableCell>{customer.user?.name}</TableCell>
                            <TableCell>{customer.user?.email}</TableCell>
                            <TableCell>{customer.orderCount}</TableCell>
                            <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default AdminDashboard;