var should = require('should');
var game = require('../app/app.js');


describe('A Tic-tac-toe game test.', function() {

	describe('Check fields', function () {
		
		it('Should return true when value is in fields<array>.', function() {
			game.checkIsEmpty(3).should.equal(true);
		});

		it('Should return false when value is not in fields<array>.', function() {
			game.checkIsEmpty(10).should.equal(false);
		});

	});

	describe('Make a move.', function() {

		describe('User and PC move.', function() {

			it('Should add fields[1,2,3]<number> to a userFields<array>.', function(){
				game.makeMove(1, true);
				game.makeMove(2, true);
				game.makeMove(3, true);
				game.getUserFields().should.have.length(3);
			});

			it('Should add fields[7,8,4]<number> to a pcFields<array>.', function(){
				game.makeMove(7);
				game.makeMove(8);
				game.makeMove(8);
				game.makeMove(2);
				game.makeMove(4);
				game.makeMove(4);
				game.getPcFields().should.have.length(3);
			});

			it('Should return a random field for a computre move from available fields', function () {
				game.startPcMove();
			});

			// it('should change every 2<number> to "USER" in every array in possibleWins<array> .', function () {
			// 	game.changePossibleWins(2, 'USER');
			// 	game.getPossibleWins()[0][1].should.equal('USER');
			// 	game.getPossibleWins()[4][0].should.equal('USER');
			// });

			// it('should change every 3<number> to "PC" in every array in possibleWins<array> .', function () {
			// 	game.changePossibleWins(3, 'PC');
			// 	game.getPossibleWins()[0][2].should.equal('PC');
			// 	game.getPossibleWins()[5][0].should.equal('PC');
			// 	game.getPossibleWins()[7][0].should.equal('PC');
			// });

		});

		describe('Check for win', function() {

			it('Should return true if somebody win.', function(){
				game.checkWin(true).should.equal(true);
			});

		});

	});

});