export interface Customer {
  id: number;
  code: string;
  name: string;
  address: string;
  phone_number: string;
  email: string;
  note: string;
  image_id?: number;
  latitude?: number;
  longitude?: number;
  created_by?: number;
  created_at?: string;
  updated_by?: number;
  updated_at?: string;
  deleted_by?: number;
  deleted_at?: string;
  is_active: boolean;
}

const API_URL = `${import.meta.env.VITE_API_URL}/customers`;

export async function getCustomers(): Promise<Customer[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
}

export async function getCustomer(id: number): Promise<Customer> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch customer');
  return res.json();
}

export async function createCustomer(data: Partial<Customer>): Promise<Customer> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create customer');
  return res.json();
}

export async function updateCustomer(id: number, data: Partial<Customer>): Promise<Customer> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update customer');
  return res.json();
}

export async function deleteCustomer(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete customer');
}
