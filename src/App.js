import "./App.css";
import React from "react";
// import { act } from "react-dom/test-utils";
import io from "socket.io-client";

// const api = process.env.REACT_APP_API_URL;

const socket_key = process.env.REACT_APP_API_URL;
console.log(socket_key);
const socket = io.connect(socket_key);

socket.on("connect", function () {
  console.log("connected");
});
socket.on("turn", (data) => {
  sessionStorage.setItem("activePlayer", data);
});

//components
const Name = ({ setName }) => {
  const [tempname, setTempname] = React.useState("");
  return (
    <div className="name">
      <div>
        <input
          className="nameInput"
          type="text"
          placeholder="Enter your name"
          value={tempname}
          onChange={(e) => setTempname(e.target.value)}
        />
      </div>
      <div
        className="nameButton"
        onClick={() => {
          if (tempname === "") {
            alert("Please enter a name");
            return;
          }
          localStorage.setItem("name", tempname);
          setName(tempname);
        }}
      >
        Enter
      </div>
    </div>
  );
};

function App() {
  const [pageState, setPageState] = React.useState("arena");
  const [name, setName] = React.useState("");

  React.useEffect(() => {
    const name = localStorage.getItem("name");
    console.log("running");
    if (name !== null) {
      socket.emit("sessionStatus");
      socket.on("sessionStatus", (data) => {
        console.log(data);
        if (!data) {
          socket.emit("join", name);
        } else {
          alert("Session is already active!! Come back later");
          socket.disconnect();
        }
      });

      console.log("running");
      setName(name);
    }
  }, [name]);

  const Arena = ({ socket }) => {
    const [sessionStatus, setSessionStatus] = React.useState(false);
    const [readyStatus, setReadyStatus] = React.useState(false);
    // socket.emit("sessionStatus");
    React.useEffect(() => {
      if (sessionStorage.getItem("session")) {
        setSessionStatus(true);
      }
    }, [sessionStatus]);
    React.useEffect(() => {
      socket.on("start_game", (data) => {
        console.log(data);
        sessionStorage.setItem("session", true);
        setSessionStatus(true);
      });
      socket.on("end_game", (data) => {
        sessionStorage.modifyItem("session", false);

        setSessionStatus(false);
      });
    }, [socket]);

    const ActiveSession = () => {
      // const [pageState, setPageState] = React.useState("action");
      const [activePlayer, setActivePlayer] = React.useState("");
      const [activeDescribe, setActiveDescribe] = React.useState(false);
      const [describe, setDescribe] = React.useState("");
      // const [infoPage, setInfoPage] = React.useState(false);
      // const [info, setInfo] = React.useState("");
      const [move, setMove] = React.useState("");
      const [player, setPlayer] = React.useState("");
      const [event, setEvent] = React.useState("");
      const [kill, setKill] = React.useState(false);
      const [revive, setRevive] = React.useState(false);
      const [defend, setDefend] = React.useState(false);
      const [support, setSupport] = React.useState(false);
      const [rollnumber, setRollnumber] = React.useState(0);
      const [reqroll, setReqroll] = React.useState(0);

      const changeValue = (value) => {
        if (value === "Kill") {
          setKill(!kill);
          setRevive(false);
          setDefend(false);
          setSupport(false);
        } else if (value === "Revive") {
          setRevive(!revive);
          setKill(false);
          setDefend(false);
          setSupport(false);
        } else if (value === "Defend") {
          setDefend(!defend);
          setKill(false);
          setRevive(false);
          setSupport(false);
        } else if (value === "Support") {
          setSupport(!support);
          setKill(false);
          setRevive(false);
          setDefend(false);
        }
        setEvent(value);
      };

      const handleDescribe = () => {
        setActiveDescribe(!activeDescribe);
        socket.emit("describe", { name, describe });
        if (sessionStorage.getItem("describe")) {
          sessionStorage.removeItem("describe");
        }
      };

      const Checked = ({ value }) => {
        return (
          <div
            className="checked"
            onClick={() => {
              changeValue(`${value}`);
            }}
          >
            {value}
          </div>
        );
      };

      const Unchecked = ({ value }) => {
        return (
          <div
            className="unchecked"
            onClick={() => {
              changeValue(`${value}`);
            }}
          >
            {value}
          </div>
        );
      };

      React.useEffect(() => {
        socket.on("turn", (data) => {
          sessionStorage.setItem("activePlayer", data);
          setActiveDescribe(false);
          setActivePlayer(data);
        });
        socket.on("describeturn", (data) => {
          if (data === name) {
            sessionStorage.setItem("describe", true);
            sessionStorage.setItem("activePlayer", data);
            setActiveDescribe(true);
            setActivePlayer(data);
          }
        });
        if (sessionStorage.getItem("activePlayer")) {
          setActivePlayer(sessionStorage.getItem("activePlayer"));
          if (sessionStorage.getItem("describe")) {
            setActiveDescribe(true);
          }
        }
      }, []);

      const roll = () => {
        if (move === "") {
          alert("Please enter a move");
          return;
        } else if (player === "") {
          alert("Please enter a player name");
          return;
        } else if (event === "") {
          alert("Please select an event");
          return;
        }
        socket.emit("roll", { name, player, move, event });
      };
      React.useEffect(() => {
        socket.on("roll", ({ name, roll, reqroll, move, event, player }) => {
          console.log(roll, reqroll, event);
          console.log(name, player, move, event);
          console.log(activePlayer);
          if (name === activePlayer) {
            setTimeout(() => {
              setRollnumber(Math.floor(Math.random() * 20) + 1);
              setTimeout(() => {
                setRollnumber(Math.floor(Math.random() * 20) + 1);
                setTimeout(() => {
                  setRollnumber(Math.floor(Math.random() * 20) + 1);
                  setTimeout(() => {
                    setRollnumber(Math.floor(Math.random() * 20) + 1);
                    setTimeout(() => {
                      setRollnumber(Math.floor(Math.random() * 20) + 1);
                      setTimeout(() => {
                        setRollnumber(Math.floor(Math.random() * 20) + 1);
                        setTimeout(() => {
                          setRollnumber(roll);
                          setTimeout(() => {
                            if (reqroll > roll) {
                              sessionStorage.setItem("activePlayer", player);
                              setActivePlayer(player);
                              setMove("");
                              setPlayer("");
                              setEvent("");
                              setKill(false);
                              setRevive(false);
                              setDefend(false);
                              setSupport(false);
                              setRollnumber(0);
                              setReqroll(0);
                            } else {
                              console.log("activeDescribe");
                              setActiveDescribe(true);
                              setMove("");
                              setPlayer("");
                              setEvent("");
                              setKill(false);
                              setRevive(false);
                              setDefend(false);
                              setSupport(false);
                              setReqroll(0);
                              setRollnumber(0);
                            }
                          }, 2000);
                        }, 500);
                      }, 100);
                    }, 100);
                  }, 100);
                }, 100);
              }, 100);
            }, 50);
          } else {
            setMove(move);
            setReqroll(reqroll);
            setTimeout(() => {
              setRollnumber(Math.floor(Math.random() * 20) + 1);
              setTimeout(() => {
                setRollnumber(Math.floor(Math.random() * 20) + 1);
                setTimeout(() => {
                  setRollnumber(Math.floor(Math.random() * 20) + 1);
                  setTimeout(() => {
                    setRollnumber(Math.floor(Math.random() * 20) + 1);
                    setTimeout(() => {
                      setRollnumber(Math.floor(Math.random() * 20) + 1);
                      setTimeout(() => {
                        setRollnumber(Math.floor(Math.random() * 20) + 1);
                        setTimeout(() => {
                          setRollnumber(roll);
                          setTimeout(() => {
                            if (reqroll > roll) {
                            } else {
                            }
                          }, 2000);
                        }, 500);
                      }, 100);
                    }, 100);
                  }, 100);
                }, 100);
              }, 100);
            }, 50);
          }

          setRollnumber(roll);
        });
      }, [activePlayer]);
      return (
        <React.Fragment>
          <div className="sessionActive">
            <div className="sessionActiveHeader">
              {activePlayer && activePlayer === name
                ? "Your turn"
                : `${activePlayer}'s turn`}
            </div>
            {!activeDescribe && activePlayer && activePlayer === name && (
              <div className="myturn">
                <input
                  className="myturninput"
                  type="text"
                  placeholder="Enter your move"
                  value={move}
                  onChange={(e) => {
                    setMove(e.target.value);
                  }}
                />
                <input
                  className="myturninput"
                  type="text"
                  placeholder="Enter player name"
                  value={player}
                  onChange={(e) => {
                    setPlayer(e.target.value);
                  }}
                />
                <span style={{ fontSize: "14px" }}>Select event:</span>
                <div className="eventOptions">
                  {kill ? (
                    <Checked value={"Kill"} />
                  ) : (
                    <Unchecked value={"Kill"} />
                  )}
                  {revive ? (
                    <Checked value={"Revive"} />
                  ) : (
                    <Unchecked value={"Revive"} />
                  )}
                  {defend ? (
                    <Checked value={"Defend"} />
                  ) : (
                    <Unchecked value={"Defend"} />
                  )}
                  {support ? (
                    <Checked value={"Support"} />
                  ) : (
                    <Unchecked value={"Support"} />
                  )}
                </div>
                <div className="rollnumber">{rollnumber}</div>
                <div className="roll" onClick={() => roll()}>
                  {" "}
                  ROLL{" "}
                </div>
              </div>
            )}
            {activeDescribe && activePlayer === name && (
              <div className="activeDescribe">
                <div className="activeDescribeHeader">
                  {" "}
                  <b>You Won!</b> Describe Your Action!!
                </div>
                <div className="activeDescribeBody">
                  <textarea
                    className="describeInput"
                    type="textarea"
                    value={describe}
                    onChange={(e) => {
                      setDescribe(e.target.value);
                    }}
                    placeholder="Enter your description"
                  ></textarea>
                  <div
                    className="describeButton"
                    onClick={() => handleDescribe()}
                  >
                    Submit
                  </div>
                </div>
              </div>
            )}
            {activePlayer && activePlayer !== name && (
              <div className="notmyturn">
                {move === "" || move === undefined ? (
                  <div className="notmyturnwaiting">Waiting for player!</div>
                ) : null}
                {move && (
                  <React.Fragment>
                    <div className="notmyturnmove notmyturnresultbox">
                      <span style={{ fontWeight: "bolder", fontSize: "14px" }}>
                        Chosen move: &nbsp;
                      </span>
                      {move}
                    </div>
                    <div className="notmyturnplayer notmyturnresultbox">
                      <span style={{ fontWeight: "bolder", fontSize: "14px" }}>
                        Chosen player: &nbsp;
                      </span>
                      {player}
                    </div>
                    <div className="notmyturnevent notmyturnresultbox">
                      <span style={{ fontWeight: "bolder", fontSize: "14px" }}>
                        Chosen event: &nbsp;
                      </span>
                      {event}
                    </div>
                    <div className="notmyturnreqroll notmyturnresultbox">
                      <span style={{ fontWeight: "bolder", fontSize: "14px" }}>
                        Required roll: &nbsp;
                      </span>
                      {reqroll}
                    </div>
                    <div className="notmyturnroll">{rollnumber}</div>
                  </React.Fragment>
                )}
              </div>
            )}
          </div>
        </React.Fragment>
      );
    };
    return (
      <div className="arena">
        {sessionStatus && (
          <div className="sessionStatus">
            <ActiveSession />
          </div>
        )}
        {!sessionStatus && !readyStatus && (
          <div
            className="sessionReadyButton"
            onClick={() => {
              console.log("clicked");
              socket.emit("ready", name);
              setReadyStatus(true);
            }}
          >
            Ready
          </div>
        )}
        {!sessionStatus && readyStatus && (
          <div className="sessionReady">Waiting for other players</div>
        )}
      </div>
    );
  };
  const Players = () => {
    const [players, setPlayers] = React.useState({});
    const [playerArray, setPlayerArray] = React.useState([]);
    React.useEffect(() => {
      socket.emit("players");
      socket.on("players", (data) => {
        console.log(data);
        console.log(Object.keys(data));
        setPlayers(data);
        setPlayerArray(Object.keys(data));
      });
    }, []);
    return (
      <div className="players">
        {playerArray.map((player) => {
          return (
            <div className="player">
              <div
                className="playerName"
                style={{
                  color: players[`${player}`]["Alive"] ? "white" : "black",
                }}
              >
                {player}
              </div>
              <div
                className="playerAP"
                style={{
                  color: players[`${player}`]["Alive"] ? "white" : "black",
                }}
              >
                {players[`${player}`]["AP"]}
              </div>
              <div
                className="playerStatus"
                style={{
                  color: players[`${player}`]["Alive"] ? "lime" : "red",
                }}
              >
                {players[`${player}`]["Alive"] ? "Alive" : "Dead"}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const Score = () => {
    return <div className="score"></div>;
  };

  const Info = () => {
    return (
      <div className="info">
        <button className="infoHeader">Rules</button>
        <div className="infoBody">
          <div className="infoBodyText">
            <b>Game Rules:</b> (Scroll down)
            <br />
            <br />
            <b>1.</b> Gameflow:
            <br />
            <br />
            <div className="gameflow" style={{ marginLeft: "10px" }}>
              <b>1.</b>The player chooses his action, opponen, event and rolls
              the dice.
              <br />
              <b>2.</b>If the dice rolls above AP (Action Point) required for
              the action, the action will be successful. Otherwise, the action
              will fail.
              <br />
              <b>3.</b>If the action is successful, the chosen "event" will take
              place and the player will be given with the "describe action" box
              through which he can describe his action in detail.
              <br />
              <b>4.</b>If the action is unsuccessful, the chosen "opponent" will
              be given with the "describe action" box through which he can
              describe how the action of the player has failed.
              <br />
              <b>5.</b>Once, the whole action completes, the next player will be
              given the turn. And the game will continue.
            </div>
            <br />
            <br />
            <b>3.</b> Event: Currently 4 in the game. Maybe more in future.
            <br />
            <br />
            <div className="events" style={{ marginLeft: "10px" }}>
              <b>Kill:</b> This event will target the opponent and kill him if
              the player secures the roll more than the AP of the opponent. This
              event will reduce 2 AP of the player for successful action.
              Otherwise, the player will lose 1 AP.
              <br></br>
              <b>Revive:</b> This event can revive the target player if the
              player secures the roll more than the AP of the targeted player.
              This event will reduce 2 AP of the player for successful action.
              Otherwise, the player will lose 1 AP.
              <br></br>
              <b>Defend:</b> This event provides player +4 AP and a "defense"
              status if the player rolls more than the AP of themselve.
              Otherwise, +1 AP. In next rounds, if the player survives the
              "Kill" event then the AP of the player will be reduced by 2 and
              the defense status will be removed. If the player already equipped
              with "defense" status the action will be considered as a "miss".
              <br></br>
              <b>Support:</b> This event provides +2 AP to both the player and
              the target player for successful action otherwise +1 AP to both
              the players.
            </div>
            <br />
            <br />
          </div>
        </div>
      </div>
    );
  };

  const ActionLog = () => {
    const [actionLog, setActionLog] = React.useState([]);
    React.useEffect(() => {
      if (sessionStorage.getItem("actionLog")) {
        setActionLog(JSON.parse(sessionStorage.getItem("actionLog")));
      }
    }, []);
    React.useEffect(() => {
      socket.on("actionLog", (data) => {
        setActionLog([...actionLog, data]);
        sessionStorage.setItem(
          "actionLog",
          JSON.stringify([...actionLog, data])
        );
      });

      socket.on("start_game", () => {
        setActionLog([
          ...actionLog,
          { player: "System", action: "Game Started" },
        ]);
        sessionStorage.setItem(
          "actionLog",
          JSON.stringify([
            ...actionLog,
            { player: "System", action: "Game Started" },
          ])
        );
      });
      socket.on("turn", (data) => {
        setActionLog([...actionLog, { player: "Turn", action: `${data}` }]);
        sessionStorage.setItem(
          "actionLog",
          JSON.stringify([...actionLog, { player: "Turn", action: `${data}` }])
        );
      });
      socket.on("roll", ({ reqroll, roll }) => {
        if (roll >= reqroll) {
          setActionLog([
            ...actionLog,
            { player: "Game", action: `Action Successful` },
          ]);
          sessionStorage.setItem(
            "actionLog",
            JSON.stringify([
              ...actionLog,
              { player: "Game", action: `Action Successful` },
            ])
          );
        } else {
          setActionLog([
            ...actionLog,
            { player: "Game", action: `Action Failed` },
          ]);
          sessionStorage.setItem(
            "actionLog",
            JSON.stringify([
              ...actionLog,
              { player: "Game", action: `Action Failed` },
            ])
          );
        }
      });
      socket.on("describe", ({ name, describe }) => {
        setActionLog([
          ...actionLog,
          { player: `${name}`, action: `${describe}` },
        ]);
        sessionStorage.setItem(
          "actionLog",
          JSON.stringify([
            ...actionLog,
            { player: `${name}`, action: `${describe}` },
          ])
        );
      });
    }, [actionLog]);
    console.log(window.innerHeight - 400);
    return (
      <div
        className="actionLog"
        style={{
          height: `${window.innerHeight - 420}px`,
        }}
      >
        <div className="actionLogHeader">Action Log</div>
        <div className="actionLogBody">
          <div className="actionLogBodyText">
            {actionLog
              ? actionLog.map((action) => {
                  return (
                    <div className="actionLogBodyTextAction">
                      <div className="actionLogBodyTextActionPlayer">
                        <span
                          style={{
                            color: `${
                              action.player === "Game" ||
                              action.player === "Turn" ||
                              action.player === "System"
                                ? "#00ffd9"
                                : "lime"
                            }`,
                          }}
                        >
                          {action.player}{" "}
                        </span>
                        <span> : </span>
                        {action.action}.
                      </div>
                    </div>
                  );
                })
              : "No Action Yet!"}
          </div>
        </div>
      </div>
    );
  };

  const Credits = () => {
    return (
      <div className="credits">
        v1.0.0 | Developed by
        <span style={{ fontWeight: "bold", marginLeft: "3px" }}>!mute</span>
      </div>
    );
  };

  const Main = ({ socket }) => {
    return (
      <React.Fragment>
        <div className="navbar">
          <div
            className="playersButton navbutton"
            onClick={() => setPageState("players")}
          >
            Players
          </div>
          <span className="divider"></span>
          <div
            className="arenaButton navbutton"
            onClick={() => setPageState("arena")}
          >
            Arena
          </div>
          <span className="divider"></span>
          <div
            className="scoreButton navbutton"
            onClick={() => setPageState("score")}
          >
            Score
          </div>
        </div>
        {pageState === "arena" && <Arena socket={socket} />}
        {pageState === "players" && <Players />}
        {pageState === "score" && <Score />}
        <Info />
        <ActionLog />
        <Credits />
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <div className="bg">
        {name === "" && <Name setName={setName} />}
        {name !== "" && <Main socket={socket} />}
      </div>
    </React.Fragment>
  );
}

export default App;
