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
        //see handleText.js
        createTextElement("p", `${season}: ${homeScore} - ${awayScore}, ${winner} win`, matchupHistory);
    };
}