<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
</script>

<template>
    <Header>
        <RouterLink to="/">
            <div class="title">JavaScript assignment</div>
            <div class="name">Joakim Lundell</div>
        </RouterLink>
        <nav>
            <RouterLink to="/">Start</RouterLink>
            <RouterLink to="/about">About</RouterLink>
        </nav>
    </Header>
    <RouterView />
</template>

<style scoped>

.title { 
    border-bottom: 1px solid var(--color-border);
    letter-spacing: 1px;
}
.name {
    letter-spacing: 5px;
}
nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a {
    display: inline-block;
    padding: 0 .6rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}
</style>
