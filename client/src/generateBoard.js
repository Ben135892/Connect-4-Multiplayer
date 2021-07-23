const generateBoard = (width, height) => {
    const matrix = new Array(width);
    for (let i = 0; i < width; i++) {
        matrix[i] = new Array(height).fill('');
    }
    return matrix;
};

export default generateBoard;