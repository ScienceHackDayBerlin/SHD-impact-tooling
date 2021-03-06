$(function() {
	App = (function() {
   	function App() {
			this.numberOfTeamMembers = 0;
      	this.listen('main');

			// constants for calculate co2

			this.CO2_ON_GERMANY_TODAY_PER_PERSON = 765.5170635;
			this.COAL_FACTOR = 2.14;
			this.WIND_FACTOR = 0.043;
			this.SOLAR_FACTOR = 0.189;
    	}

		App.prototype.listen = function(id) {
			//document.getElementById(id).addEventListener( 'click', this.process.bind(this) );
			$( '#'+id ).change( this.process.bind(this) );
		};

		// auto refresh
    	App.prototype.process = function() {
			this.checkNumberOfTeamMembers();
			this.calculate();
    	};

		// display transport forms
		App.prototype.checkNumberOfTeamMembers = function() {
			var number = $('#number_of_team_members').val();

			if (number != this.numberOfTeamMembers) {
				var template = $('#amount_of_km_template').html();
				var row = $('#amount_of_km');
				var html = '';
				for (var i = 0; i < number; i++) {
					html += '<br/>' + template;
				} 
				row.html( html );
			}
	
			this.numberOfTeamMembers = number;
		};

		App.prototype.calculate = function() {
			var total = 0;

			// calculate base co2 per person on team
			var base = this.CO2_ON_GERMANY_TODAY_PER_PERSON * $('#number_of_team_members').val();
		
			// calculate transport co2 per person on team
		
			var transport = 0;
			$('.transportation_form:visible').each( function() {
				// get the km
				var km = $(this).find('.number_km').val();
				// get the method
				var factor = $(this).find('input[name=transportation]:checked').attr('factor') || 0;
				transport += (factor * km);
			})
			total = base + transport;

			// calcculate hardware
			var hardware = 0;
			$('#hardware_form ul').each( function() {
				if ( $(this).find(':checkbox:checked').length > 0 )
					hardware += $(this).find(':input[type="number"]').attr('factor') * 
						$(this).find(':input[type="number"]').val()
			});
			total += hardware;

			// calculate reduction factor on energy source
			var reduction_factor = parseFloat( $('input[name=power_source]:checked').attr('factor') );
			var reduced = total * reduction_factor;

			// display result
			var unity = 'GR';
			if (reduced > 1000.0) {
				reduced /= 1000.0;
				unity = 'KG';
			}
			document.getElementById('co2_gr').innerHTML = reduced.toFixed(2) + '&nbsp;' + unity;

			this.displayChart(total, base * reduction_factor, transport * reduction_factor, hardware * reduction_factor);
		};

		App.prototype.displayChart = function(total, over, transport, tools) {
			var data = {
				labels: ['OVERHEAD', 'TRANSPORTATION', 'HARDWARE AND TOOLS'],
			  	series: [ over, transport, tools ]
			};

			var in_min = 9 * 1000.0;
			var out_min = 25;
			var in_max = 80 * 1000.0;
			var out_max = 200;
			var hole = (total - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;

			var chart = new Chartist.Pie('.ct-chart', data, {
				chartPadding: 40,
				labelOffset: 80,
				labelDirection: 'explode',
				donut: true,
				donutWidth: Math.max( Math.min(hole, out_max), out_min),
		//  		startAngle: 90,
				//total: 180
				labelInterpolationFnc: function(value, index) {
					if (data.series[index] > 0.0)
						return value + ' ' + data.series[index].toFixed(2);
					else
						return '';
  				}
			});
		/*	
			chart.on('draw', function(data) {
				data.group.append('txt');
			});
*/

		};
       
    return App;
    
	})();

	new App().process();



})
