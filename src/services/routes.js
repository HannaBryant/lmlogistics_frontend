import BASE_URL from "../config";

export async function getRoutes() {
  const res = await fetch(`${BASE_URL}/routes`);
  if (!res.ok) throw new Error("Failed to fetch routes");
  return res.json();
}

export async function createRoute(data) {
  const res = await fetch(`${BASE_URL}/routes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create route");
  return res.json();
}

export async function updateRoute(id, data) {
  const res = await fetch(`${BASE_URL}/routes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update route");
  return res.json();
}

export async function deleteRoute(id) {
  const res = await fetch(`${BASE_URL}/routes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete route");
  return res.json();
}
