import StartButton from './StartButton';

const GameInfo = ({ game, player, gameOutcome }) => {
    const oppositeColor = () => player.colour === 'yellow' ? 'red' : 'yellow';
    return (
        <div id="info">
            {gameOutcome ? <h2>{gameOutcome}</h2> : null}
            {game.hasStarted && (player.colour === game.turn ? <h2 className={player.colour + ' highlighted'}>Your turn</h2>
                                                             : <h2 className={oppositeColor(player.colour) + ' highlighted'}>Opponent's turn</h2>)}
            {!game.hasStarted && (game.players.length === 2 ? (player.isHosting ? <StartButton gameID={game._id}/> : <h2>Waiting for host to start...</h2>)
                                                            : <h2>Waiting for another player...</h2>)}
        </div>
    );
}

export default GameInfo;