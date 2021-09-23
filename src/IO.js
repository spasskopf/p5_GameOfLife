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

/**Loads cell-states from a JSON File
 * @param {Blob} file
 */
function loadFromJSON(file) {
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

/**Loads cell-states from a JSON File
 * @param {File} file
 */
function loadFromImage(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const binaryData = e.target.result;
        if (typeof binaryData !== "string") {
            console.error("Invalid Data!");
            return;
        }
        const base64 = btoa(binaryData);
        const path = `data:image/png;base64,${base64}`;
        loadImage(path, (image) => {
                //Convert to black and white picture
                image.filter(THRESHOLD);
                image.loadPixels();
                const pixels = image.pixels;
                for (let y = 0; y < image.height; y++) {
                    for (let x = 0; x < image.width; x++) {
                        //Because images are RGBA and every channel is stored in a separate value
                        const startLoc = 4 * (y * image.width + x);
                        const r = pixels[startLoc],
                            g = pixels[startLoc + 1],
                            b = pixels[startLoc + 2];/*,
                            a = pixels[startLoc + 3];*/
                        const state = r === 0 && g === 0 && b === 0;
                        const fieldCell = getCellFromIndex(y, x);
                        if (!fieldCell) {
                            break;
                        }
                        fieldCell.alive = state;
                        fieldCell.updateColor(state);
                    }
                }
            }, err => {
                error("Could not load image!", err);
            }
        );


    };
    reader.readAsBinaryString(file);
}

function error(msg, error) {
    //TODO: @Quantompixel: Create UI for this :)
    console.error(error);
    window.alert(msg + "\n" + JSON.stringify(error));
}

function read(e) {
    const file = e.target.files[0];
    if (!file) {
        return;
    }
    try {
        if (file.name.endsWith(".json")) {
            loadFromJSON(file);
        } else {
            loadFromImage(file);
        }
    } catch (e) {
        error("Could not load the File!", e);
    }
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
