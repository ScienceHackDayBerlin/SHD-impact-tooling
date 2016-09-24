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
			total *= parseFloat( $('input[name=power_source]:checked').attr('factor') );

			// display result
			var unity = 'GR';
			if (total > 1000.0) {
				total /= 1000.0;
				unity = 'KG';
			}
			document.getElementById('co2_gr').innerHTML = total.toFixed(3) + '&nbsp;' + unity;
		};
       
    return App;
    
	})();

	new App().process();
})
