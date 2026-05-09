import BASE_URL from "../config";

export async function getVehicles() {
  const res = await fetch(`${BASE_URL}/vehicles`);
  if (!res.ok) throw new Error("Failed to fetch vehicles");
  return res.json();
}

export async function createVehicle(data) {
  const res = await fetch(`${BASE_URL}/vehicles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create vehicle");
  return res.json();
}

export async function updateVehicle(id, data) {
  const res = await fetch(`${BASE_URL}/vehicles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update vehicle");
  return res.json();
}

export async function deleteVehicle(id) {
  const res = await fetch(`${BASE_URL}/vehicles/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete vehicle");
  return res.json();
}
