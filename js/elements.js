export let period_number = document.querySelector('.TimeLeft__C-id');
export let period_time = document.querySelector('.TimeLeft__C-time');
export let gameRecord_body = document.querySelector('.GameRecord__C-body');
export var money = document.querySelector('.Wallet__C-balance-l1 > div[data-v-7dd1adab]');
// bettonOn buttons green/violet/red
export let bettingOn_red = document.querySelector('.Betting__C-head-r');
export let bettingOn_violet = document.querySelector('.Betting__C-head-p');
export let bettingOn_green = document.querySelector('.Betting__C-head-g');
export let bettingOnNum_parent = document.querySelector('.Betting__C-numC');
export let selectedNum = document.querySelector('.Betting__Popup-head-selectName');
// overlays and popup
export let overlay = document.querySelector('.van-overlay[data-v-7f36fe93]'); // select black viel
export let dialogDiv = document.querySelector('div[role="dialog"][data-v-7f36fe93]'); // Select the dialog div
export let bettingPopup = document.querySelector('[data-v-7f36fe93].Betting__Popup-10'); // changing color popup
export const isAgree = document.querySelector(".Betting__Popup-agree"); // agree checkbox
export const InsufficientBalance = document.querySelector(".van-toast--fail"); // insufficient balance toast
//showing win / loss dialog
export const totalAmountDiv = document.querySelector(".Betting__Popup-foot-s"); // dialog amount btn
export const betTextToast = document.querySelector(".van-toast--text"); // bet success toast
export const winDialog = document.querySelector(".WinningTip__C"); // main win dialog
export const winBonus = document.querySelector(".bonus"); // winning bonus number
export const winDetail = document.querySelector(".gameDetail"); // winning period number 
export const winningNum = document.querySelector(".WinningNum"); // winning number 
export const colorType = document.querySelector(".WinningTip__C-body-l2"); // color type of winning number
export const winSmallBig = document.querySelector(".WinningTip__C-body-l2 > div:nth-child(3)"); // small or big winned
export const winColor = document.querySelector(".WinningTip__C-body-l2 > div:nth-child(1)"); // winning color 
export const closeBtn = document.querySelector(".closeBtn"); // close icon button
export const sec3Btn = document.querySelector(".acitveBtn"); // 3 second close icon button
// rules dialog
export const ruleDialog = document.querySelector("div[role='dialog'][data-v-0bba67ea]"); // main dialog
export const howtoBtn = document.querySelector(".TimeLeft__C-rule"); 
export const ruleCloseBtn = document.querySelector(".TimeLeft__C-PreSale-foot-btn"); // rule dialog close icon
export const vanOverlay = document.querySelector(".van-overlay[data-v-7f36fe93]"); // overlay
// colorful number tokens
export const tokenParent = document.querySelector(".TimeLeft__C-num"); // timer side tokens parent div