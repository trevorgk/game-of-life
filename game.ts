var game = (() => {
    "use strict";

    var width = 25;
    var height = 25;
    var tbl;
    var loop: number;

    var setCheckboxAt = (x, y, value) => {
        var row = tbl.rows[x];
        var cell = row.cells[y];
        var checkbox = cell.firstChild.firstChild;
        checkbox.checked = value;
    };

    var clone = grid => {
        var clonedArray = new Array(height);
        for (var i = 0; i < height; i++) {
            clonedArray[i] = grid[i].slice();
        }
        return clonedArray;
    };

    var countLiveNeighbours = (grid, x, y) => {
        var count = 0;
        for (var i = x - 1; i <= x + 1; i++) {
            if (i < 0 || i >= height) continue;
            for (var j = y - 1; j <= y + 1; j++) {
                if (j < 0 || j >= width) continue;
                if (i === x && j === y) continue;

                count += grid[i][j] ? 1 : 0;
            }
        }
        return count;
    };

    var seed = () => {
        var grid = new Array(height);
        var tr;
        var td;

        for (var i = 0; i < height; i++) {
            grid[i] = new Array(width);
            tr = tbl.rows[i];

            for (var j = 0; j < width; j++) {
                td = tr.cells[j];
                var checkbox = td.firstChild.firstChild;

                grid[i][j] = checkbox.checked;

            }
        }

        loop = setInterval(() => {
            console.log("iterating...");
            var liveNeighbourCount: number;
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
                        grid[i][j] = liveNeighbourCount === 3;
                    }
                    setCheckboxAt(i, j, grid[i][j]);
                }
            }

        }, 1000);
    };
    var pause = () => {
        clearInterval(loop);
    };
    return {
        init: () => {
            console.log("init");
            var container = document.getElementById("container");
            var submitBtn = document.createElement("input");
            var stopBtn = document.createElement("button");
            var tr: HTMLTableRowElement;
            var td: HTMLTableDataCellElement;
            var checkbox: HTMLInputElement;
            var label: HTMLLabelElement;
            var checkboxId: string;
            var span: HTMLSpanElement;

            tbl = document.createElement("table");

            for (var i = 0; i < height; i++) {
                tr = document.createElement("tr");

                for (var j = 0; j < width; j++) {
                    td = document.createElement("td");

                    checkboxId = `checkbox_${i}_${j}`;

                    checkbox = document.createElement("input");
                    checkbox.id = checkboxId;
                    checkbox.setAttribute("type", "checkbox");

                    label = document.createElement("label");
                    label.setAttribute("for", checkboxId);

                    span = document.createElement("span");
                    span.setAttribute("class", "box");

                    label.appendChild(checkbox);
                    label.appendChild(span);

                    td.appendChild(label);
                    tr.appendChild(td);
                }

                tbl.appendChild(tr);
            }
            container.appendChild(tbl);

            submitBtn.setAttribute("type", "submit");
            submitBtn.setAttribute("value", "Mindfuck!");
            submitBtn.onclick = seed;
            container.appendChild(submitBtn);

            stopBtn.innerText = "Halt";
            stopBtn.onclick = pause;
            container.appendChild(stopBtn);
        }
    };
})();

game.init();
