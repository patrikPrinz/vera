import { defineStore } from 'pinia';
import { AuthService, type IAuthService } from './services/auth.service';
import { httpClient } from '@/shared/httpClient/HttpProvider';
import { ref, type Ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const email: Ref<string | null> = ref(null);
  const id: Ref<string | null> = ref(null);

  function setEmail(value: string): void {
    localStorage.setItem('email', value);
  }

  function getEmail(): string {
    const email = localStorage.getItem('email');
    if (email) {
      return email;
    }
    return '';
  }

  function setId(value: string): void {
    localStorage.setItem('id', value);
  }

  function getId(): string {
    const id = localStorage.getItem('id');
    if (id) {
      return id;
    }
    return '';
  }

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
      id.value = null;
      localStorage.removeItem('authenticated');
    }
  }

  async function isAuthenticated() {
    const authResult = await getAuthService().isLoggedIn();
    if (authResult && email == null) {
      await loadUserData();
    }
    if (authResult === true) {
      localStorage.setItem('authenticated', 'true');
    } else {
      localStorage.removeItem('authenticated');
    }
    return authResult;
  }

  function isAuthenticatedSync(): boolean {
    if (localStorage.getItem('authenticated') === null) {
      return false;
    }
    return localStorage.getItem('authenticated') === 'true';
  }

  async function loadUserData() {
    const data = await getAuthService().userDetails();
    if (data) {
      setEmail(data.email);
      setId(data.id);
      localStorage.setItem('authenticated', 'true');
    }
  }

  return {
    login,
    logout,
    isAuthenticated,
    isAuthenticatedSync,
    getEmail,
    getId,
  };
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
