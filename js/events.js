import { handleGameItemClicked, onClicked } from './utils.js';
import { period_time } from './elements.js';

export function initGameListEvents() {
    const gameListContainer = document.querySelector('.GameList__C');
    let timeLeftName = document.querySelector('.TimeLeft__C-name');

    if (gameListContainer && timeLeftName) {
        const gameItems = gameListContainer.querySelectorAll('.GameList__C-item');

        gameItems.forEach(item => {
            item.addEventListener('click', () => {
                gameItems.forEach(innerItem => innerItem.classList.remove('active'));
                gameItems.forEach(innerItem => {
                    innerItem.classList.remove('active');
                });
                item.classList.add('active');
                
                const textContent = item.textContent.trim();
                handleGameItemClicked(textContent, timeLeftName);
                onClicked(textContent);
            });
        });
    } else {
        console.error('GameList__C container or TimeLeft__C-name not found.');
    }
}
