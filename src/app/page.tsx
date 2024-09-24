"use client";
import { useEffect } from "react";
import "./globals.css";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/Auth/Auth.Context";
import { USER_ROLES } from "../../utils/roles"; 
import 'leaflet/dist/leaflet.css';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      switch (user?.role_id) {
        case USER_ROLES.PATIENT:
          router.push("/minhas-consultas");
          break;
        case USER_ROLES.NURSE:
          router.push("/aprovar-consultas");
          break;
        case USER_ROLES.DOCTOR:
          router.push("/minhas-consultas");
          break;
        case USER_ROLES.ADMIN:
          router.push("/gerenciar-usuarios");
          break;
        default:
          router.push("/login");
      }
    }
  }, [isAuthenticated, user, router]);

  return null;
}
