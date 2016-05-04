var randomData;

$('#randomDataChart').highcharts({
  chart : {
	height: 800,
    type : 'line',
    events : {
      load : function() {
        randomData = this.series[0];
      }
    }
  },
  title : {
    text : 'ThinkThings 2015 movement counter'
  },
  tooltip: {
      enabled: false
  },
  colors: ['#542791', '#542791', '#542791'],
  xAxis : {
    type : 'datetime',
    minRange : 60 * 60 * 1000
  },
  yAxis : {
	allowDecimals: false,
    title : {
      text : false
    },
    min : 0,
    max: 5000,
    gridLineWidth: 0,
    labels: {
        style: {
            color: 'white'
        }
    }
  },
  legend : {
    enabled : false
  },
  plotOptions : {
    series : {
      threshold : 0,
      marker : {
        enabled : false
      }
    }
  },
  series : [ {
	  lineWidth : 5,
    name : 'Data',
      data : [ ]
    } ]
});

var socket = new SockJS('/walibi/trackers');
var client = Stomp.over(socket);

client.connect('proximus', 'walibi', function(frame) {

  client.subscribe("/data", function(message) {
    var point = [ (new Date()).getTime(), parseInt(message.body) ];
    randomData.addPoint(point, true);
  });

});