import '../../css/PlayerList.css';

const PlayerList = ({ playerID, players }) => {
    return (
        <div id="playerlist">
                <h1>Players: </h1>
                {players.map(player => 
                    <h2 key={player._id.toString()} className={'highlighted ' + player.colour}>
                        {player.nickName + (player._id.toString() === playerID.toString() ? ' (you)' : '')}
                    </h2>
                )}
        </div>
    );
}

export default PlayerList;