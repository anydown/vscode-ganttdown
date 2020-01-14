<template>
  <gantt :input="input" @change="update" :is-vscode="true"></gantt>
</template>
<script>
import Gantt from "@anydown/anydown-gantt"
import '@anydown/anydown-gantt/dist/anydown-gantt.css'

const vscode = acquireVsCodeApi();
export default {
  components: {
    Gantt
  },  
  data() {
    return {
      input: ""
    };
  },
  methods: {
    update(text){
      vscode.postMessage({
        command: "text",
        text: text
      });

    },
    apply() {
      vscode.postMessage({
        command: "text",
        text: this.input
      });
    }
  },
  mounted() {
    window.addEventListener("message", event => {
      const message = event.data;
      switch (message.command) {
        case "text":
          this.input = message.text;
          break;
      }
    });
  }
};
</script>