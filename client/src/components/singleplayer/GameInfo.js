import StartButton from './StartButton';

const oppositeColour = (colour) => colour === 'red' ? 'yellow' : 'red'; 

const GameInfo = ({ game, setGame, playerColour, setPlayerColour, gameOutcome, setGameOutcome }) => {
    return (
        <div id="info">
            {gameOutcome && <h2>{gameOutcome}</h2>}
            {!game.hasStarted && <StartButton game={game} setGame={setGame} setPlayerColour={setPlayerColour} setGameOutcome={setGameOutcome} />}
            {game.hasStarted && (game.turn === playerColour ? <h2 className={'highlighted ' + playerColour}>Your turn!</h2>
                                                            : <h2 className={ 'highlighted ' + oppositeColour(playerColour)}>AI's turn!</h2>)}
        </div> 
    );
}
 
export default GameInfo
