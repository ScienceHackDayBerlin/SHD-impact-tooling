(function() {
	App = (function() {
   	function App() {
			this.numberOfTeamMembers = 0;
      	this.listen('main');
    	}

		App.prototype.listen = function(id) {
			document.getElementById(id).addEventListener( 'click', this.process.bind(this) );
		};

    	App.prototype.process = function() {
			this.checkNumberOfTeamMembers();
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
       
    return App;
    
	})();

	new App();
})()
