/**
 * Output whitespace and newlines - useful for debugging
 * @type {boolean}
 */
let PRETTY_PRINTING = true;

document.getElementById("open").addEventListener("click", () => {
    document.getElementById('file-input').click();
});
document.getElementById("save").addEventListener("click", () => {
    saveData();
});

function read(e) {
    const file = e.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
        const data = e.target.result;
        if (typeof data !== "string") {
            console.error("Invalid Data!");
            return;
        }
        const cells = JSON.parse(data);
        cells.forEach(cell => {
            const fieldCell = getCellFromIndex(cell.y, cell.x);
            fieldCell.alive = true;
            fieldCell.updateColor(true);
        });
        console.log(`Changed state of ${cells.length} cells.`);
    };
    reader.readAsText(file);
}

function saveData() {
    const data = field.cellArray
        .flat(1)
        //Only save alive cells
        .filter(cell => cell.alive)
        .map(cell => {
            return {
                x: cell.x,
                y: cell.y
            };
        });
    console.log("Saving: " + data.length);
    saveJSON(data, "data.json", !PRETTY_PRINTING);
}

document.getElementById('file-input').addEventListener('change', read, false);
