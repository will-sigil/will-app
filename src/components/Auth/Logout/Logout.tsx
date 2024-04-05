import { AuthContext } from "../AuthProvider/AuthProvider";
import { Button } from "@mui/material"
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

type LogoutProps = {

}

export const Logout: React.FC<LogoutProps> = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    
    const handleSignOut = () => {
        authContext?.logOut()
          .then(() => {
            console.log("User logged out successfully");
            navigate("/"); 
          })
          .catch((error) => console.error(error));
      };
    return <Button onClick={handleSignOut}>Logout</Button>
}