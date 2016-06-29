var game = (function() {
	var fields 				= generateEmptyFields(),
		possibleWins 		= generatePossibleWins(),
		whoIsActive 		= 'PC',
		// x or o
		userSign 			= 'x'
		pcSign 				= 'o',
		isChoosedSign 		= false;

	var DOM = {
		table 				: null,
		tableFields 		: null,
		choosePlayerBox 	: null,
		winnerBox 			: null
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
		var isWinner 	= false;
		var length 		= possibleWins.length;

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

	function checkDraw() {
		if(!fields.length)
			return true;
		return false;
	}

	function pcLogicMove(randomFieldId) {
		var fieldId = randomFieldId;
		var canWin = false;

		for(var i = 0, len = possibleWins.length; i < len; i++) {
			var arr 			= possibleWins[i];
			var countPc			= 0;
			var countUser 		= 0;
			var tempFieldId;

			for(var j = 0; j < 3; j++) {
				var value = arr[j];			
				if(value === 'PC') 
					countPc++;
				else if(value === 'USER')
					countUser++;
				else if(checkIsEmpty(value))
					tempFieldId = value;
			}
			
			if(countPc === 2 && countUser === 0) {
				canWin 		= true;
				fieldId 	= tempFieldId;
				break;
			}
			else if(countUser === 2 && countPc === 0 && canWin === false) {
				fieldId 	= tempFieldId;
			}

		}
		return fieldId;
	}

	function makeMove(fieldId, isUser) {
		whoIsActive = isUser ? 'USER' : 'PC';
		if(!checkIsEmpty(fieldId)) 
			return -1;

		// remove from available fields
		fields.splice(fields.indexOf(fieldId), 1);
		changePossibleWins(fieldId, whoIsActive);
		if(checkWin()) {
			endGame();
			return 1;
		}
		if(checkDraw()) {
			endGame(true);
			return 0;
		}
		return 2;
	}

	function startPcMove() {
		// get a ranom number
		// var id 			= Math.floor( Math.random() * fields.length );
		// var fieldId 	= fields[id];
		var id 			= Math.floor( Math.random() * fields.length );
		var fieldId 	= pcLogicMove(fields[id]);
		var query 		= '.table-field[data-field="' + fieldId + '"]';
		var $field 		= DOM.table.find(query);
		var moveResult;

		updateFieldsView($field);
		moveResult 		= makeMove(fieldId, false);	
		
		if(moveResult === 2)
			changeUser('USER');
	}

	function changeUser(name) {
		whoIsActive = name;
	}

	function handleFieldClick(ev) {
		if(!isChoosedSign)
			return;

		var $field 		= $(ev.target);
		var fieldId 	= $field.data('field');
		var moveResult;
		// if field is already taken, break the function
		if(!checkIsEmpty(fieldId))
			return;

		updateFieldsView($field);
		moveResult = makeMove(fieldId, true);
		if(moveResult === 2) {
			changeUser('PC');
			startPcMove();
		}
		
	}

	function handleChooseSign(ev) {
		var btn = ev.target;
		switch(btn.value) {
			case 'x':
				userSign 	= 'x';
				pcSign 		= 'o';
				break;
			case 'o':
				userSign 	= 'o';
				pcSign 		= 'x';
				break;
		}
		
		isChoosedSign 		= true;
		startPcMove();
		DOM.choosePlayerBox.addClass('hide-choose-player-box');

		setTimeout(function() {
			DOM.choosePlayerBox.removeClass('show-choose-player-box');
		}, 600);
		
	}

	function handleRestartGame(ev) {
		DOM.winnerBox.addClass('hide-winner-box');
		setTimeout(function () {
			DOM.winnerBox.removeClass('hide-winner-box show-winner-box');
		}, 1000);

		clearDOMFields();
		changeUser('PC');
		showChooseBox();
	}

	function showChooseBox() {
		DOM.choosePlayerBox.addClass('show-choose-player-box');
		setTimeout(function() {
			DOM.choosePlayerBox.removeClass('hide-choose-player-box');
		}, 600);
	}

	function updateFieldsView($field) {
		var sign 			= whoIsActive === 'USER' ? userSign : pcSign;	
		$field.text(sign);
	}

	function showWinnerBox(isDraw) {
		var winsText 		= isDraw ? 'Nobody wins. Draw!' : whoIsActive + ' wins a game!';

		DOM.winnerBox.find('h1').text(winsText);
		DOM.winnerBox.addClass('show-winner-box');
	}

	function endGame(isDraw){
		// reset game fields
		fields 				= generateEmptyFields();
		possibleWins 		= generatePossibleWins();
		userFields 			= [];
		pcFields 			= [];
		isChoosedSign 		= false;
		
		showWinnerBox(isDraw);
	}

	function clearDOMFields(){
		$.each(DOM.tableFields, function (index, field) {
			$(field).text('');
		});
	}

	function cacheDOM() {
		DOM.table 				= $('.table');
		DOM.tableFields 		= $(DOM.table).find('.table-field');
		DOM.choosePlayerBox 	= $('#choose-player-box');
		DOM.winnerBox 			= $('#winner-box');
	}

	function bindEvents() {
		DOM.tableFields.on('click', handleFieldClick);
		$(DOM.choosePlayerBox).find('button').on('click', handleChooseSign);
		$(DOM.winnerBox).find('button').on('click', handleRestartGame);
	}
	
	function init() {
		cacheDOM();
		bindEvents();
		showChooseBox();
	}

	init();
	
})();

