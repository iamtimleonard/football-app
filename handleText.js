//clears previous search results
const removeItems = (targets) => {
    const items = document.querySelectorAll(targets);
    for (let item of items) {
        item.remove();
    };
}

//create a cell for season data
const createCell = (stat, data, home) => {
    const cell = document.createElement("td");
    const {
        away_team,
        home_team
    } = data;
    cell.textContent = stat;
    cell.addEventListener("click", async function (e) {
        const searchTeam = home ? home_team : away_team;
        let summaries = document.querySelectorAll(".game-summary");
        for (let summary of summaries) {
            summary.remove();
        };
        gameMatchup(data, home);
        document.querySelector(".details").classList.remove("hidden");
    });
    return cell;
}

//create rows for season data
const createRow = (data, home, win, cells) => {
    const row = document.createElement("tr");
    for (const cell of cells) {
        const newCell = createCell(cell, data, home);
        row.appendChild(newCell)
    }
    row.style.cursor = "pointer";
    row.classList.add("item")
    row.classList.add(win ? "win" : "loss");
    return row;
}

//create generic text element
const createTextElement = (type, content, parent) => {
    const element = document.createElement(type);
    element.textContent = content;
    parent.appendChild(element);
}

const printError = () => {
    document.querySelector(".season-record").textContent = "No data available: Please enter a valid school and year";
    return;
};