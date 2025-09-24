import { AuthContext } from "../AuthProvider/AuthProvider";
import { Button } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export const Logout: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    authContext
      ?.logOut()
      .then(() => {
        console.log("User logged out successfully");
        navigate("/signin");
      })
      .catch((error) => console.error(error));
  };
  return <Button onClick={handleSignOut}>Logout</Button>;
};
