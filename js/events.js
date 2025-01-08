import { handleGameItemClicked, onClicked } from './utils.js';
import { period_time, bettingOn_red, bettingOn_green, bettingOn_violet, overlay, dialogDiv, bettingPopup, totalAmountDiv, isAgree, winDialog, closeBtn , sec3Btn, money} from './elements.js';
import { winBonus } from './elements.js';
import { howtoBtn, ruleDialog, ruleCloseBtn, vanOverlay} from './elements.js';

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

export function handleBettingOverlay_clicks() {
    const inputField = document.querySelector("#van-field-5-input");
    const allItems = document.querySelectorAll('.Betting__Popup-body-line-item');

    const balanceItems = Array.from(allItems).filter((item) =>
        /^\d+$/.test(item.textContent.trim())
    );
    const quantityItems = Array.from(allItems).filter((item) =>
        /^X\d+$/.test(item.textContent.trim())
    );

    let isAgreedActive = false;
    isAgree?.addEventListener('click', () => {
        isAgree.classList.toggle('active');
        isAgreedActive = isAgree.classList.contains('active');
    });

    console.log('Balance Items:', balanceItems);
    console.log('Quantity Items:', quantityItems);

    let selectedBalance = 1;
    let selectedQuantity = 1;

    inputField.value = selectedQuantity;

    function handleSelection(event, items) {
        items.forEach(item => item.classList.remove('bgcolor'));
        event.target.classList.add('bgcolor');
    }

    // Update your click handlers to only remove bgcolor from their respective groups
    balanceItems.forEach(item => {
        item.addEventListener("click", (event) => {
            handleSelection(event, balanceItems);
            selectedBalance = parseInt(item.textContent.trim(), 10);
            updateTotalAmount(); // Update the total amount
        });
    });

    quantityItems.forEach(item => {
        item.addEventListener("click", (event) => {
            handleSelection(event, quantityItems);
            inputField.value = item.textContent.trim().replace('X', '')
            selectedQuantity = parseInt(item.textContent.trim().replace('X', ''), 10);
            updateTotalAmount();
        });
    });

    inputField.addEventListener("input", function () {
        // Ensure the input has a maximum of 4 digits
        let value = this.value;

        // Remove any characters beyond 4 digits
        if (value.length > 4) {
            this.value = value.slice(0, 4);
            return;
        }
        if (!/^\d*$/.test(value)) {
            this.value = value.slice(0, -1); // Remove invalid characters
            return;
        }

        // Parse the value and update selectedQuantity
        value = parseInt(this.value, 10) || 0;
        selectedQuantity = value;

        // Remove bgcolor from all multiplier items since we're using a custom value
        quantityItems.forEach(btn => btn.classList.remove("bgcolor"));

        // Check if the value matches any multiplier and highlight it
        quantityItems.forEach(item => {
            const multiplierValue = parseInt(item.textContent.trim().replace('X', ''));
            if (multiplierValue === value) {
                item.classList.add("bgcolor");
            }
        });

        updateTotalAmount();
    });

    // Increment and Decrement Buttons Logic
    const decrementBtn = document.querySelector(".Betting__Popup-btn:first-child");
    const incrementBtn = document.querySelector(".Betting__Popup-btn:last-child");

    decrementBtn.addEventListener("click", function () {
        let currentValue = parseInt(inputField.value) || 1;
        if (currentValue > 1) {
            currentValue--;
            inputField.value = currentValue;
            selectedQuantity = currentValue;

            // Update multiplier highlighting
            quantityItems.forEach(item => {
                item.classList.remove("bgcolor");
                const multiplierValue = parseInt(item.textContent.trim().replace('X', ''));
                if (multiplierValue === currentValue) {
                    item.classList.add("bgcolor");
                }
            });

            updateTotalAmount();
        }
    });

    incrementBtn.addEventListener("click", function () {
        let currentValue = parseInt(inputField.value) || 1;
        if (currentValue < 100) {
            currentValue++;
            inputField.value = currentValue;
            selectedQuantity = currentValue;

            // Update multiplier highlighting
            quantityItems.forEach(item => {
                item.classList.remove("bgcolor");
                const multiplierValue = parseInt(item.textContent.trim().replace('X', ''));
                if (multiplierValue === currentValue) {
                    item.classList.add("bgcolor");
                }
            });

            updateTotalAmount();
        }
    });

    // Update total amount display
    function updateTotalAmount() {
        const total = selectedBalance * selectedQuantity;
        // money -= total
        totalAmountDiv.textContent = `Total amount ₹${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // Cancel button functionality
    const cancelBtn = document.querySelector(".Betting__Popup-foot-c");
    cancelBtn.addEventListener("click", function () {
        const popup = document.querySelector(".van-popup");
        if (popup) {
            popup.style.display = "none";
        }
    });

    // Initialize with default values
    updateTotalAmount();
}

export function handle_winLoss() {
    totalAmountDiv.addEventListener("click", function () {
        overlay?.style.setProperty('display', 'none');
        dialogDiv?.style.setProperty('display', 'none');
        winDialog.removeAttribute("style");
    });
    closeBtn.addEventListener("click", function () {
        winDialog.style.setProperty('display', 'none');
        document.body.classList.remove('van-overflow-hidden');
    })
    sec3Btn.addEventListener("click", function(){
        sec3Btn.classList.toggle("active")
    })
}

export function howToBtn(){
    howtoBtn.addEventListener("click", () => {
        ruleDialog.style.display = "";
        vanOverlay.style.display = "block";
        document.body.classList.add('van-overflow-hidden');
    });
    ruleCloseBtn.addEventListener("click", () => {
        ruleDialog.style.display = "none";
        vanOverlay.style.display = "none";
        document.body.classList.remove('van-overflow-hidden');
    });
}

howToBtn();
handle_winLoss();
handleBettingOverlay();
handleBettingOverlay_clicks();
