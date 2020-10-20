function createPlotableData(rawData) {
    const data = rawData.map((line) => {
        return {
          x: line[1],
          y: line[3]
        };
      });
    return data;
}

Vue.component('lineChart', {
    extends: VueChartJs.Line,
    props: ['sensor', 'data'],

    data: function () {
        return {
            chartdata: {
                labels: this.data[this.sensor.id].map((line) => {
                            return line[1]
                        }
                ),
                datasets: [{
                    label: "Sensor " + this.sensor.name + " reading",
                    borderColor: '#d9d9d9',
                    borderWidth: 1,
                    lineTension: 0,
                    xAxisID: 'xAxis',
                    yAxisID: 'yAxis',

                    fill: false,
                    pointRadius: 2,
                    pointBorderWidth: 0,
                    pointBackgroundColor: '#FFF842',
                    data: createPlotableData(this.data[this.sensor.id])

                }] 
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    labels: {
                        fontColor: '#FBFBFB',
                        fontSize: 13
                    }
                },
                scales: {
                    xAxes: [
                        {
                            id: "xAxis",
                            scaleLabel: {
                                display: true,
                                labelString: "Timestamp",
                                fontColor: '#FBFBFB'
                            },
                            gridLines: {
                                color: '#737373',
                                lineWidth: 1,
                            }
                        }
                    ],
                    yAxes: [
                        {
                            id: "yAxis",
                            scaleLabel: {
                                display: true,
                                labelString: "Reading",
                                fontColor: '#FBFBFB'
                            },
                            gridLines: {
                                color: '#737373',
                                lineWidth: 1,
                            }
                        }
                    ]

                }
            }
        }
    },

    mounted () {
         this.renderChart(this.chartdata, this.options);
    }
})

Vue.component('sensorComp', {
    props: ['sensor-prop'],

    data: function () {
        return {
            comp_id: this._uid - 1,
            sensor: this.sensorProp,
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
                    <td class="sensorParam">\
                        <input v-model.number="formData.a" type="number">\
                    </td> \
                    <td class="sensorParam">\
                        <input v-model.number="formData.b" type="number">\
                    </td> \
               </tr>'
})





var app = new Vue({
    el: "#app",
    data: {
        isIdsFileLoaded: false,
        sensorIds: [],
        isDataComputed: false,
        rawSensorData: [],
        computedSensorData: {}
    },
    methods: {
        loadSensorIds: function(ev) {
            // Loads sensor info from file and stores it in sensorIds
            const file = ev.target.files[0];
            const reader = new FileReader();
        
            reader.onload = function(e) {
                var data = jQuery.csv.toArrays(reader.result, {separator: " "});
                data.forEach(function(item) {
                    app.sensorIds.push({id: parseInt(item[0]), name: item[1], a: 0, b: 0});
                });
                app.isIdsFileLoaded = true; 
            } 
            reader.readAsText(file);
        },

        updateSensorParams: function(e) {
            // Updates
            app.sensorIds[e[0]].a = e[1];
            app.sensorIds[e[0]].b = e[2];
        },


        loadSensorData: function(ev) {
            const file = ev.target.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                var data = jQuery.csv.toArrays(reader.result, {separator: " "});
                let conv = arr => arr.map(v => Array.isArray(v) ? conv(v) : Number(v) || 0)

                app.rawSensorData = conv(data)

            } 
            reader.readAsText(file);
        },
        computeSensorData: function() {
            app.isDataComputed = false;
            app.sensorIds.forEach(function(item) {
                var arrayFilter = function(line) {return line[0] == item.id};
                var filteredArray = app.rawSensorData.filter(arrayFilter);
                filteredArray.map(function(line) {
                    line[3] = (line[2] * item.a + item.b);
                })
                app.computedSensorData[item.id] = filteredArray;
            })
            this.$nextTick(() => {
                app.isDataComputed = true; 
            })
        }
    }
});




