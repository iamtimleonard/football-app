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
    } = await axios.get(`https://api.collegefootballdata.com/games?year=${year}&seasonType=regular&team=${team}`);
    return data;
};

//Get single game data
async function getWeek(year, week, team) {
    let {
        data
    } = await axios.get(`https://api.collegefootballdata.com/stats/game/advanced?year=${year}&week=${week}&team=${team}`);
    return data;
};

//Function to create a cell for season data
const createCell = (stat, data, home, win) => {
    const season = document.querySelector(".season");
    const cell = document.createElement("td");
    const {
        week,
        away_team,
        home_team
    } = data;
    cell.textContent = stat;
    cell.style.cursor = "pointer";
    cell.classList.add("item");
    cell.classList.add(week);
    cell.classList.add(win ? "win" : "loss");
    cell.addEventListener("click", async function (e) {
        const searchTeam = home ? home_team : away_team;
        const [teamData] = await getWeek(inputContent.year, week, searchTeam);
        console.log(teamData);
        let summaries = document.querySelectorAll(".game-summary");
        for (let summary of summaries) {
            summary.remove();
        };
        gameMatchup(data, teamData, home);
        document.querySelector(".details").classList.remove("hidden");
    });
    season.appendChild(cell);
}

//Populate single game matchup stats
const gameMatchup = (data, details, homeGame) => {
    const summaries = document.querySelectorAll(".summary");
    for (let summary of summaries) {
        summary.remove();
    };
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

    const date = new Date(start_date)
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const {
        opponent
    } = details
    //keep track of searched team if user changes input
    const searchedTeam = homeGame ? home_team : away_team;

    const gameSummary = document.createElement("div");
    gameSummary.classList.add("summary");
    detailsSection.appendChild(gameSummary);

    const summaryHeading = document.createElement("h3");
    summaryHeading.textContent = `${home_team} - ${home_points}, ${away_team} - ${away_points}`;
    gameSummary.appendChild(summaryHeading);

    const dateHeading = document.createElement("h4");
    dateHeading.textContent = date.toLocaleDateString(undefined, options);
    gameSummary.appendChild(dateHeading);

    const scoreSummary = document.createElement("p");
    scoreSummary.textContent = homeGame ? `${home_team} at home` : `${away_team} away`
    gameSummary.appendChild(scoreSummary);

    const resultHeading = document.createElement("p");
    resultHeading.textContent = (homeGame && home_points > away_points) || (!homeGame && away_points > home_points) ? `${searchedTeam} Victory` : `${searchedTeam} Loss`;
    gameSummary.appendChild(resultHeading);
    //table showing scores for each quarter
    const scoreTable = document.createElement("table");
    scoreTable.classList.add("score-table")
    const tableHeading = document.createElement("thead");
    scoreTable.appendChild(tableHeading);
    const quarterHeading = document.createElement("th");
    quarterHeading.textContent = `Quarter`;
    tableHeading.appendChild(quarterHeading);
    const homeHeading = document.createElement("th");
    homeHeading.textContent = `${home_team}`;
    tableHeading.appendChild(homeHeading);
    const awayHeading = document.createElement("th");
    awayHeading.textContent = `${away_team}`;
    tableHeading.appendChild(awayHeading);
    gameSummary.appendChild(scoreTable);
    for (let i = 1; i < 5; i++) {
        const row = document.createElement("tr")
        scoreTable.appendChild(row);
        const quarter = document.createElement("td");
        quarter.textContent = `${i}`;
        row.appendChild(quarter);
        const homeScore = document.createElement("td");
        homeScore.textContent = `${home_line_scores[i-1]}`;
        row.appendChild(homeScore);
        const awayScore = document.createElement('td');
        awayScore.textContent = `${away_line_scores[i-1]}`;
        row.appendChild(awayScore);
    }
    const totalsRow = document.createElement("tr");
    scoreTable.appendChild(totalsRow);
    const totalText = document.createElement("td");
    totalText.textContent = `Total`;
    totalsRow.appendChild(totalText);
    const homeTotal = document.createElement("td");
    homeTotal.textContent = `${home_points}`;
    totalsRow.appendChild(homeTotal);
    const awayTotal = document.createElement("td");
    awayTotal.textContent = `${away_points}`;
    totalsRow.appendChild(awayTotal);
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
    const {
        team1,
        team2,
        team1Wins,
        team2Wins,
        ties,
        games
    } = data;
    const summaries = document.querySelectorAll(".summary");
    for (let summary of summaries) {
        summary.remove();
    };
    const matchupHistory = document.createElement("div");
    matchupHistory.classList.add("summary")
    const detailsSection = document.querySelector(".details")
    detailsSection.appendChild(matchupHistory);
    const matchupHeading = document.createElement("h3");
    matchupHeading.textContent = `${team1} vs. ${team2} Matchup history`
    matchupHistory.appendChild(matchupHeading);
    const record = document.createElement("p");
    record.textContent = `${team1} has ${team1Wins} wins, ${team2Wins} losses, and ${ties} ties against ${team2}`;
    matchupHistory.appendChild(record);
    const fiveYearText = document.createElement("p");
    fiveYearText.textContent = `Past five games:`
    matchupHistory.appendChild(fiveYearText);
    //get five previous game scores, if available
    for (let i = games.length > 5 ? games.length - 5 : 0; i < games.length; i++) {
        const {
            awayScore,
            homeScore,
            season,
            winner
        } = games[i];
        const gameDetail = document.createElement("p");
        gameDetail.textContent = `${season}: ${homeScore} - ${awayScore}, ${winner} win`;
        matchupHistory.appendChild(gameDetail);
    };
}

//Create table of season data
const populateSeason = (season) => {
    console.log(season);
    for (let game of season) {
        const season = document.querySelector(".season")
        const {
            week,
            away_team,
            home_team,
            away_points,
            home_points,
        } = game;
        const homeGame = home_team === inputContent.school ? true : false;
        const win = (homeGame && home_points > away_points) || (!homeGame && away_points > home_points) ? true : false;
        const row = document.createElement("tr");
        season.appendChild(row);
        row.classList.add("item");
        row.setAttribute("id", week);
        createCell(week, game, homeGame, win);
        createCell(home_team, game, homeGame, win);
        createCell(away_team, game, homeGame, win);
        createCell(home_points, game, homeGame, win);
        createCell(away_points, game, homeGame, win);
    };
};


const form = document.querySelector(".form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let items = document.querySelectorAll(".item");
    for (let item of items) {
        item.remove();
    }
    let summaries = document.querySelectorAll(".summary");
    for (let summary of summaries) {
        summary.remove();
    }
    document.querySelector(".details").classList.add("hidden")
    getSeason(inputContent.year, inputContent.school).then(populateSeason)
})