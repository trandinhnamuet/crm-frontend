export interface RouteTemplate {
  id: number;
  code: string;
  name: string;
  start_date: string;
  end_date: string;
  repeat_type: string;
  repeat_on: number;
  created_by?: number;
  created_at?: string;
  updated_by?: number;
  updated_at?: string;
  deleted_by?: number;
  deleted_at?: string;
  is_active: boolean;
}

const API_URL = `${import.meta.env.VITE_API_URL}/route-templates`;

export async function getRouteTemplates(): Promise<RouteTemplate[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch route templates');
  return res.json();
}

export async function getRouteTemplate(id: number): Promise<RouteTemplate> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch route template');
  return res.json();
}

export async function createRouteTemplate(data: Partial<RouteTemplate>): Promise<RouteTemplate> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create route template');
  return res.json();
}

export async function updateRouteTemplate(id: number, data: Partial<RouteTemplate>): Promise<RouteTemplate> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update route template');
  return res.json();
}

export async function deleteRouteTemplate(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete route template');
}
