import "dotenv/config";
import { createServer } from "http";

const CFD_AUTH_KEY = process.env.CFD_AUTH_KEY;

const server = createServer(async (req, res) => {
  try {
    let parsed;
    const reqUrl = new URL(req.url, `http://${req.headers.host}`);
    console.log("request received", { host: req.headers.host, url: req.url });
    if (reqUrl.pathname === "/") {
      const year = reqUrl.searchParams.get("year");
      const team = reqUrl.searchParams.get("team");

      const data = await fetch(
        `https://api.collegefootballdata.com/games?year=${year}&seasonType=regular&team=${team}`,
        {
          headers: {
            Authorization: `Bearer ${CFD_AUTH_KEY}`,
          },
        }
      );

      parsed = await data.json();
    } else if (reqUrl.pathname === "/matchup") {
      const team1 = reqUrl.searchParams.get("searchedTeam");
      const team2 = reqUrl.searchParams.get("opponent");

      const data = await fetch(
        `https://api.collegefootballdata.com/teams/matchup?team1=${team1}&team2=${team2}`,
        {
          headers: {
            Authorization: `Bearer ${CFD_AUTH_KEY}`,
          },
        }
      );

      parsed = await data.json();
    }

    res.writeHead(200, {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
    });

    console.log("sending response");

    res.end(JSON.stringify(parsed));
  } catch (error) {
    console.error("error fetching data", { error });
    res.writeHead(500, {
      "access-control-allow-origin": "*",
    });
    res.end();
  }
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
