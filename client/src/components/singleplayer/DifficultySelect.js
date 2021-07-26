import { useState } from 'react';
import Game from './Game';
import '../../css/GameMenu.css';

const DifficultySelect = () => {
    const [difficulty, setDifficulty] = useState(null);
    if (difficulty === null) {
        return (
            <div id="menu">
                <h1>Select Difficulty</h1>
                <button onClick={() => setDifficulty({ depth: 2, string: 'Easy' })}>Easy</button>
                <button onClick={() => setDifficulty({ depth: 4, string: 'Medium' })}>Medium</button>
                <button onClick={() => setDifficulty({ depth: 7, string: 'Hard' })}>Hard</button>
            </div> 
        );
    }
    return <Game difficulty={difficulty} setDifficulty={setDifficulty}/>;
}

export default DifficultySelect;