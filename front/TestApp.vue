<template>
  <div>
    <gantt :input="input" @change="update"></gantt>
    <textarea v-model="input" cols="60" rows="20"></textarea>
  </div>
</template>
<script>
import Gantt from "@anydown/anydown-gantt"
import '@anydown/anydown-gantt/dist/anydown-gantt.css'

export default {
  components: {
    Gantt
  },
  data() {
    return {
      input: "test,2019-12-26,2019-12-30"
    };
  },
  methods: {
    update(text) {
      this.input = text;
    }
  }
};
</script>

<style>
body{
  background: #1e1e1e;
}
</style>