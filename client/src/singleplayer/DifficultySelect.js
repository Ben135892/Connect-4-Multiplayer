import { useState } from 'react';
import Game from './Game';

const DifficultySelect = () => {
    const [difficulty, setDifficulty] = useState(null);
    const render = () => {
        if (difficulty === null) {
            return (
                <div>
                    <button onClick={() => setDifficulty({ depth: 1, string: 'Easy' })}>Easy</button>
                    <button onClick={() => setDifficulty({ depth: 5, string: 'Medium' })}>Medium</button>
                    <button onClick={() => setDifficulty({ depth: 7, string: 'Hard' })}>Hard</button>
                </div> 
            );
        } else {
            return <Game difficulty={difficulty} setDifficulty={setDifficulty}/>;
        }
    }
    return render();
}

export default DifficultySelect;