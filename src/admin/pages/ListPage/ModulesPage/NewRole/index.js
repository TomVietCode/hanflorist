import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import { Editor } from "@tinymce/tinymce-react";
import AddIcon from "@mui/icons-material/Add";

const AddRolePage = () => {
  const [product, setProduct] = useState({
    images: [],
    title: "",
    description: "",
    price: "",
    discount: "",
    quantity: "",
    category: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };
 
  return (
    <Container maxWidth="md" sx={{ padding: 3 }}>
      <Card sx={{ p: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tên quyền{" "}
            <Typography component="span" color="error">
              *
            </Typography>
          </Typography>
          <Grid container spacing={3}>
            {/* Product Information */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="title"
                value={product.title}
                onChange={handleChange}
                placeholder="Tên sản phẩm"
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                      transition: "border-color 0.3s ease",
                    },
                  },
                }}
                InputProps={{
                  style: {
                    height: "2.5rem",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Mô tả{" "}
                <Typography component="span" color="error">
                  *
                </Typography>
              </Typography>
              <Editor
                apiKey="n5h7bzsqjitms467t41qjuac0tthph4wjqvy7aj2a5pygbo8"
                value={product.description}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar: `undo redo | formatselect | bold italic backcolor | 
                    alignleft aligncenter alignright alignjustify | 
                    bullist numlist outdent indent | removeformat | help`,
                }}
              />
            </Grid>
            {/* Submit Button */}
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                sx={{
                  marginTop: "1rem",
                  width: "12rem",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: "#1565c0", // Hover effect color
                  },
                }}
              >
                Thêm quyền
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AddRolePage;
