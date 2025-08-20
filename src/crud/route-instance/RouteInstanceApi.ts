
export interface RouteTemplate {
  id: number;
  code: string;
  name: string;
  start_date: string;
  end_date: string;
  repeat_type: string;
  repeat_on: number;
  created_by: number | null;
  created_at: string | null;
  updated_by: number | null;
  updated_at: string | null;
  deleted_by: number | null;
  deleted_at: string | null;
  is_active: boolean;
}

export interface RouteInstance {
  id: number;
  route_template_id: number;
  route_template: RouteTemplate;
  start_date: string;
  end_date?: string;
  is_finished: boolean;
  created_at?: string;
}

const API_URL = `${import.meta.env.VITE_API_URL}/route-instances`;

export async function getRouteInstances(): Promise<RouteInstance[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch route instances');
  return res.json();
}

export async function getRouteInstance(id: number): Promise<RouteInstance> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch route instance');
  return res.json();
}

export async function createRouteInstance(data: Partial<RouteInstance>): Promise<RouteInstance> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create route instance');
  return res.json();
}

export async function updateRouteInstance(id: number, data: Partial<RouteInstance>): Promise<RouteInstance> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update route instance');
  return res.json();
}

export async function deleteRouteInstance(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete route instance');
}
