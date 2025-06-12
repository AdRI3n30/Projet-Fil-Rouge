import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children: React.ReactNode;
}

const VendeurRoute: React.FC<Props> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user ) {
    return <Navigate to="/login" replace />;
  }
  if ((user.role !== "VENDEUR" && user.role !== "ADMIN")) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default VendeurRoute;