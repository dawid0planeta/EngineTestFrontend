var app = new Vue({
  el: "#app",
  methods: {
    loadTextFromFile: function(ev) {
        const file = ev.target.files[0];
        const reader = new FileReader();
    
        reader.onload = e => this.$emit("load", e.target.result);
        reader.readAsText(file);
    }
  }
});
