import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigation } from "../useNavigation"; // Import custom hook
import { NAVIGATION } from "../Navigation"; // Import NAVIGATION từ file Navigation.js

function Sidebar() {
  const { navigateTo } = useNavigation(); // Dùng useNavigation để điều hướng

  return (
    <List>
      {NAVIGATION.map((item) => (
        <ListItem
          button
          key={item.segment}
          onClick={() => {
            console.log("Clicked on:", item.path); // Kiểm tra path
            navigateTo(item.path); // Gọi hàm navigateTo để điều hướng
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItem>
      ))}
    </List>
  );
}

export default Sidebar;
