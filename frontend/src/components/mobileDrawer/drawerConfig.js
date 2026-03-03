import HomeIcon from "@mui/icons-material/Home";
import EditIcon from "@mui/icons-material/Edit";
import DescriptionIcon from "@mui/icons-material/Description";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";

export const DRAWER_NAV_ITEMS = [
  { label: "Home", path: "/", icon: HomeIcon },
  { label: "Chat", path: "/chat", icon: EditIcon },
  { label: "Docs", path: "/docs", icon: DescriptionIcon },
  { label: "Analytics", path: "/analytics", icon: AnalyticsIcon },
  { label: "Professors", path: "/add-professor", icon: PeopleIcon },
  { label: "Profile", path: "/profile", icon: PersonIcon },
];
