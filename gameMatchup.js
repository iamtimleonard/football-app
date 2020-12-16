//Populate single game matchup stats
const gameMatchup = (data, homeGame) => {
    removeItems(".summary")
    const detailsSection = document.querySelector(".details")
    const {
        start_date,
        away_team,
        home_team,
        home_points,
        away_points,
        home_line_scores,
        away_line_scores
    } = data;

    //keep track of searched team if user changes input
    const searchedTeam = homeGame ? home_team : away_team;
    const opponent = homeGame ? away_team : home_team;

    const gameSummary = document.createElement("div");
    gameSummary.classList.add("summary");
    detailsSection.appendChild(gameSummary);
    //score heading see handleText.js
    createTextElement("h3", `${home_team} - ${home_points}, ${away_team} - ${away_points}`, gameSummary);
    //date heading
    createTextElement("h4", formatDate(start_date), gameSummary);
    //home team heading
    createTextElement("p", `${home_team} at home`, gameSummary);
    //win/loss heading
    let resultsContent = (homeGame && home_points > away_points) || (!homeGame && away_points > home_points) ? `${searchedTeam} Victory` : `${searchedTeam} Loss`;
    createTextElement("p", resultsContent, gameSummary);

    //makes score table for four quarters
    const scoreTable = document.createElement("table");
    scoreTable.classList.add("score-table")
    const tableHeading = document.createElement("thead");
    scoreTable.appendChild(tableHeading);
    createTextElement("th", `Quarter`, tableHeading);
    createTextElement("th", `${home_team}`, tableHeading);
    createTextElement("th", `${away_team}`, tableHeading);
    gameSummary.appendChild(scoreTable);
    for (let i = 1; i < 5; i++) {
        const row = document.createElement("tr")
        scoreTable.appendChild(row);
        createTextElement("td", `${i}`, row);
        createTextElement("td", `${home_line_scores[i-1] == undefined ? "No data" : home_line_scores[i-1]}`, row);
        createTextElement("td", `${away_line_scores[i-1] == undefined ? "No data" : away_line_scores[i-1]}`, row);
    }
    const totalsRow = document.createElement("tr");
    scoreTable.appendChild(totalsRow);
    createTextElement("td", "Total", totalsRow);
    createTextElement("td", `${home_points}`, totalsRow);
    createTextElement("td", `${away_points}`, totalsRow);
    //option to search matchup history
    const searchMatchup = document.createElement("button");
    searchMatchup.textContent = "See matchup history";
    searchMatchup.classList.add("matchup");
    gameSummary.appendChild(searchMatchup);
    searchMatchup.addEventListener("click", async function () {
        //see fetch.js
        await getHistory(searchedTeam, opponent).then(makeMatchupHistory);
    });
};