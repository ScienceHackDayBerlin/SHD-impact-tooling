(function() {
	App = (function() {
   	function App() {
			this.numberOfTeamMembers = 0;
      	this.listen('main');

			// constants

			this.CO2_ON_GERMANY_TODAY_PER_PERSON = 765.5170635;
			this.COAL_FACTOR = 2.14;
			this.WIND_FACTOR = 0.043;
			this.SOLAR_FACTOR = 0.189;
    	}

		App.prototype.listen = function(id) {
			document.getElementById(id).addEventListener( 'click', this.process.bind(this) );
		};

    	App.prototype.process = function() {
			this.checkNumberOfTeamMembers();
			this.calculate();
    	};

		App.prototype.checkNumberOfTeamMembers = function() {
			var number = document.getElementById('number_of_team_members').value;

			if (number != this.numberOfTeamMembers) {
				var template = document.getElementById('amount_of_km_template').innerHTML;
				var row = document.getElementById('amount_of_km');
				var html = '';
				for (var i = 0; i < number; i++) {
					html += '<br/>' + template;
				} 
				row.innerHTML = html;
			}
	
			this.numberOfTeamMembers = number;
		};

		App.prototype.calculate = function() {
			var result_co2 = document.getElementById('co2_gr');
			var number = document.getElementById('number_of_team_members').value;
		};
       
    return App;
    
	})();

	new App();
})()
