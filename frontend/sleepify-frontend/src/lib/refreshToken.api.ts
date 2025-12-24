import { toast } from 'react-toastify'
import { useAuthStore } from '../Store/authStore'

export async function getProtectedData() {
	const {logout} = useAuthStore();
  try {
    let token = localStorage.getItem('accessToken');

    let res = await fetch(`${URL}/user/authorized`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      // Try to refresh
      const refreshRes = await fetch(`${URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // send cookies
      });

      if (!refreshRes.ok) {
        // Refresh failed → log out
        toast.error("Session expired. Please log in again.");
        logout(); 
        return;
      }

      const { accessToken } = await refreshRes.json();
      localStorage.setItem('accessToken', accessToken);

      // Retry original request
      res = await fetch(`${URL}/user/authorized`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    }

    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
