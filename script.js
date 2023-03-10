const localStorageKey = 'lastVisit';
const minuteInterval = 60;
const secondsInterval = minuteInterval*60;

function getLastFreedomTimeStamp() {
    var lastVisit = localStorage.getItem(localStorageKey);

    if(!lastVisit)
        lastVisit = setLastVisit();

    return lastVisit;
}

function setLastVisit() {
    localStorage.setItem(localStorageKey, Date.now());
    return localStorage.getItem(localStorageKey);
}

function handleFocusTime() {
    var lastVisitMilliSeconds = getLastFreedomTimeStamp();
    var diffNowInSeconds = calcDateDiffNowInSeconds(lastVisitMilliSeconds);
    var timeLeftInSeconds = getTimeDiffInSeconds(diffNowInSeconds, secondsInterval);

    var headerString = '';

    if(timeLeftInSeconds === 0 || diffNowInSeconds/60 <= 5) { // 5 min buffer every hour is fine
        if(timeLeftInSeconds === 0)
            setLastVisit();
        headerString = 'It\'s time for your browsing break! :-)'
        document.getElementById('header').classList.remove('angry');
        document.getElementById('header').classList.add('happy');
        document.getElementsByClassName('container')[0].classList.add('happy-background');
        document.getElementsByClassName('container')[0].classList.remove('angry-background');
        document.getElementById('subHeaderText').innerHTML = '';
        document.title = 'Happy browsing!';
    }
    else {
        var hoursDecimal = getHoursOfSecondsDecimal(timeLeftInSeconds);
        var hoursFloorInteger = Math.floor(hoursDecimal);

        var minutesDecimal = getMinutesOfDecimal(hoursDecimal-hoursFloorInteger);
        var minutesFloorInteger = Math.floor(minutesDecimal);

        var secondsDecimal = (minutesDecimal-minutesFloorInteger)*60;
        var secondsFloorInteger = Math.floor(secondsDecimal);

        var hoursStr = hoursFloorInteger > 0 ? getIntSpan(hoursFloorInteger) + ' hour' + (hoursFloorInteger > 1 || hoursFloorInteger === 0 ? 's' : '') + ' and ' : '';
        var minutesStr = getIntSpan(minutesFloorInteger) + ' minute' + (minutesFloorInteger > 1 || minutesFloorInteger === 0 ? 's' : '');//hoursFloorInteger+minutesFloorInteger > 0 ? ' minutes and ' : '';

        var timeString = hoursStr + minutesStr + ' left until next browsing break. Get back to work.';//hoursStr + minutesFloorInteger + minutesStr + secondsFloorInteger + ' seconds';
        document.getElementById('subHeaderText').innerHTML = timeString;
        headerString = 'Sorry man ...';
        document.getElementsByClassName('container')[0].classList.remove('happy-background');
        document.getElementsByClassName('container')[0].classList.add('angry-background');

        document.getElementById('header').classList.remove('happy');
        document.getElementById('header').classList.add('angry');
        document.title = (hoursFloorInteger < 10 ? '0' + hoursFloorInteger : hoursFloorInteger) + ':' + (minutesFloorInteger < 10 ? '0' + minutesFloorInteger : minutesFloorInteger) + ' left. Stay focused!';
    }

    document.getElementById('headerText').innerHTML = headerString;
}

function getIntSpan(number) {
    return '<span class="number">' + number + '</span>';
}

function onLoad() {
    handleFocusTime();
    setInterval(handleFocusTime, 1000*60);
}

function getMinutesOfDecimal(timeInHoursDecimal) {
    return timeInHoursDecimal * 60;
}

function getHoursOfSecondsDecimal(timeInSeconds) {
    return timeInSeconds/60/60;
}

function getTimeDiffInSeconds(currentDiffInSeconds, intervalInSeconds) {
    var diff = intervalInSeconds-currentDiffInSeconds;
    
    return diff < 0 ? 0 : diff;
}

function calcDateDiffNowInSeconds(date) {
    return (Date.now()-date) / 1000;
}

window.onload = onLoad;