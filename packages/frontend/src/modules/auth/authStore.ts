import { defineStore } from 'pinia';
import { AuthService, type IAuthService } from './services/auth.service';
import { httpClient } from '@/shared/httpClient/HttpProvider';
import { ref, type Ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const email: Ref<string | null> = ref(null);

  async function login(login: string, password: string) {
    const loginResult = await getAuthService().login(login, password);
    if (loginResult) {
      await loadUserData();
      return true;
    }
    return false;
  }

  async function logout() {
    const logoutResult = await getAuthService().logout();
    if (logoutResult) {
      email.value = null;
    }
  }

  async function isAuthenticated() {
    const authResult = await getAuthService().isLoggedIn();
    if (authResult && email == null) {
      await loadUserData();
    }
    return authResult;
  }

  async function loadUserData() {
    const data = await getAuthService().userDetails();
    if (data) {
      email.value = data.email;
    }
  }

  return { login, logout, isAuthenticated };
});

let authService: IAuthService | null = null;

export function setAuthService(service: IAuthService | null) {
  authService = service;
}

function getAuthService(): IAuthService {
  if (!authService) {
    authService = new AuthService(httpClient);
  }
  return authService;
}
