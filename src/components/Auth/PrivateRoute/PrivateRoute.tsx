import { ReactNode, useContext } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { Navigate } from "react-router-dom";

type PrivateRouteType = {
    children: ReactNode
}
export const PrivateRoute: React.FC<PrivateRouteType> = ({ children }) => {
    const authContext = useContext(AuthContext);

    if (authContext === null) {
        return <Navigate to="/" />;
    }
    const { loading, user } = authContext!;

    if (loading) {
        return <span className="loading loading-dots loading-lg"></span>;
    }

    if (user) {
        return children;
    }
};
