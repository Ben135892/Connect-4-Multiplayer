import './css/PlayerList.css';

const PlayerList = ({ playerID, players }) => {
    const renderPlayer = (player) => {
        if (player.colour !== '') {
            return <h2 key={player._id.toString()} className={player.colour + ' highlighted'}>{player.nickName + (player._id === playerID ? ' (you)' : '')}</h2>
        } else {
            return <h2 key={player._id.toString()} className='highlighted'>{player.nickName + (player._id === playerID ? ' (you)' : '')}</h2>
        }
    }
    return (
        <div id="playerlist">
                <h1>Players: </h1>
                {players.map(player => 
                    renderPlayer(player)
                )}
        </div>
    );
}

export default PlayerList;