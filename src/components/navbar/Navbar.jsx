import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link , useNavigate} from "react-router-dom";
import { useContext, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";


const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [err , setErr] = useState()
  const navigate = useNavigate()
  const handleLogout = () => {

    axios.post("http://localhost:8800/api/auth/logout").then((res)=>navigate("/login")).catch((err)=>setErr(true))
  }
  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>TRIXBOX</span>
        </Link>
        <Link to="/" >
         <HomeOutlinedIcon className="homeicon"/>
        </Link>
        
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <GridViewOutlinedIcon />
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
      <div onClick={handleLogout}>
         <LogoutIcon />
      </div>
        {err && <div> Something wrong !</div>}
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <Link to={"/profile/" + currentUser.id} style={{ textDecoration: "none" }}>
        <div className="user">
          <img
            src={"http://localhost:8800/images/" + currentUser.profilepic}
            alt=""
          />
          <span>{currentUser.username}</span>
        </div>
        </Link>
        
      </div>
    </div>
  );
};

export default Navbar;
