import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

export default function LogoutPage() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    (async () => {
      await queryClient.clear();
      await logout();
      window.location.href = "/login";
    })();
  }, [logout, queryClient]);

  return (
    <main className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border" role="status" aria-hidden="true"></div>
        <div className="mt-2">Deslogando...</div>
      </div>
    </main>
  );
}