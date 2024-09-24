


export interface LoginData {
    id: string;
    username: string;
    role_id: string;
    token: string;
  }
  
  
  const LOGIN_DATA_KEY = "loginData";
  
  
  export const setLoginData = (loginData: LoginData): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(loginData));
    }
  };
  
  
  export const getLoginData = (): LoginData | null => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem(LOGIN_DATA_KEY);
      return storedData ? JSON.parse(storedData) : null;
    }else {
      return null;
    }
    
  };
  
  
  export const clearLoginData = (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOGIN_DATA_KEY);
    }    
  };
  