document.addEventListener("DOMContentLoaded", () => {
    const bingoBoard = document.getElementById("bingoBoard");

    const optionsTableBody = document.querySelector("#optionsTable tbody");
    const filterInput = document.getElementById("filterInput");
    let sortedBy = null,
        sortOrder = "asc";

    // Initialize Bingo Board
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement("div");
        cell.className = "bingo-cell";
        cell.addEventListener("click", function () {
            this.textContent = "";
        });
        bingoBoard.appendChild(cell);
    }

    // Display Options in the table with click event to add to Bingo board
    const displayOptions = (filter = "") => {
        const filteredOptions = bingoOptionsData.filter((option) =>
            Object.values(option).some((value) => value.toString().toLowerCase().includes(filter.toLowerCase()))
        );

        optionsTableBody.innerHTML = ""; // Clear existing options
        filteredOptions.forEach((option) => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${option.title}</td>
        <td>${option.credits}</td>
        <td>${option.lastDate}</td>
        <td>${option.lastEvent}</td>
      `;
            row.addEventListener("click", () => addToBingoBoard(option.title));
            optionsTableBody.appendChild(row);
        });
    };

    const addToBingoBoard = (title) => {
        // Check if the title is already on the board
        const isAlreadyChosen = Array.from(document.querySelectorAll(".bingo-cell")).some(
            (cell) => cell.textContent === title
        );
        if (isAlreadyChosen) {
            alert("This option has already been chosen.");
            return; // Do not add duplicate to the board
        }

        // Find the first empty cell and add the title if not already chosen
        const emptyCell = Array.from(document.querySelectorAll(".bingo-cell")).find((cell) => cell.textContent === "");
        if (emptyCell) {
            emptyCell.textContent = title;
        }
    };
    // Sort Options function
    // Sort Options function with visual indicators
    const sortOptions = (column) => {
        const headers = document.querySelectorAll("#optionsTable th");
        if (sortedBy === column) {
            sortOrder = sortOrder === "asc" ? "desc" : "asc";
        } else {
            sortedBy = column;
            sortOrder = "asc";
        }

        // Remove existing sort classes
        headers.forEach((header) => {
            header.classList.remove("sort-asc", "sort-desc");
        });

        // Add the sort class to the current column
        const currentColumnIndex = ["title", "credits", "lastDate", "lastEvent"].indexOf(column);
        const currentHeader = headers[currentColumnIndex];
        currentHeader.classList.add(sortOrder === "asc" ? "sort-asc" : "sort-desc");

        // Sort the data
        bingoOptionsData.sort((a, b) => {
            if (a[column] < b[column]) return sortOrder === "asc" ? -1 : 1;
            if (a[column] > b[column]) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        displayOptions(filterInput.value);
    };

    // Attach click event listeners to table headers for sorting
    document.querySelectorAll("#optionsTable th").forEach((header, index) => {
        header.addEventListener("click", () => {
            const column = ["title", "credits", "lastDate", "lastEvent"][index];
            sortOptions(column);
        });
    });

    // Filter input event listener
    filterInput.addEventListener("input", () => {
        displayOptions(filterInput.value);
    });

    // Initial display of options
    displayOptions();
});

function downloadBingoBoard() {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 545;
    canvas.height = 664;

    // Load your background image
    var background = new Image();
    background.src = "bg.png"; // Ensure the path is correct

    // Draw the background first
    background.onload = function () {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Set styles for the text
        ctx.fillStyle = "black"; // or any color you want to use for text
        ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto, arial, Meiryo, sans-serif"; // or any font style you like
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var lineHeight = ctx.measureText("M").width * 1.2;

        // Calculate the position for the text
        var gap = 94;
        var x, y;

        // Get the board options - this would be your own function or data structure
        var boardOptions = getBoardOptions(); // Should return an array of 25 strings (5x5)

        // Loop through the board options and fill them in the canvas
        for (var i = 0; i < 5; i++) {
            // rows
            for (var j = 0; j < 5; j++) {
                // columns
                x = 40 + j * gap + gap / 2; // calculate the x position
                y_center = 161 + i * gap + gap / 2; // calculate the y position
                let text = boardOptions[i * 5 + j];
                var maxLineWidth = gap - 6; // Adjust the value as needed

                // Split the text into individual characters
                var characters = Array.from(text);
                var lines = [];
                var currentLine = '';
                var tempLine = '';
                var lastBreakableIndex = -1;

                for (var k = 0; k < characters.length; k++) {
                    var char = characters[k];
                    tempLine += char;

                    // Check if the current character is a kanji, kana, space, or punctuation
                    var isBreakable = /[\u4e00-\u9faf\u3040-\u30ff\s\p{P}]/u.test(char);

                    if (isBreakable) {
                        lastBreakableIndex = k;
                    }

                    var lineWidth = ctx.measureText(tempLine).width;

                    if (lineWidth > maxLineWidth && lastBreakableIndex != -1) {
                        lines.push(currentLine);
                        tempLine = tempLine.slice(lastBreakableIndex + 1);
                        currentLine = characters.slice(lastBreakableIndex + 1, k + 1).join('');
                        lastBreakableIndex = -1;
                    } else {
                        currentLine += char;
                    }
                }

                lines.push(currentLine);

                // Draw the text on the canvas
                for (var l = 0; l < lines.length; l++) {
                    var line = lines[l];
                    var y;
                    if (lines.length > 1) {
                        y = y_center - (lines.length - 1) / 2 * lineHeight + l * lineHeight;
                    } else {
                        y = y_center;
                    }
                    ctx.fillText(line, x, y);
                }

            }
        }

        // add name to 462, 36
        var name = document.getElementById("producer").value;
        ctx.font = "bold 18px Meiryo";
        ctx.fillText(name, 462, 36);

        // Create a temporary link to download the image
        var dataURL = canvas.toDataURL("image/png");
        var link = document.createElement("a");
        link.href = dataURL;
        link.download = "bingo-board.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
}

// This is a mock function, replace it with your actual method to get board options
function getBoardOptions() {
    const options = [];
    // Select all bingo cells by class
    const cells = document.querySelectorAll(".bingo-cell");

    // Loop through each cell and get its text content
    cells.forEach((cell) => {
        options.push(cell.textContent.trim());
    });

    return options;
}

// Add a button or call this function when you need to download the image
// downloadBingoBoard();

// Add event listener to the download button
document.getElementById("downloadBingo").addEventListener("click", downloadBingoBoard);
