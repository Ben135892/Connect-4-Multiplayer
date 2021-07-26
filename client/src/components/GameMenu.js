import '../css/GameMenu.css';

const GameMenu = ({ history }) => {
    return (
        <div id="menu">
            <h1>Connect 4 Online</h1>
            <button onClick={() => history.replace('/game/ai')}>Play against AI</button>
            <button onClick={() => history.replace('/game/create')}>Create Game</button>
            <button onClick={() => history.replace('/game/join')}>Join Game</button>
        </div>
    );
}

export default GameMenu;