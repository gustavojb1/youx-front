
import { createContext, useContext, useState, useEffect, FC } from "react";
import axios from "axios";
import { clearLoginData, getLoginData, setLoginData } from "../../services/loginData.service";
import apiService from "../../services/api.service";
import { useRouter } from "next/navigation";
import { USER_ROLES } from "../../utils/roles"; 
import { jwtDecode } from "jwt-decode";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;


interface User {
  id: string;
  username: string;
  role_id: string;
}

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isPatient: boolean; 
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  
  const checkIsPatient = (role_id: string) => role_id === USER_ROLES.PATIENT;

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post<{ token: string }>(
        `${apiUrl}/users/login`,
        { email, password }
      );
      const token = data.token;
      const decodedToken = jwtDecode<User & { exp: number }>(token);
      const userData = {
        id: decodedToken.id,
        username: decodedToken.username,
        role_id: decodedToken.role_id,
      };
      setLoginData({ token, ...userData });
      setUser(userData);
      setIsAuthenticated(true);
      apiService.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Falha no login, verifique suas credenciais.";
        console.error("Erro ao fazer login:", errorMessage);
        throw new Error(errorMessage);
      } else {
        console.error("Erro ao fazer login:", error);
        throw new Error("Falha no login, verifique suas credenciais.");
      }
    }
  };

  const logout = () => {
    clearLoginData();
    setUser(null);
    setIsAuthenticated(false);
    apiService.defaults.headers.common["Authorization"] = "";
    router.push("/login");
  };

  useEffect(() => {
    const loginData = getLoginData();
    if (loginData?.token) {
      try {
        const decodedToken = jwtDecode<User>(loginData.token); 
        const userData = {
          id: decodedToken.id,
          username: decodedToken.username,
          role_id: decodedToken.role_id,
        };
        setUser(userData);
        setIsAuthenticated(true);
        apiService.defaults.headers.common["Authorization"] = `Bearer ${loginData.token}`;
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        logout(); 
      }
    } else {
      setIsAuthenticated(false);
      router.push("/login");
    }
  }, []);

  
  if (isAuthenticated === null) {
    return null; 
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        isPatient: user ? checkIsPatient(user.role_id) : false, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
