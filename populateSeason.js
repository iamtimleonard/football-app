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
        //see handleText.js
        const row = createRow(game, homeGame, win, [week, home_team, away_team, home_points, away_points]);
        document.querySelector(".season").appendChild(row);
    };
    recordHeading.textContent = `${inputContent.school.toUpperCase()} ${inputContent.year} SEASON: ${wins} - ${losses}`;
};