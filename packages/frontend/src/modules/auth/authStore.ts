import { defineStore } from 'pinia';
import { AuthService, type IAuthService } from './services/auth.service';
import { httpClient } from '@/shared/httpClient/HttpProvider';
import { ref, type Ref } from 'vue';
import type { UserRoleRecord } from '@/shared/types/auth/auth.types';

export const useAuthStore = defineStore('auth', () => {
  const email: Ref<string | null> = ref(null);
  const id: Ref<string | null> = ref(null);
  const roles: Ref<UserRoleRecord[]> = ref([]);

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
    const loginResult = await getAuthService()?.login(login, password);
    if (loginResult) {
      await loadUserData();
      return true;
    }
    return false;
  }

  async function logout() {
    const logoutResult = await getAuthService()?.logout();
    if (logoutResult) {
      email.value = null;
      id.value = null;
      localStorage.removeItem('authenticated');
      localStorage.removeItem('roles');
    }
  }

  async function isAuthenticated() {
    const authResult = await getAuthService()?.isLoggedIn();
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
  async function loadRoles() {
    const loadedRoles = await getAuthService()?.userRoles(getId());
    roles.value = loadedRoles ?? [];
    localStorage.setItem('roles', JSON.stringify(loadedRoles));
  }

  function getUserRoles() {
    const storageData = localStorage.getItem('roles');
    if (!roles.value && storageData != null) {
      roles.value = JSON.parse(storageData) as UserRoleRecord[];
    }
    return roles.value;
  }

  function hasRoles(testedRoles: string[], group?: string) {
    const storageItem = localStorage.getItem('roles');
    if (roles.value.length == 0 && storageItem != null) {
      const parsedData = JSON.parse(storageItem) as UserRoleRecord[];
      roles.value = parsedData;
    }
    for (const role of roles.value) {
      if (
        testedRoles.includes(role.code) &&
        (!role.group || (role.group && role.group == group))
      ) {
        return true;
      }
    }
    return false;
  }

  async function loadUserData() {
    const data = await getAuthService()?.userDetails();
    if (data) {
      setEmail(data.email);
      setId(data.id);
      localStorage.setItem('authenticated', 'true');
      await loadRoles();
    }
  }

  return {
    login,
    logout,
    isAuthenticated,
    isAuthenticatedSync,
    getEmail,
    getId,
    hasRoles,
    getUserRoles,
  };
});

let authService: IAuthService | null = null;

export function setAuthService(service: IAuthService | null) {
  authService = service;
}

function getAuthService(): IAuthService | null {
  if (!authService) {
    authService = new AuthService(httpClient);
  }
  return authService;
}
