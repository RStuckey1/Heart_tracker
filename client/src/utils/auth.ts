import { type JwtPayload, jwtDecode } from 'jwt-decode';
import type { UserData } from '../interfaces/UserData';

class AuthService {
  getProfile() {
    return jwtDecode<UserData>(this.getToken());
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (decoded?.exp && decoded?.exp < Date.now() / 1000) {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  getToken(): string {
    return localStorage.getItem('id_token') || ''; // Retrieve the token from local storage
  }

  login(idToken: string) {
    localStorage.setItem('id_token', idToken);
  }

  logout(shouldRedirect: boolean = true) {
    localStorage.removeItem('id_token');
    if (shouldRedirect) {
      window.location.assign('/Landing'); // Redirect to the landing page
    }
  }
}

export default new AuthService();
