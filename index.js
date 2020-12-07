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
const createCell = (stat, data, home) => {
    const season = document.querySelector(".season");
    const cell = document.createElement("td");
    const {
        week,
        away_team,
        home_team
    } = data;
    cell.textContent = stat;
    cell.setAttribute("stat", stat);
    cell.classList.add("item");
    cell.classList.add(week);
    cell.addEventListener("click", async function (e) {
        const searchTeam = home ? home_team : away_team;
        const [teamData] = await getWeek(inputContent.year, week, searchTeam);
        console.log(teamData);
        let summaries = document.querySelectorAll(".game-summary");
        for (let summary of summaries) {
            summary.remove();
        };
        gameMatchup(data, teamData, home);
    });
    season.appendChild(cell);
}

//Populate matchup stats
const gameMatchup = (data, details, homeGame) => {
    const detailsSection = document.querySelector(".details")
    const {
        week,
        away_team,
        home_team,
        home_points,
        away_points,
        home_line_scores,
        away_line_scores
    } = data;

    const {
        defense,
        offense
    } = details
    const gameSummary = document.createElement("div");
    gameSummary.classList.add("game-summary");
    detailsSection.appendChild(gameSummary);
    const summaryHeading = document.createElement("h3");
    summaryHeading.textContent = homeGame ? `${home_team} vs. ${away_team}` : `${away_team} at ${home_team}`;
    gameSummary.appendChild(summaryHeading);
    const scoreSummary = document.createElement("p");
    scoreSummary.textContent = homeGame ? `${home_points} - ${away_points}` : `${away_points} - ${home_points}`
    gameSummary.appendChild(scoreSummary);
    const resultHeading = document.createElement("p");
    resultHeading.textContent = (homeGame && home_points > away_points) || (!homeGame && away_points > home_points) ? `Result: Victory` : `Result: Loss`;
    gameSummary.appendChild(resultHeading);

}

//Create table of season data
const populateSeason = (season) => {
    for (let game of season) {
        const season = document.querySelector(".season")
        const {
            week,
            away_team,
            home_team,
            away_points,
            home_points,
        } = game;
        let homeGame = home_team === inputContent.school ? true : false;
        const row = document.createElement("tr");
        season.appendChild(row);
        row.classList.add("item");
        row.setAttribute("id", week);
        createCell(week, game, homeGame);
        createCell(home_team, game, homeGame);
        createCell(away_team, game, homeGame);
        createCell(home_points, game, homeGame);
        createCell(away_points, game, homeGame);
    };
};

const form = document.querySelector(".form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let items = document.querySelectorAll(".item");
    for (let item of items) {
        item.remove();
    }
    getSeason(inputContent.year, inputContent.school).then(populateSeason)
})