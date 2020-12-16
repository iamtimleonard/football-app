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

async function getHistory(team, opponent) {
    let {
        data
    } = await axios.get(`https://api.collegefootballdata.com/teams/matchup?team1=${team}&team2=${opponent}`);
    return data;
}