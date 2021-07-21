const GameMenu = ({ history }) => {
    return (
        <div className="text-center">
            <h1>Connect 4 Online</h1>
            <button onClick={() => history.push('/game/create')}>Create Game</button>
            <button onClick={() => history.push('/game/join')}>Join Game</button>
        </div>
    );
}

export default GameMenu;