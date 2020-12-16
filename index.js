//Controlling user inputs
const inputContent = {
    school: '',
    year: ''
}

const inputs = document.querySelectorAll("input");

inputs.forEach((input) => {
    input.addEventListener("keyup", function (e) {
        const {
            name,
            value
        } = e.target;
        inputContent[name] = value;
    })
    input.value = inputContent[input.name]
})

//Get season data using info from form
async function getSeason(year, team) {
    let {
        data
    } = await axios.get(`https://api.collegefootballdata.com/games?year=${year}&seasonType=regular&team=${team}`)
        .catch(function (err) {
            printError()
        });
    return data;
};

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
        week,
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

//format UTC date
const formatDate = (date) => {
    const formattedDate = new Date(date)
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return formattedDate.toLocaleDateString(undefined, options)
}

const printError = () => {
    document.querySelector(".season-record").textContent = "Please enter a valid school and year";
    return;
};

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
    //score heading
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
        createTextElement("td", `${!home_line_scores[i-1] ? "No data" : home_line_scores[i-1]}`, row);
        createTextElement("td", `${!away_line_scores[i-1] ? "No data" : away_line_score[i-1]}`, row);
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
        const {
            data
        } = await axios.get(`https://api.collegefootballdata.com/teams/matchup?team1=${searchedTeam}&team2=${opponent}`);
        makeMatchupHistory(data);
    });
};

//populate summary of matchup history
const makeMatchupHistory = (data) => {
    removeItems(".summary");
    const {
        team1,
        team2,
        team1Wins,
        team2Wins,
        ties,
        games
    } = data;
    const detailsSection = document.querySelector(".details")
    const matchupHistory = document.createElement("div");
    matchupHistory.classList.add("summary")
    detailsSection.appendChild(matchupHistory);
    createTextElement("h3", `${team1} vs. ${team2} Matchup history`, matchupHistory);
    createTextElement("p", `${team1} has ${team1Wins} wins, ${team2Wins} losses, and ${ties} ties against ${team2}`, matchupHistory);
    createTextElement("p", "Past five games:", matchupHistory);
    //get five previous game scores, if available
    for (let i = games.length > 5 ? games.length - 5 : 0; i < games.length; i++) {
        const {
            awayScore,
            homeScore,
            season,
            winner
        } = games[i];
        createTextElement("p", `${season}: ${homeScore} - ${awayScore}, ${winner} win`, matchupHistory);
    };
}

//Create table of season data
const populateSeason = (season) => {
    const recordHeading = document.querySelector(".season-record");
    if (season.length === 0) {
        printError();
        return;
    };
    let wins = 0;
    let losses = 0;
    for (let game of season) {
        const {
            week,
            away_team,
            home_team,
            away_points,
            home_points,
        } = game;
        const homeGame = home_team.toUpperCase() == inputContent.school.toUpperCase() ? true : false;
        const win = (homeGame && home_points > away_points) || (!homeGame && away_points > home_points) ? true : false;
        if (win) {
            wins++
        } else {
            losses++
        }
        const row = createRow(game, homeGame, win, [week, home_team, away_team, home_points, away_points]);
        document.querySelector(".season").appendChild(row);
    };
    recordHeading.textContent = `${inputContent.school.toUpperCase()} ${inputContent.year} SEASON: ${wins} - ${losses}`;
};

const form = document.querySelector(".form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    removeItems(".item")
    removeItems(".summary")
    document.querySelector(".details").classList.add("hidden")
    if (!inputContent.year || !inputContent.school) {
        printError();
        return;
    };
    getSeason(inputContent.year, inputContent.school).then(populateSeason)
})