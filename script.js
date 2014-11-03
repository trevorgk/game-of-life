"use strict";

var game = (function(){

	var width = 25, height = 25, tbl, loop;
	
	var seed = function() {	
		var grid = new Array(height), tr, td;
		
		for (var i = 0; i < height; i++) {
			grid[i] = new Array(width);
			tr = tbl.rows[i];
			
			for (var j = 0; j < width; j++) {
				td = tr.cells[j];
				var checkbox = td.firstChild.firstChild;
				
				grid[i][j] = checkbox.checked;
				
			}
		}
		
		loop = setInterval(function() {		
			console.log('iterating...');
			var liveNeighbourCount;
/*
 * Any live cell with fewer than two live neighbours dies, as if caused by under-population.
 * Any live cell with two or three live neighbours lives on to the next generation.
 * Any live cell with more than three live neighbours dies, as if by overcrowding.
 * Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 */
			var previousState = clone(grid);
			
			for (var i = 0; i < height; i++) {
				for (var j = 0; j < width; j++) {
					liveNeighbourCount = countLiveNeighbours(previousState, i, j);
					
					if (previousState[i][j]) {					
						grid[i][j] = liveNeighbourCount >= 2 && liveNeighbourCount < 4;
					}
					else {
						grid[i][j] = liveNeighbourCount == 3;
					}					
					setCheckboxAt(i, j, grid[i][j]);
				}
			}
			
		}, 1000);	
	}

	var pause = function() {
		clearInterval(loop);
	}
	
	var clone = function(grid) {
		var clone = new Array(height);
		for (var i = 0; i < height; i++) {
			clone[i] = grid[i].slice();
		}
		return clone;
	}
	
	var countLiveNeighbours = function(grid, x, y) {
		var count = 0;
		for (var i = x - 1; i <= x + 1; i++) {
			if (i < 0 || i >= height) continue;
			for (var j = y - 1; j <= y + 1; j++) {
				if (j < 0 || j >= width) continue;
				if (i == x && j == y) continue;
				
				count += grid[i][j] ? 1 : 0;				
			}
		}
		return count;
	}
	
	var setCheckboxAt = function(x, y, value) {
		var row = tbl.rows[x];
		var cell = row.cells[y];
		var checkbox = cell.firstChild.firstChild;
		checkbox.checked = value;
	}
	
	return {
		init: function() {
			console.log('init');
			var container = document.getElementById('container'), 
				submitBtn = document.createElement('input'), stopBtn = document.createElement('button'),
				tr, td, checkbox, label, checkboxId, span;
			
			tbl = document.createElement('table');
			
			for (var i = 0; i < height; i++) {
				tr = document.createElement('tr');
				
				for (var j = 0; j < width; j++) {
					td = document.createElement('td');
					
					checkboxId = "checkbox_" + i + "_" + j;
					
					checkbox = document.createElement('input');
					checkbox.id = checkboxId;
					checkbox.setAttribute('type', 'checkbox');
					
					label = document.createElement('label');
					label.setAttribute('for', checkboxId);					
					
					span = document.createElement('span');
					span.setAttribute('class', 'box');
					
					label.appendChild(checkbox);
					label.appendChild(span);					
					
					td.appendChild(label);
					tr.appendChild(td);
				}
				
				tbl.appendChild(tr);
			}
			container.appendChild(tbl);
			
			submitBtn.setAttribute('type', 'submit');
			submitBtn.setAttribute('value', 'Mindfuck!');
			submitBtn.onclick = seed;
			container.appendChild(submitBtn);
				
			stopBtn.innerText = 'Halt';
			stopBtn.onclick = pause;
			container.appendChild(stopBtn);
			
			
		}
	}
	
}())

game.init();
