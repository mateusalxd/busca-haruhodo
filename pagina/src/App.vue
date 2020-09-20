<template>
  <Pesquisa />
</template>

<script>
import Pesquisa from "./components/Pesquisa.vue";

export default {
  name: "App",
  components: {
    Pesquisa,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 10px;
}
</style>
