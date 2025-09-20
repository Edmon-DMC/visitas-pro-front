const BASE_URL = "http://localhost:8081/api";

export async function fetchData(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  return res.json();
}

export async function postData(endpoint, data) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
