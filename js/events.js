import { handleGameItemClicked, onClicked } from './utils.js';
import { period_time , bettingOn_red, bettingOn_green, bettingOn_violet, overlay, dialogDiv, bettingPopup } from './elements.js';

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

export function handleBettingOverlay() {
    const bettingButtons = [bettingOn_red, bettingOn_green, bettingOn_violet];
    const cancelButton = document.querySelector('.Betting__Popup-foot-c');
    const bettingCMark = document.querySelector('.Betting__C-mark');

        const updatePopupClass = (newClassSuffix) => {
            if (bettingPopup) {
                bettingPopup.className = bettingPopup.className.replace(/Betting__Popup-\d+/, '');
                bettingPopup.classList.add(`Betting__Popup-${newClassSuffix}`);
            }
        };

    // Add click listeners to betting buttons
    bettingButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', () => {
                if (button === bettingOn_green) {
                    updatePopupClass('11');
                } else if (button === bettingOn_red) {
                    updatePopupClass('10');
                } else if (button === bettingOn_violet) {
                    updatePopupClass('12');
                }
                
                overlay?.style.removeProperty('display');
                dialogDiv?.style.removeProperty('display');
                document.body.classList.add('van-overflow-hidden');
            });
        } else {
            console.error('One or more betting buttons are missing.');
        }
    });

    // Cancel button logic
    cancelButton?.addEventListener('click', () => {
        overlay?.style.setProperty('display', 'none');
        dialogDiv?.style.setProperty('display', 'none');
        document.body.classList.remove('van-overflow-hidden');
    });

    // Manage bettingCMark visibility
    if (bettingCMark) {
        const checkMarkVisibility = () => {
            if (!bettingCMark.style.display) {
                overlay?.style.setProperty('display', 'none');
                dialogDiv?.style.setProperty('display', 'none');
            }
        };

        checkMarkVisibility();

        const observer = new MutationObserver(checkMarkVisibility);
        observer.observe(bettingCMark, { attributes: true, attributeFilter: ['style'] });

        // Cleanup observer
        return () => observer.disconnect();
    } else {
        console.error('Betting__C-mark element not found.');
    }
}

handleBettingOverlay();
