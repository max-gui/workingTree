$(document).ready(function () {

    /* $.get("/tend/F0020001001_1001", function (data, status) {
     alert("数据：" + JSON.stringify(data.x));
     });
     */
    var myChart = echarts.init(document.getElementById('main'));
// 显示标题，图例和空的坐标轴
    myChart.setOption({
        tooltip: {
            trigger: 'axis'
        },
        title: {
            left: 'center',
            text: '时域图',
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel: {
                interval: 0
            }

        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100
        }, {
            start: 0,
            end: 100,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        series: [
            {
                name: '',
                type: 'line',
                data: []
            }
        ]
    });

// 异步加载数据
    $.get('/tend/F0020001001_1001').done(function (data) {
        // 填入数据
        myChart.setOption({
            xAxis: {
                data: data.x
            },
            series: [{
                // 根据名字对应到相应的系列
                //name: 'RMS',
                symbol: 'none',
                data: data.y
            }]
        });
    });

    /**
     *   ↓ 时域图
     * **/
    var timeChart = echarts.init(document.getElementById('timebase'));

// 显示标题，图例和空的坐标轴
    timeChart.setOption({
        tooltip: {
            trigger: 'axis'
        },
        title: {
            left: 'center',
            text: '时域图',
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            /*axisLabel: {
                interval: 0
            }*/

        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 2
        }, {
            start: 0,
            end: 2,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        series: [
            {
                name: '',
                type: 'line',
                data: []
            }
        ]
    });

// 异步加载数据
    $.get('/time_base/F0020001001_1001').done(function (data) {
        // 填入数据
        timeChart.setOption({
            xAxis: {
                data: data.x
            },
            series: [{
                // 根据名字对应到相应的系列
                name: '',
                symbol: 'none',
                data: data.y
            }]
        });
    });



    /**
     *   ↓ 频域图
     * **/

    var spectrumChart = echarts.init(document.getElementById('spectrum'));

// 显示标题，图例和空的坐标轴
    spectrumChart.setOption({
        tooltip: {
            trigger: 'axis'
        },
        title: {
            left: 'center',
            text: '频域图',
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
           /* axisLabel: {
                interval: 0
            }*/

        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 2
        }, {
            start: 0,
            end: 2,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        series: [
            {
                name: '',
                type: 'line',
                data: []
            }
        ]
    });

// 异步加载数据
    $.get('/spectrum_data/F0020001001_1001').done(function (data) {
        // 填入数据
        spectrumChart.setOption({
            xAxis: {
                data: data.x
            },
            series: [{
                // 根据名字对应到相应的系列
                //name: 'RMS',
                symbol: 'none',
                data: data.y
            }]
        });
    });




});