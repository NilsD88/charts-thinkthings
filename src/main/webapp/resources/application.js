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
    text : 'Door counter at mens room'
  },
  colors: ['#E98300', '#E98300', '#E98300'],
  xAxis : {
    type : 'datetime',
    minRange : 30 * 60 * 1000
  },
  yAxis : {
	allowDecimals: false,
    title : {
      text : false
    },
    min : 60
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
	  lineWidth : 10,
    name : 'Data',
      data : [ ]
    } ]
});

var socket = new SockJS('/spring-mvc-websockets/random');
var client = Stomp.over(socket);

client.connect('user', 'password', function(frame) {

  client.subscribe("/data", function(message) {
    var point = [ (new Date()).getTime(), parseInt(message.body) ];
    randomData.addPoint(point, true);
  });

});