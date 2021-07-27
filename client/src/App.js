import { Route, Switch, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import GameMenu from './components/GameMenu';
import CreateGame from './components/multiplayer/CreateGame';
import JoinGame from './components/multiplayer/JoinGame';
import MultiplayerGame from './components/multiplayer/Game';
import DifficultySelect from './components/singleplayer/DifficultySelect';
import BackButton from './components/BackButton';
import socket from './socketConfig';
import './css/App.css';

function App() {
    const history = useHistory();
    const [game, setGame] = useState({});
    const [players, setPlayers] = useState([]);
    useEffect(() => {
        socket.on('update-game', game => setGame(game));
        socket.on('update-players', players => setPlayers(players));
        socket.on('update-game-and-players', ({ game, players }) => {
            setGame(game);
            setPlayers(players);
        });
        socket.on('join-game', () => history.replace('/game/play'));
    }, [history]);
    return (
        <div>
            <BackButton />
            <Switch>
                <Route exact path="/" component={GameMenu} />
                <Route exact path="/game/ai" component={DifficultySelect} />
                <Route exact path="/game/create" component={CreateGame} />
                <Route exact path="/game/join" component={JoinGame} />
                <Route exact path="/game/play">
                    <MultiplayerGame game={game} setGame={setGame} players={players} setPlayers={setPlayers}/>
                </Route>
            </Switch>
        </div>
    );
}

export default App;
