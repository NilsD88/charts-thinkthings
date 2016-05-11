var randomData;
var value;

var chartOptions = {
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
};

var $chart = $('#randomDataChart').highcharts(chartOptions);

var socket = new SockJS('/thinkthings/random');
var client = Stomp.over(socket);

var $resetButton = $('#resetBtn');
var resetValue;

$resetButton.on('click', function(){
	resetValue = value;
	$chart.highcharts().destroy();
	redrawChart();
});

function redrawChart(){
	var $chart1 = null;
	var chartOptions1 = {
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
			};
	randomData = chartOptions1.series[0];
	$chart1 = $('#randomDataChart').highcharts(chartOptions1);
} 

var point;

client.connect('user', 'password', function(frame) {

  client.subscribe("/data", function(message) {
	  value = parseInt(message.body);
	  
	  if(typeof resetValue !== "undefined"){
		  point = [ (new Date()).getTime(), value - resetValue];
	  }else{
		  point = [ (new Date()).getTime(), value ];
	  }
    
    randomData.addPoint(point, true);
  });

});