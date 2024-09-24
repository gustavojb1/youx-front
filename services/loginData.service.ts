


export interface LoginData {
    id: string;
    username: string;
    role_id: string;
    token: string;
  }
  
  
  const LOGIN_DATA_KEY = "loginData";
  
  
  export const setLoginData = (loginData: LoginData): void => {
    localStorage.setItem(LOGIN_DATA_KEY, JSON.stringify(loginData));
  };
  
  
  export const getLoginData = (): LoginData | null => {
    const storedData = localStorage.getItem(LOGIN_DATA_KEY);
    return storedData ? JSON.parse(storedData) : null;
  };
  
  
  export const clearLoginData = (): void => {
    localStorage.removeItem(LOGIN_DATA_KEY);
  };
  