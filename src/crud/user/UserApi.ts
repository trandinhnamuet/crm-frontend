
import type User from "./User";

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

export async function getUsers(): Promise<User[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function getUser(id: number): Promise<User> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function createUser(data: Partial<User>): Promise<User> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}

export async function updateUser(id: number, data: Partial<User>): Promise<User> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete user');
}
