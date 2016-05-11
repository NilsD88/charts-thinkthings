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
    text : 'PIR Movement counter'
  },
  tooltip: {
      enabled: true
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
    gridLineWidth: 1,
    labels: {
        style: {
            color: 'grey'
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

var socket = new SockJS('/thinkthings/random');
var client = Stomp.over(socket);

client.connect('user', 'password', function(frame) {

  client.subscribe("/data", function(message) {
    var point = [ (new Date()).getTime(), parseInt(message.body) ];
    randomData.addPoint(point, true);
  });

});