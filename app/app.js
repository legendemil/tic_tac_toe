var game = (function() {
	var fields = generateEmptyFields(),
		userFields = [],
		pcFields = [],
		possibleWins = generatePossibleWins(),
		whoIsActive = 'USER',
		// x or o
		userSign = 'x'
		pcSign = 'o';

	var DOM = {
		table: null,
		tableFields: null,
	}

	function generateEmptyFields(howMany) {
		var arr = [];
		howMany = howMany || 9;
		for(var i = 1; i <= howMany; i++)
			arr.push(i);
		return arr;
	}
	
	// return an array of possible wins
	function generatePossibleWins() {
		return  [
			// left right
			[1,2,3], [4,5,6], [7,8,9],
			// top bottom
			[1,4,7], [2,5,8], [3,6,9],
			//cross
			[1,5,9], [3,5,7]
		];
	}
	
	function checkIsEmpty(fieldId){
		return fields.indexOf(fieldId) > -1 ? true : false;
	}

	function changePossibleWins(fieldId, activeUser){
		activeUser = activeUser || whoIsActive;
		possibleWins = possibleWins.map(function(arr){
			return arr.map(function(value) {
				return value === fieldId ? activeUser : value;
			});
		});
	}

	function checkWin() {
		var isWinner = false;
		var length = possibleWins.length;

		for(var i = 0; i < length; i++) {
			// if count will be 3 then somebody wins
			var count = 0;
			for(var j = 0; j < 3; j++) 
				if(possibleWins[i][j] === whoIsActive)
					count++;
			if(count === 3) {
				isWinner = true;
 				break;
			}
		}
		return isWinner;
	}

	function makeMove(fieldId, isUser) {
		whoIsActive = isUser ? 'USER' : 'PC';
		console.log('Now is turn: ', whoIsActive)
		if(!checkIsEmpty(fieldId)) 
			return;
		
		// add to user or pc fields
		if(isUser) 
			userFields.push(fieldId);
		else
			pcFields.push(fieldId);
		// remove from available fields
		fields.splice(fields.indexOf(fieldId), 1);
		changePossibleWins(fieldId, whoIsActive);
		console.log(checkWin());
		if(checkWin())
			alert(whoIsActive + ' wins');
	}

	function startPcMove() {
		// get a ranom number
		var id = Math.floor( Math.random() * fields.length );
		var fieldId = fields[id];
		var query = '.table-field[data-field="' + fieldId + '"]';
		var $field = DOM.table.find(query);
		makeMove(fieldId, false);
		updateFieldsView($field);
		changeUser('USER');
	}

	function changeUser(name) {
		whoIsActive = name;
	}

	function handleFieldClick(ev) {
		var $field = $(ev.target);
		var fieldId = $field.data('field');
		// if field is already taken, break the function
		if(!checkIsEmpty(fieldId))
			return;

		makeMove(fieldId, true);
		updateFieldsView($field);
		changeUser('PC');
		startPcMove();
	}

	function updateFieldsView($field) {
		var sign = whoIsActive === 'USER' ? userSign : pcSign;	
		$field.text(sign);
	}

	function cacheDOM() {
		DOM.table = $('.table');
		DOM.tableFields = $(DOM.table).find('.table-field');
	}

	function bindEvents() {
		DOM.tableFields.on('click', handleFieldClick);
	}
	
	function init() {
		cacheDOM();
		bindEvents();
	}

	init();
	
})();

