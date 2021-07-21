import { Route, Switch, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import GameMenu from './GameMenu';
import CreateGame from './CreateGame';
import JoinGame from './JoinGame';
import Game from './Game';
import socket from './socketConfig';
import './css/App.css'

function App() {
    const history = useHistory();
    const [game, setGame] = useState({});
    const [players, setPlayers] = useState([]);
    useEffect(() => {
        socket.on('update-game', game => setGame(game));
        socket.on('update-players', players => setPlayers(players));
        socket.on('join-game', () => history.push('/game/play'));
    }, [history]);
    return (
        <Switch>
            <Route exact path="/" component={GameMenu} />
            <Route exact path="/game/create" component={CreateGame} />
            <Route exact path="/game/join" component={JoinGame} />
            <Route exact path="/game/play">
                <Game game={game} setGame={setGame} players={players} setPlayers={setPlayers}/>
            </Route>
        </Switch>
    );
}

export default App;
