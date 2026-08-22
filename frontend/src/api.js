const API_URL = "http://localhost:5000";

export async function testBackend() {
  const response = await fetch(`${API_URL}/`);

  if (!response.ok) {
    throw new Error("Backend request failed");
  }

  return response.json();
}

export async function loginUser(loginId, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login_id: loginId,
      password: password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed"
    );
  }

  return data;
}