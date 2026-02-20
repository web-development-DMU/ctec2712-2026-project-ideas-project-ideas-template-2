async function loadLeagues() {
    const url = "https://v3.football.api-sports.io/leagues";

    const headers = new Headers();
    headers.append("x-apisports-key", "292fee546990a211ff36676a96bda753");

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: headers,
            redirect: "follow"
        });

        const data = await response.json();
        console.log(data);

        

    } catch (error) {
        console.error("API error:", error);
    }
}

loadFixtures();

async function loadFixtures() {
    
}


loadLeagues();

async function loadStandings() {
    const url = "https://v3.football.api-sports.io/standings?league=39&season=2023";

    const headers = new Headers();
    headers.append("x-apisports-key", "292fee546990a211ff36676a96bda753");

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: headers,
            redirect: "follow"
        });

        const json = await response.json();
        console.log(json);

    
        const standings = json.response[0].league.standings[0];

        buildStandingsTable(standings);

    } catch (error) {
        console.error("API error:", error);
    }
}

loadStandings();


function buildStandingsTable(standings) {
    const table = document.getElementById("standingsTable");

    
    table.innerHTML = `
        <tr>
            <th>Rank</th>
            <th>Team</th>
            <th>Played</th>
            <th>Win</th>
            <th>Draw</th>
            <th>Loss</th>
            <th>Points</th>
        </tr>
    `;

    
    standings.forEach(team => {
        table.innerHTML += `
            <tr>
                <td>${team.rank}</td>
                <td>${team.team.name}</td>
                <td>${team.all.played}</td>
                <td>${team.all.win}</td>
                <td>${team.all.draw}</td>
                <td>${team.all.lose}</td>
                <td>${team.points}</td>
            </tr>
        `;
    });
}












