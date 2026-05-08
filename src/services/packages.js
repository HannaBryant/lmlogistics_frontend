const BASE_URL = "http://localhost:5000";

export async function getPackages() {
  const res = await fetch(`${BASE_URL}/packages`);
  if (!res.ok) throw new Error("Failed to fetch packages");
  return res.json();
}

export async function createPackage(data) {
  const res = await fetch(`${BASE_URL}/packages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create package");
  return res.json();
}

export async function updatePackage(id, data) {
  const res = await fetch(`${BASE_URL}/packages/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update package");
  return res.json();
}

export async function deletePackage(id) {
  const res = await fetch(`${BASE_URL}/packages/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete package");
  return res.json();
}
