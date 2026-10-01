// ชั้นกลางสำหรับคุยกับ Backend ของทีมเรา
// วันนี้ = mock ที่พอร์ต 4000
// สัปดาห์หน้า = Go backend

const BASE = process.env.REACT_APP_API_URL || '';

// ---------- API หลัก ----------
export async function apiFetch(
  path,
  { method = 'GET', body, token } = {}
) {
  // 1) Headers
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // 2) Request
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body !== undefined
      ? JSON.stringify(body)
      : undefined,
  });

  // 3) 204 No Content
  if (res.status === 204) {
    return null;
  }

  // 4) อ่าน JSON
  const data = await res.json();

  // ถ้า request ไม่สำเร็จ
  if (!res.ok) {
    const err = new Error(
      data.error || 'Request failed'
    );

    err.status = res.status;

    throw err;
  }

  return data;
}

// ---------- สมาชิก ----------

export function register(email, password, displayName) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: {
      email,
      password,
      displayName,
    },
  });
}

export function login(email, password) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: {
      email,
      password,
    },
  });
}

export function getMe(token) {
  return apiFetch('/api/me', {
    token,
  });
}

// ---------- รีวิว ----------

export function getReviews(movieId) {
  return apiFetch(
    `/api/movies/${movieId}/reviews`
  );
}

export function postReview(movieId, text, token) {
  return apiFetch(
    `/api/movies/${movieId}/reviews`,
    {
      method: 'POST',
      body: { text },
      token,
    }
  );
}

// ---------- คะแนน ----------

export function putVote(movieId, score, token) {
  return apiFetch(
    `/api/movies/${movieId}/vote`,
    {
      method: 'PUT',
      body: { score },
      token,
    }
  );
}

// ---------- Wishlist ----------

export function getWishlist(token) {
  return apiFetch('/api/me/wishlist', {
    token,
  });
}

export function addToWishlist(movieId, token) {
  return apiFetch(
    `/api/me/wishlist/${movieId}`,
    {
      method: 'PUT',
      token,
    }
  );
}

export function removeFromWishlist(movieId, token) {
  return apiFetch(
    `/api/me/wishlist/${movieId}`,
    {
      method: 'DELETE',
      token,
    }
  );
}

// ---------- หนัง ----------

export async function getMovies() {
  const data = await apiFetch('/api/movies');

  return data.items;
}

export async function getMovie(movieId) {
  return apiFetch(`/api/movies/${movieId}`);
}
