export default interface User {
  id: number;
  username: string;
  password: string;
  fullname?: string;
  phone_number?: string;
  date_of_birth?: string;
  email?: string;
  image_id?: number;
  created_at?: string;
}