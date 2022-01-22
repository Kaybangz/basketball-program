import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./PlayerInfoStyle.css";
import nbalogo from "./nbalogo.jpg";

const PlayerInfo = () => {
  //Create states to handle whether the player info and player stats would be displayed
  const [showInfo, setShowInfo] = useState(false);
  const [showStats, setShowStats] = useState(false);

  //Create states for the input box and collecting the balldontlie api data
  const [nameInput, setNameInput] = useState("");

  //State for collecting the playerInfo(in getPlayerInfo function)
  const [playerInfo, setPlayerInfo] = useState([]);

  //State for collecting the playerStats(in getPlayerStats function)
  const [playerStats, setPlayerStats] = useState([]);

  //Create states to manage the error messages displayed in the UI
  const [isName, setIsName] = useState(false);
  const [isInNba, setIsInNba] = useState(false);
  const [isFullname, setIsFullname] = useState(false);
  const [playInNba, setPlayInNba] = useState(false);

  //Create ref for triggering input focus
  const playerRef = useRef(null);

  //Input focus on page load
  useEffect(() => {
    playerRef.current.focus();
  }, []);

  //Create function to get player's info
  const getPlayerInfo = () => {
    axios(`https://www.balldontlie.io/api/v1/players?search=${nameInput}`)
      .then(async (response) => {
        if (response.data.data.length === 0) {
          setShowInfo(true);
          setShowStats(true);
          setIsInNba(true);
          setIsFullname(false);
          setIsName(false);
          setPlayInNba(false);
        } else if (response.data.data.length > 1) {
          setIsFullname(true);
          setIsName(false);
          setPlayInNba(false);
          setIsInNba(false);
        } else {
          setShowInfo(false);
          setShowStats(false);
          setIsInNba(false);
          setIsFullname(false);
          //push the data gotten from the api to the playerInfo array
          setPlayerInfo(response.data.data);

          //Call the getPlayerStats function and pass the getPlayerInfo response as the playerID arguement
          getPlayerStats(response.data.data[0].id);
        }
      })
      .catch((err) => {
        throw new Error();
      });
  };

  //Create function to get player stats
  //"playerID" is the name gotten from the getPlayerInfo function
  const getPlayerStats = (playerID) => {
    axios(
      `https://www.balldontlie.io/api/v1/season_averages?season=2021&player_ids[]=${playerID}`
    )
      .then((response) => {
        if (response.data.data[0] === undefined) {
          setShowStats(true);
          setShowInfo(true);
          setPlayInNba(true);
          setIsFullname(false);
          setIsName(false);
          setIsInNba(false);
        } else {
          setShowStats(false);
          setShowInfo(false);
          setPlayInNba(false);
          setPlayerStats(response.data.data[0]);
        }
      })
      .catch((err) => {
        throw new Error();
      });
  };

  //Create function for handling the button click
  const submitHandler = (e) => {
    e.preventDefault();

    if (nameInput === "") {
      setIsName(true);
      setPlayInNba(false);
      setIsFullname(false);
      setIsInNba(false);
    } else {
      getPlayerInfo();
      getPlayerStats();
      setIsName(false);
    }
    setNameInput("");
  };

  return (
    <div className="main__container">
      <form className="container" onSubmit={submitHandler}>
        <div className="wrapper">
          <div className="input__container">
            <div>
              <label>Enter player's full name</label>
              <div
                style={{
                  paddingRight: "2em",
                  display: "flex",
                  marginBottom: "5px",
                }}
              >
                <input
                  ref={playerRef}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  type="text"
                  placeholder="i.e. Lebron James"
                />
                <button type="submit">Show</button>
              </div>
              <div
                style={{
                  paddingRight: "2em",
                }}
              >
                {isName ? (
                  <p style={{ color: "rgb(114, 4, 4)" }}>
                    Enter a player's name.
                  </p>
                ) : null}
                {isInNba ? (
                  <p style={{ color: "rgb(114, 4, 4)" }}>
                    Player is not in the NBA.
                  </p>
                ) : null}
                {playInNba ? (
                  <p style={{ color: "rgb(114, 4, 4)" }}>
                    Player did not participate in 2021/2022 NBA season.
                  </p>
                ) : null}
                {isFullname ? (
                  <p style={{ color: "rgb(114, 4, 4)" }}>
                    Enter player's full name.
                  </p>
                ) : null}
              </div>
            </div>
            <div className="img__container">
              <img
                src={nbalogo}
                alt="nbalog"
                style={{ width: "100%", height: "100% ", borderRadius: "8px" }}
              />
            </div>
          </div>

          <main>
            <div className="flex__display">
              <div>
                <h2
                  style={{
                    border: "1px solid rgb(1, 1, 110)",
                    padding: "3px",
                    borderRadius: "5px",
                  }}
                >
                  Player Info
                </h2>
                <div>
                  {showInfo
                    ? null
                    : playerInfo.map((info) => {
                        return (
                          <div key={info.id}>
                            <p>First name: {info.first_name}</p>
                            <p>Last name: {info.last_name}</p>
                            <p>
                              Height: {info.height_feet}'{info.height_inches}
                            </p>
                            <p>Weight: {info.weight_pounds} pounds</p>
                            <p>Team: {info.team.abbreviation}</p>
                            <p>Position: {info.position}</p>
                            <p>Conference: {info.team.conference}</p>
                          </div>
                        );
                      })}
                </div>
              </div>

              <div>
                <h2
                  style={{
                    border: "1px solid rgb(1, 1, 110)",
                    padding: "3px",
                    borderRadius: "5px",
                  }}
                >
                  Player Stats
                </h2>
                <div>
                  {showStats
                    ? null
                    : playerInfo.map((info) => {
                        return (
                          <div key={info.id}>
                            <p>
                              Games played: {playerStats["games_played"]} games
                            </p>
                            <p>Points Averaged: {playerStats["pts"]}%</p>
                            <p>Assist Averaged: {playerStats["ast"]}%</p>
                            <p>Blocks Averaged: {playerStats["blk"]}%</p>
                            <p>Rebounds Averaged: {playerStats["reb"]}%</p>
                            <p>Steals Averaged: {playerStats["stl"]}%</p>
                            <p>
                              Turnovers Averaged: {playerStats["turnover"]}%
                            </p>
                          </div>
                        );
                      })}
                </div>
              </div>
            </div>
          </main>
        </div>
      </form>

      <footer>
        <p>&copy; Built by Kaybangz.</p>
      </footer>
    </div>
  );
};

export default PlayerInfo;
