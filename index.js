var $ = jQuery;

Vue.component('sensor', {
    props: ['sensor'],
    data: function () {
        return {
            comp_id: this._uid - 1,
            formData: {
                a: 0,
                b: 0 
            }
        }  
    },
    watch: {
        formData: {
            handler: function () {
            this.$emit('newdata', [this.comp_id, this.formData.a, this.formData.b])
            },
            deep: true,
        }
    },
    template: '<tr> \
                    <td class="sensorId"> {{sensor.id}} </td> \
                    <td class="sensorName"> {{sensor.name}} </td> \
                    <td class="sensorAParam">\
                        <input v-model.number="formData.a" type="number">\
                    </td> \
                    <td class="sensorBParam">\
                        <input v-model.number="formData.b" type="number">\
                    </td> \
               </tr>'
})

var app = new Vue({
  el: "#app",
  data: {
      idsLoaded: false,
      message: "Choose a file",
      sensorData: []
  },
  methods: {
    handleSensorData: function(e) {
        console.log(e);
        app.sensorData[e[0]].a = e[1];
        app.sensorData[e[0]].b = e[2]
    },
    loadSensorIds: function(ev) {
        const file = ev.target.files[0];
        const reader = new FileReader();
    
        reader.onload = function(e) {
            console.log(reader.result);
            var data = $.csv.toArrays(reader.result, {separator: " "});
            data.forEach(function(item) {
                app.sensorData.push({id: item[0], name: item[1], a: 0, b: 0});
            });
            console.log(app.sensorData);
            app.message = reader.result;
            app.idsLoaded = true; 
        } 
        reader.readAsText(file);
    }
  }
});




