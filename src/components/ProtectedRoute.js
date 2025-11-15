import React, { Children } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const protectedRoutes = ({cjildren, allowedRoles}) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style= {{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
            }}>
                <h2>Loading...</h2>
            </div>
        );
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }
     return Children
};

export default protectedRoutes;
