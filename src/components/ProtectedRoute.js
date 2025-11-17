import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({children, allowedRoles}) => {
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

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export default ProtectedRoute;
