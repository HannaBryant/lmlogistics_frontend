import BASE_URL from "../config";

export async function getDrivers() {
  const res = await fetch(`${BASE_URL}/drivers`);
  if (!res.ok) throw new Error("Failed to fetch drivers");
  return res.json();
}

export async function createDriver(data) {
  const res = await fetch(`${BASE_URL}/drivers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create driver");
  return res.json();
}

export async function updateDriver(id, data) {
  const res = await fetch(`${BASE_URL}/drivers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update driver");
  return res.json();
}

export async function deleteDriver(id) {
  const res = await fetch(`${BASE_URL}/drivers/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete driver");
  return res.json();
}
