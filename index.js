var $ = jQuery;


function createPlotableData(rawData) {
    const data = rawData.map((line) => {
        return {
          x: line[1],
          y: line[3]
        };
      });
    return data;
}

Vue.component('line-chart', {
    extends: VueChartJs.Line,

    props: ['sensor'],
    data: function () {
        return {
            chartdata: {
                labels: app.computedSensorData[this.sensor.id].map((line) => {
                            return line[1]
                        }
                ),
                datasets: [{
                    label: "Sensor " + this.sensor.name + " reading",
                    data: createPlotableData(app.computedSensorData[this.sensor.id])

                }] 
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        }
    },


    mounted () {
         this.renderChart(this.chartdata, this.options);
    }
})

Vue.component('sensorComp', {
    props: ['sensor'],
    data: function () {
        return {
            comp_id: this._uid - 1,
            sensor_test: this.sensor,
            formData: {
                a: 0,
                b: 0 
            }
        }  
    },
    watch: {
        formData: {
            handler: function () {
            this.$emit('new-params', [this.comp_id, this.formData.a, this.formData.b])
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
      sensorIds: [],
      idsDict: {},
      dataComputed: false,
      rawSensorData: [],
      computedSensorData: {}
  },
  methods: {
    handleSensorIds: function(e) {
        app.sensorIds[e[0]].a = e[1];
        app.sensorIds[e[0]].b = e[2]
    },
    loadSensorIds: function(ev) {
        const file = ev.target.files[0];
        const reader = new FileReader();
    
        reader.onload = function(e) {
            var data = $.csv.toArrays(reader.result, {separator: " "});
            data.forEach(function(item) {
                app.sensorIds.push({id: parseInt(item[0]), name: item[1], a: 0, b: 0});
            });
            app.idsLoaded = true; 
        } 
        reader.readAsText(file);
    },
    computeSensorData: function() {
        app.dataComputed = false;
        app.sensorIds.forEach(function(item) {
            var arrayFilter = function(line) {return line[0] == item.id};
            var filteredArray = app.rawSensorData.filter(arrayFilter);
            filteredArray.map(function(line) {
                line[3] = (line[2] * item.a + item.b);
            })
            app.computedSensorData[item.id] = filteredArray;
        })
        this.$nextTick(() => {
            app.dataComputed = true; 
        })
    },
    loadSensorData: function(ev) {
        const file = ev.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            var data = $.csv.toArrays(reader.result, {separator: " "});
            let conv = arr => arr.map(v => Array.isArray(v) ? conv(v) : Number(v) || 0)

            app.rawSensorData = conv(data)

        } 
        reader.readAsText(file);
    }
  }
});




