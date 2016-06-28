var game = (function() {
	var fields = [1, 2, 3, 4, 5, 6, 7, 8, 9],
		userFields = [],
		pcFields = [],
		possibleWins = [
			// left right
			[1,2,3], [4,5,6], [7,8,9],
			// top bottom
			[1,4,7], [2,5,8], [3,6,9],
			//cross
			[1,5,9], [3,5,7]
		],
		whoIsActive = 'PC',
		// x or o
		userSign = 'x'
		pcSign = 'o';

	var DOM = {
		table: null,
		tableFields: null,
	}

	function getUserFields(){
		return userFields;
	}

	function getPcFields(){
		return pcFields;
	}

	function getPossibleWins() {
		return possibleWins;
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

	function checkWin(isUser) {
		var isWinner = false;
		var length = possibleWins.length;
		whoIsActive = isUser ? 'USER' : 'PC';

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
		if(!checkIsEmpty(fieldId)) 
			return false;
		
		// add to user or pc fields
		if(isUser) 
			userFields.push(fieldId);
		else
			pcFields.push(fieldId);
		// remove from available fields
		fields.splice(fields.indexOf(fieldId), 1);
		changePossibleWins(fieldId, whoIsActive);
	}

	function startPcMove() {
		
	}

	function changeUser(name) {
		whoIsActive = name;
	}

	function handleFieldClick(ev) {
		var $field = $(ev.target);
		var fieldId = $field.data('field');
		var sign = whoIsActive === 'USER' ? userSign : pcSign;	
		makeMove(fieldId, true);
		$field.text(sign);
		changeUser('PC');
		startPcMove();
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
	
	return {
		checkIsEmpty: checkIsEmpty,
		checkWin: checkWin,
		getUserFields: getUserFields,
		getPcFields: getPcFields,
		getPossibleWins: getPossibleWins,
		makeMove: makeMove,
		changePossibleWins: changePossibleWins
	}

})();

try {
	module.exports = game;
} catch(e) {
	console.log('You dont have a module system bundler');
}