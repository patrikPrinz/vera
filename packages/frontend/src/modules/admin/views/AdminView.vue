<template>
  <div>
    <nav class="bg-primary fixed left-0 z-0 h-min w-full">
      <ul class="z-0 flex">
        <li>
          <router-link class="hover:bg-secondary block p-3" to="/admin/users"
            >Users</router-link
          >
        </li>
        <li>
          <router-link class="hover:bg-secondary block p-3" to="/admin/groups"
            >Groups</router-link
          >
        </li>
      </ul>
    </nav>

    <main class="pt-16">
      <router-view />
    </main>
  </div>
</template>
