import { createContext, useContext, useState, useEffect } from "react";

export type User = {
  id: number;
  username: string;
  fullname: string;
  phone_number: string;
  date_of_birth: string;
  email: string;
  image_id: number;
  created_at: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};


const UserContext = createContext<UserContextType>({ user: null, setUser: () => {} });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Khi app khởi chạy, kiểm tra localStorage userId và fetch user nếu có
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      const API_URL = import.meta.env.VITE_API_URL || "";
      fetch(`${API_URL}/users/${userId}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setUser(data);
        });
    }
  }, []);

  // Hàm in ra thông tin user hiện tại, có thể gọi từ console
  (window as any).userInfo = function () {
    if (!user) {
      console.log("Chưa đăng nhập");
      return;
    }
    const { id, username, fullname, phone_number, date_of_birth, email, image_id, created_at } = user;
    console.log({ id, username, fullname, phone_number, date_of_birth, email, image_id, created_at });
  };

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
