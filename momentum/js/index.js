import playList from './playlist.js';

const bodyElement = document.querySelector('body');

const timeElement = document.querySelector('.time');
const dateElement = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const fullDate = new Date();
const hours = fullDate.getHours();

const bgArrowPrev = document.querySelector('.slide-prev');
const bgArrowNext = document.querySelector('.slide-next');
let backgroundNumber;

let cityInput = document.querySelector('.city');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const hideOnError = [weatherIcon, temperature, weatherDescription, wind, humidity];

const changeQuoteButton = document.querySelector('.change-quote');

const audio = new Audio();
const playButton = document.querySelector('.play');
const playNextButton = document.querySelector('.play-next');
const playPrevButton = document.querySelector('.play-prev');
const playListElementOuter = document.querySelector('.play-list');
let playlistArray = [];
let trackNumber = 0;
let isAudioPlaying = false;

const trackPlace = document.querySelector('.player-track');
const trackLengthPlace = document.querySelector('#duration');
const currentPlayTime = document.querySelector('#timer');
const progressBar = document.querySelector('#progress');
const progressBarContainer = document.querySelector('.player-progress-bar');
const volumeButton = document.querySelector('.player-volume-muteButton');
const volumeBar = document.querySelector('.player-volume-bar');
const volumeIcon = document.querySelector('.player-volume-icon');
const muteIcon = document.querySelector('.player-muted-icon');
let currentPlayProgress;
let volumeValue = volumeBar.value;

const overlayElement = document.querySelector('.overlay');
const todoContainer = document.querySelector('.todo-modal-container');
const todoInput = document.querySelector('.todo-input');
const todoList = document.querySelector('.todo-list');
const todoTitle = document.querySelector('.todo-started-text');
const todoSubtitle = document.querySelector('.todo-sub-text');
const completedLink = document.querySelector('.todo-completed-link');
const completedList = document.querySelector('.completed-list');
let activeTodos = {};
let fulfilledTodos = {};
let activeTodosCount = 0;
let fulfilledTodosCount = 0;

const settingsOverlay = document.querySelector('.overlay-settings');
const settingsModal = document.querySelector('.settings-modal-container');
const playerBlock = document.querySelector('.player');
const weatherBlock = document.querySelector('.weather');
const timeBlock = document.querySelectorAll('.time,date');
const greetingBlock = document.querySelector('.greeting-container');
const quoteBlock = document.querySelectorAll('.change-quote,.quote,.author');
const todoBlock = document.querySelector('.todo');

const settingsPlayerButtons = document.querySelectorAll('input[name="player"]');
const settingsWeatherButtons = document.querySelectorAll('input[name="weather"]');
const settingsTimeButtons = document.querySelectorAll('input[name="time"]');
const settingsGreetingButtons = document.querySelectorAll('input[name="greeting"]');
const settingsQuiteButtons = document.querySelectorAll('input[name="quote"]');
const settingsTodoButtons = document.querySelectorAll('input[name="todo"]');
const settingsLanguageButtons = document.querySelectorAll('input[name="language"]');
const settingsBackgroundSourceButtons = document.querySelectorAll('input[name="backgroundsource"]');
const buttonsGroups = [settingsPlayerButtons, settingsWeatherButtons, settingsTimeButtons, settingsGreetingButtons, settingsQuiteButtons, settingsTodoButtons, settingsLanguageButtons, settingsBackgroundSourceButtons];

const textSettingsTitle = document.querySelector('.settings-title');
const textSettingsLanguage = document.querySelector('.settings-language');
const textSettingsPlayer = document.querySelector('.settings-player');
const textSettingsWeather = document.querySelector('.settings-weather');
const textSettingsTime = document.querySelector('.settings-time');
const textSettingsGreeting = document.querySelector('.settings-greeting');
const textSettingsBackgroundSource = document.querySelector('.settings-backgroundsource');
const textSettingsTag = document.querySelector('.settings-tag');
const textSettingsQuote = document.querySelector('.settings-quote');
const textSettingsTodo = document.querySelector('.settings-todo');
const textSettingsOn = document.querySelectorAll('.radio-text-on');
const textSettingsOff = document.querySelectorAll('.radio-text-off');
const textSettingsEn = document.querySelector('.radio-text-en');
const textSettingsRu = document.querySelector('.radio-text-ru');
const greetingPlaceholder = document.querySelector('.name');
const weatherInput = document.querySelector('.city');
const tagInput = document.querySelector('.custom-tag');

const screenSizeUpIcon = document.querySelector('.screensize-up-icon');
const screenSizeDownIcon = document.querySelector('.screensize-down-icon');

let state = {
    options: {
        language: 'en',
        player: 'true',
        weather: 'true',
        time: 'true',
        greeting: 'true',
        backgroundsource: 'github',
        quote: 'true',
        todo: 'true',
    },
    tag: ''
};


//Local storage usage
function setLocalStorage() {
    localStorage.setItem('username', document.querySelector('.name').value);
    localStorage.setItem('city', cityInput.value);
    localStorage.setItem('todos', JSON.stringify(activeTodos));
    localStorage.setItem('todos-complete', JSON.stringify(fulfilledTodos));
    localStorage.setItem('settings-state', JSON.stringify(state));
}

function getLocalStorage() {
    if (localStorage.getItem('username')) document.querySelector('.name').value = localStorage.getItem('username');
    if (localStorage.getItem('city')) {
        cityInput.value = localStorage.getItem('city');
        getWeather();
    };
    if (localStorage.getItem('todos')) {
        activeTodos = JSON.parse(localStorage.getItem('todos'));
        fulfilledTodos = JSON.parse(localStorage.getItem('todos-complete'));
        let values = Object.values(activeTodos);

        if (Object.keys(fulfilledTodos).length || Object.keys(activeTodos).length) {
            addTodosListTitle();
        }

        checkCompleted();
        checkActive();
        values.forEach((value) => {
            addTodosListTitle();
            addTodoItem(value);
        })
    }

    if (localStorage.getItem('todos-complete')) {
        fulfilledTodos = JSON.parse(localStorage.getItem('todos-complete'));
        let values = Object.values(fulfilledTodos);
        values.forEach((value) => {
            addCompleted(value);
        })
    }

    if (localStorage.getItem('settings-state')) {
        state = JSON.parse(localStorage.getItem('settings-state'));
        let keys = Object.keys(state.options);
        keys.forEach((key) => {
            changeRadio(key, state.options[key]);
            changeState(key, state.options[key]);
        })
        tagInput.value = state.tag; 
    }
}

window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);

//Date and time
function showTime() {
    const fullDate = new Date();
    timeElement.textContent = fullDate.toLocaleTimeString();

    showDate();
    showGreeting();
    setTimeout(showTime, 1000);
}

function showDate() {
    const options = {month: 'long', day: 'numeric', weekday: 'long'};
    if (state.options.language === 'en') {
        dateElement.textContent = fullDate.toLocaleDateString('en-US', options);
    } else {
        dateElement.textContent = fullDate.toLocaleDateString('ru-RU', options);    
    }
}

showTime();

//Greeting
function showGreeting() {
    const greetings = ['Good night', 'Good morning', 'Good afternoon', 'Good evening', 'Доброй ночи', 'Доброе утро', 'Добрый день', 'Добрый вечер'];

    if (state.options.language === 'en') {
        greeting.textContent = greetings[Math.floor(hours / 6)];
    } else {
        greeting.textContent = greetings[Math.floor(hours / 6) + 4];
    }

    if (document.querySelector('.name').value) greeting.textContent += ',';
}

function getTimeOfDay() {
    const greetingOptions = ['night', 'morning', 'afternoon', 'evening'];
    return greetingOptions[Math.floor(hours / 6)];
}

setInterval(showGreeting, 60000);

//Background images gallery
function setBackgroundImage () {
    const image = new Image();
    const timeOfDay = getTimeOfDay();

    image.src = `https://raw.githubusercontent.com/haslie22/momentum-backgrounds/main/${timeOfDay}/${backgroundNumber}.webp`
    image.onload = () => {
        bodyElement.style.backgroundImage = `url('https://raw.githubusercontent.com/haslie22/momentum-backgrounds/main/${timeOfDay}/${backgroundNumber}.webp')`;
    }
}

function getRandomNum(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
}

function setBackgroundNumber() {
    backgroundNumber = String(getRandomNum(1, 20)).padStart(2, '0');

    setBackgroundImage();
}

function getSlideNext() {
    if (state.options.backgroundsource === 'github') {
        backgroundNumber = +backgroundNumber + 1 > 20 ? '01' : String(+backgroundNumber + 1).padStart(2, '0');
        setBackgroundImage();
    } else if (state.options.backgroundsource === 'flickr') {
        getPicsFlickr(state.tag);
    } else {
        getPicsUnsplash(state.tag);
    }
}

function getSlidePrev() {
    if (state.options.backgroundsource === 'github') {
        backgroundNumber = +backgroundNumber - 1 < 1 ? '20' : String(+backgroundNumber - 1).padStart(2, '0');
        setBackgroundImage();
    } else if (state.options.backgroundsource === 'flickr') {
        getPicsFlickr(state.tag);
    } else {
        getPicsUnsplash(state.tag);
    }
}

setBackgroundNumber();

bgArrowPrev.addEventListener('click', getSlidePrev);
bgArrowNext.addEventListener('click', getSlideNext);

//Weather widget
async function getWeather() {
    let url;

    if (state.options.language === 'en') {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&lang=en&appid=15c762d2ff5ec7963bad1a1377ce816e&units=metric`;
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&lang=ru&appid=15c762d2ff5ec7963bad1a1377ce816e&units=metric`;
    }

    const response = await fetch(url);
    const data = await response.json();

    weatherIcon.className = 'weather-icon owf';
    
    try {
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    } catch {
        if (state.options.language === 'en') {
            document.querySelector('.weather-error').textContent = `Error! City not found for '${cityInput.value}'`;
        } else {
            document.querySelector('.weather-error').textContent = `Ошибка! Город '${cityInput.value}' не найден!`;
        }
        hideOnError.forEach(e => e.classList.add('js-hide'));
        return;
    }

    hideOnError.forEach(e => e.classList.remove('js-hide'));
    document.querySelector('.weather-error').textContent = '';
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    if (state.options.language === 'en') {
        wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
        humidity.textContent = `Humidity: ${Math.round(data.main.humidity)}%`;
    } else {
        wind.textContent = `Скорость ветра: ${Math.round(data.wind.speed)} м/с`;
        humidity.textContent = `Влажность: ${Math.round(data.main.humidity)}%`;
    }
}

getWeather();
setInterval(getWeather, 60000 * 60);

cityInput.addEventListener('change', getWeather);

//Quotes widget
async function getQuotes() {
    const quotePlace = document.querySelector('.quote');
    const authorPlace = document.querySelector('.author');  
    let quotes;
    if (state.options.language === 'en') {
        quotes = './assets/quotes/quotes_en.json';
    } else {
        quotes = './assets/quotes/quotes_ru.json';
    }
    
    let quoteNumber = getRandomNum(0, 40);

    const res = await fetch(quotes);
    const data = await res.json(); 
    
    quotePlace.textContent = data[quoteNumber]['text'];
    authorPlace.textContent = data[quoteNumber]['author'];
}

getQuotes();

changeQuoteButton.addEventListener('click', getQuotes);

//Simple audio player
function togglePlay() {
    if (!isAudioPlaying) {
        playAudio();
        isAudioPlaying = true;
    }
    else {
        pauseAudio();
        isAudioPlaying = false;
    }
}

function playAudio() {
    audio.src = playList[trackNumber].src;
    audio.currentTime = currentPlayProgress || 0;
    audio.play();
    playButton.classList.add('pause');
    isAudioPlaying = true;
    setCurrentTrack();
    setCurrentPlayTime();
    changeActiveSongStyle();
}

function pauseAudio() {
    const playlistItems = document.querySelectorAll('.play-item');

    audio.pause();
    playButton.classList.remove('pause');
    playlistItems[trackNumber].classList.remove('button-active');

    isAudioPlaying = false;
    currentPlayProgress = audio.currentTime;
}

function playNext() {
    trackNumber = +trackNumber + 1 >= playList.length ? 0 : ++trackNumber;
    currentPlayProgress = 0;
    playAudio();
}

function playPrev() {
    trackNumber = +trackNumber <= 0 ? playList.length - 1 : --trackNumber;
    currentPlayProgress = 0;
    playAudio();
}

function createPlaylist() {
    for (let i = 0; i < playList.length; i++) {
        const playlistItemContainer = document.createElement('div');
        playlistItemContainer.classList.add('play-item-container');
        playListElementOuter.appendChild(playlistItemContainer);

        const playlistItem = document.createElement('input');
        playlistItem.type = 'radio';
        playlistItem.name = 'song';
        playlistItem.id = `song-${i}`;

        const playlistLabel = document.createElement('label');
        playlistLabel.setAttribute('for', `song-${i}`);
        playlistLabel.classList.add('play-item');
        playlistLabel.textContent = playList[i].title;

        playlistItemContainer.appendChild(playlistItem);
        playlistItemContainer.appendChild(playlistLabel);
        playlistArray[i] = playlistItem;
    }
}

function playOnSongClick(e) {
    if (isAudioPlaying) {
        if (+e.target.id.slice(-1) === trackNumber) {
            pauseAudio();
        } else {
            currentPlayProgress = 0;
            trackNumber = +e.target.id.slice(-1);
            playAudio();
        } 
    } else {
        if (+e.target.id.slice(-1) === trackNumber) {
            playAudio();
        } else {
        currentPlayProgress = 0; 
        trackNumber = +e.target.id.slice(-1);
        playAudio();
        }
    }
}

function changeActiveSongStyle() {
    const playlistItems = document.querySelectorAll('.play-item');
    playlistItems.forEach(item => item.classList.remove('item-active', 'button-active'));
    playlistItems[trackNumber].classList.add('item-active', 'button-active');
}

createPlaylist();

playButton.addEventListener('click', togglePlay);
playNextButton.addEventListener('click', playNext);
playPrevButton.addEventListener('click', playPrev);
audio.addEventListener('ended', playNext);
document.getElementsByName('song').forEach((el) => el.addEventListener('click', playOnSongClick));

//Advanced audio player
function setCurrentTrack() {
    let currentTrack = playList[trackNumber].title;
    let currentTrackLength = playList[trackNumber].duration;

    trackPlace.textContent = currentTrack;
    trackLengthPlace.textContent = currentTrackLength;
}

function getCurrentPlayTime() {
    currentPlayProgress = Math.floor(audio.currentTime);
    return currentPlayProgress;
}

function formatСurrentPlayTime() {
    let x = getCurrentPlayTime();
    switch (true) {
        case (x >= 0 && x < 10):
            return `00:0${x}`;
        case (x >= 10 && x < 60):
            return `00:${x}`;
        case (x >= 60 && x < 600):
            if ((x % 60) < 10) return `0${Math.trunc(x / 60)}:0${x % 10}`
            return `0${Math.trunc(x / 60)}:${x % 60}`;
    }
}

function setCurrentPlayTime() {
    currentPlayTime.textContent = formatСurrentPlayTime();
    setTimeout(setCurrentPlayTime, 1000);
}

function changeProgressBarOnPlay() {
    progressBar.style.width = audio.currentTime / audio.duration * 100 + '%';
    setTimeout(changeProgressBarOnPlay, 500);
}

function changeProgressBarOnClick(e) {
    const progressBarWidth = window.getComputedStyle(progressBarContainer).width;

    if (!isNaN(audio.duration)) {
        audio.currentTime = e.offsetX / parseInt(progressBarWidth) * audio.duration;
        progressBar.style.width = audio.currentTime / audio.duration * 100 + '%';
    } else {
        audio.currentTime = e.offsetX / parseInt(progressBarWidth) * 40;
        progressBar.style.width = audio.currentTime / 40 * 100 + '%';
    }
    currentPlayProgress = audio.currentTime;
    return audio.currentTime;
}

function colorVolumeBarOnChange() {
    volumeBar.style.background = `linear-gradient(to right, #fff 0%, #fff ${volumeBar.value * 100}%, #ffffff80 ${volumeBar.value *100}%, #ffffff80 100%)`;
}

function changeVolume() {
    audio.volume = volumeBar.value;
    if (audio.volume === 0) {
        audio.muted = true;
        volumeIcon.classList.add('js-hide');
        muteIcon.classList.remove('js-hide');
    } else {
        audio.muted = false;
        volumeIcon.classList.remove('js-hide');
        muteIcon.classList.add('js-hide');
    }

    colorVolumeBarOnChange();
}

function toggleVolume() {
    if (audio.muted) {
        audio.muted = false;
        volumeBar.value = volumeValue;
        audio.volume = volumeBar.value;
        volumeIcon.classList.remove('js-hide');
        muteIcon.classList.add('js-hide');
        colorVolumeBarOnChange();
    }
    else {
        volumeValue = volumeBar.value;
        volumeBar.value = 0;
        audio.muted = true;
        volumeIcon.classList.add('js-hide');
        muteIcon.classList.remove('js-hide');
        colorVolumeBarOnChange();
    }
}

setCurrentTrack();
setCurrentPlayTime();
colorVolumeBarOnChange();
changeProgressBarOnPlay();

progressBarContainer.addEventListener('click', changeProgressBarOnClick);
volumeBar.addEventListener('input', changeVolume);
volumeButton.addEventListener('click', toggleVolume);

//Todo app
(function () {
    function handleTodoModal(e) {
        todoContainer.classList.toggle('js-modal-active');
        overlayElement.classList.toggle('overlay-active');
    }
    
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('overlay-active') || event.target.classList.contains('todo-icon')) 
        handleTodoModal();
    });
    
}());

function submitTodoItem(e) {
    if (e.key === 'Enter') {
        let newTodoInputValue = todoInput.value;
        activeTodosCount++;
        activeTodos[`todo-${activeTodosCount}`] = todoInput.value;

        addTodosListTitle();
        addTodoItem(newTodoInputValue);
        todoInput.value = '';
        newTodoInputValue = '';
    }
}

function addTodosListTitle() {
    if (state.options.language === 'en') {
        todoTitle.textContent = 'To-dos for today:'
    } else {
        todoTitle.textContent = 'Задачи на сегодня:'
    }
    todoTitle.style.marginBottom = '10px';
    todoSubtitle.classList.add('js-hide');
}

function addTodoItem(newTodo) {
    const newTodoItem = document.createElement('li');
    const newTodoCheckbox = document.createElement("div");
    const newTodoCross = document.createElement("div");
    const crossIcon = document.createElement("img");
    const newTodoBio = document.createElement("span");

    newTodoItem.classList.add('todo-item');
    newTodoCheckbox.classList.add('todo-check-button');
    newTodoCross.classList.add('todo-cross');
    newTodoBio.classList.add('todo-bio');

    crossIcon.src = './assets/svg/delete-todo.svg';
    crossIcon.style.position = 'absolute';
    crossIcon.style.top = '2px';
    crossIcon.style.right = '2px';

    newTodoItem.textContent = newTodo;

    todoList.prepend(newTodoItem);
    newTodoItem.append(newTodoCheckbox);
    newTodoCross.append(crossIcon);
    newTodoItem.append(newTodoCross);
    activeTodosCount++;

    checkActive();
    removeCompletedTodo(newTodoCheckbox);
    deleteTodoItem(newTodoCross);
}

function getObjKey(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value);
}

function removeCompletedTodo(button) {
    button.addEventListener('click', (el) => {
        let parent = el.target.parentElement;
        let key = getObjKey(activeTodos, parent.textContent);

        activeTodosCount--;
        fulfilledTodosCount++;
        fulfilledTodos[key] = parent.textContent;
        Reflect.deleteProperty(activeTodos, key);
        parent.classList.add('todo-completed');
        button.classList.add('todo-check-button-checked');
        addCompleted(parent.textContent);

        setTimeout(() => {
            parent.remove();
        }, 400);
        checkCompleted();
        checkActive();
    })
}

function deleteTodoItem(button) {
    button.addEventListener('click', (el) => {
        let ancestor = el.target.parentElement.parentElement;
        let key = getObjKey(activeTodos, ancestor.textContent);
        activeTodosCount--;
        
        Reflect.deleteProperty(activeTodos, key);
        ancestor.remove();
        checkActive();

        if ((!Object.keys(activeTodos).length) && (!Object.keys(fulfilledTodos).length)) restoreText();
    })
}

function restoreTodoItem(e) {
    let parent = e.target.parentElement;
    let key = getObjKey(fulfilledTodos, parent.textContent);
    activeTodosCount++;
    fulfilledTodosCount--;
    
    activeTodos[`todo-${activeTodosCount}`] = parent.textContent;
    addTodoItem(parent.textContent);

    Reflect.deleteProperty(fulfilledTodos, key);
    parent.remove();
    checkCompleted();
    checkActive();
}

function restoreText() {
    todoSubtitle.innerHTML = '<b><br>Add your tasks. Organize your <br>life. Achieve more every day.<br><br><br></b> Write your first to-do and press <u><b>Enter</b></u> <br>to get started';
    todoSubtitle.classList.remove('js-hide');
}

function checkCompleted() {
    if (Object.keys(fulfilledTodos).length) {
        showCompleted();
    } else {
        hideCompleted();
    }
}

function checkActive() {
    if (Object.keys(activeTodos).length) {
        showActiveTitle();
    } else {
        hideActiveTitle();
    }
}

function addCompleted(todoText) {
    const completedList = document.querySelector('.completed-list');
    const newCompletedItem = document.createElement('li');
    const newCompletedCheckbox = document.createElement("div");
    const newCompletedBio = document.createElement("span");

    newCompletedItem.classList.add('todo-item', 'todo-fulfilled');
    newCompletedCheckbox.classList.add('todo-check-button', 'todo-check-button-checked');
    newCompletedBio.classList.add('todo-bio');

    newCompletedItem.textContent = todoText;

    completedList.append(newCompletedItem);
    newCompletedItem.append(newCompletedCheckbox);

    newCompletedCheckbox.addEventListener('click', restoreTodoItem);
}

function showCompleted() {
    completedLink.classList.remove('js-hide');
    completedLink.classList.add('todo-completed-link-after');
    completedList.classList.remove('js-hide');
    completedList.classList.add('completed-list-after');
}

function hideCompleted() {
    completedLink.classList.add('js-hide');
    completedLink.classList.remove('todo-completed-link-after');
    completedList.classList.add('js-hide');
    completedList.classList.remove('completed-list-after');
}

function showActiveTitle() {
    todoTitle.classList.remove('js-hide');
}

function hideActiveTitle() {
    todoTitle.classList.add('js-hide');
}

todoInput.addEventListener('keypress', submitTodoItem);

//Settings
(function () {
    function handleSettingsModal(e) {
        settingsModal.classList.toggle('js-modal-active');
        settingsOverlay.classList.toggle('overlay-settings-active');
    }
    
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('overlay-settings-active') || event.target.classList.contains('settings-icon')) 
        handleSettingsModal();
    });
    
}());

function findSelected(e) {
    if (e.target.checked) {
        changeState(e.target.name, e.target.value);
    }
}

function changeState(stateName, stateValue) {
    state.options[stateName] = stateValue;

    switch (stateName) {
        case 'language':
            stateValue === 'en' ? setLanguageSettings('en') : setLanguageSettings('ru');
            break;
        case 'player': 
            stateValue === 'true' ? playerBlock.classList.remove('js-hide-block') : playerBlock.classList.add('js-hide-block');
            break;
        case 'weather': 
            stateValue === 'true' ? weatherBlock.classList.remove('js-hide-block') : weatherBlock.classList.add('js-hide-block');
            break;
        case 'time': 
            stateValue === 'true' ? timeBlock.forEach(x => x.classList.remove('js-hide-block')) : timeBlock.forEach(x => x.classList.add('js-hide-block'));
            break;
        case 'greeting': 
            stateValue === 'true' ? greetingBlock.classList.remove('js-hide-block') : greetingBlock.classList.add('js-hide-block');
            break;
        case 'quote': 
            stateValue === 'true' ? quoteBlock.forEach(x => x.classList.remove('js-hide-block')) : quoteBlock.forEach(x => x.classList.add('js-hide-block'));
            break;
        case 'todo': 
            stateValue === 'true' ? todoBlock.classList.remove('js-hide-block') : todoBlock.classList.add('js-hide-block');
            break;
        case 'backgroundsource':
            if (stateValue === 'github') {
                setBackgroundNumber();
                tagInput.disabled = true;
                textSettingsTag.classList.add('js-hide-block');
            } else if (stateValue === 'flickr') {
                getPicsFlickr(state.tag);
                tagInput.disabled = false;
                textSettingsTag.classList.remove('js-hide-block');
            } else {
                getPicsUnsplash(state.tag);
                tagInput.disabled = false;
                textSettingsTag.classList.remove('js-hide-block');
            }

    }

    
}

function changeRadio (key, value) {
    document.querySelector(`input[name="${key}"][value="${value}"]`).checked = true;
}

buttonsGroups.forEach(group => {
    for (let item of group) {
        item.addEventListener('click', findSelected);
    }
});

//App translation
function setLanguageSettings(lang) {
    if (lang === 'ru') {
        textSettingsTitle.textContent = 'Настройки';
        textSettingsLanguage.textContent = 'Язык';
        textSettingsPlayer.textContent = 'Плеер';
        textSettingsWeather.textContent = 'Погода';
        textSettingsTime.textContent = 'Время';
        textSettingsGreeting.textContent = 'Приветствие';
        textSettingsBackgroundSource.innerHTML = 'Фоновое <br> изображение';
        textSettingsTag.textContent = 'Тег';
        textSettingsQuote.textContent = 'Цитата дня';
        textSettingsTodo.textContent = 'Список задач';
        textSettingsEn.textContent = 'Анг';
        textSettingsRu.textContent = 'Рус';
        textSettingsOn.forEach((item) => item.textContent = 'Вкл');
        textSettingsOff.forEach((item) => item.textContent = 'Выкл');
        greetingPlaceholder.placeholder = 'введите ваше имя';
        if (weatherInput.value === 'Minsk') {
            weatherInput.value = 'Минск';
        }
        tagInput.placeholder = 'Добавьте тег';

        showDate();
        showGreeting();
        getWeather();
        getQuotes();
    } if (lang === 'en') {
        textSettingsTitle.textContent = 'Settings';
        textSettingsLanguage.textContent = 'Language';
        textSettingsPlayer.textContent = 'Player';
        textSettingsWeather.textContent = 'Weather';
        textSettingsTime.textContent = 'Time';
        textSettingsGreeting.textContent = 'Greeting';
        textSettingsBackgroundSource.textContent = 'Background source';
        textSettingsTag.textContent = 'Tag';
        textSettingsQuote.textContent = 'Quote';
        textSettingsTodo.textContent = 'To-do';
        textSettingsEn.textContent = 'En';
        textSettingsRu.textContent = 'Ru';
        textSettingsOn.forEach((item) => item.textContent = 'On');
        textSettingsOff.forEach((item) => item.textContent = 'Off');
        greetingPlaceholder.placeholder = 'enter your name';
        if (weatherInput.value === 'Минск') {
            weatherInput.value = 'Minsk';
        }
        tagInput.placeholder = 'Add your tag';

        showDate();
        showGreeting();
        getWeather();
        getQuotes();
    }
}


//Getting background image from APIs
async function getPicsUnsplash(tagName) {
    const image = new Image();
    const tag = tagName || getTimeOfDay();
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${tag}&client_id=mtIJ3S6yvj7Bf8U5y4SqcEqInoA6qIl5E9YtvWUD374`;
    const res = await fetch(url);
    const data = await res.json();
    
    try {
        image.src = data.urls.regular;
    } catch {
        if (res.status === 403) {
            alert('Ошибка доступа к Unsplash :(\nПожалуйста, повторите попытку позже!');
            changeRadio('backgroundsource', 'github');
            changeState('backgroundsource', 'github');    
        }; 
        if (res.status === 404) {
            alert('Кажется, по этому тегу изображения не найдены :(\nПопробуйте ввести другой тег!');
        };
        state.tag = '';
        tagInput.value = '';
    }

    image.onload = () => {
        bodyElement.style.backgroundImage = `url('${data.urls.regular}')`;
    }
}

async function getPicsFlickr(tagName) {
    const image = new Image();
    const tag = tagName || getTimeOfDay();
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=a1f1389f7518754845ff2a111bcc1df9&tags=${tag}&extras=url_l&format=json&nojsoncallback=1`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.stat === 'fail') {
        alert('Ошибка доступа к Flickr :(\nПожалуйста, повторите попытку позже!');
        changeRadio('backgroundsource', 'github');
        changeState('backgroundsource', 'github');
        }

    try {
        image.src = data.photos.photo[getRandomNum(0, 99)].url_l;
    } catch {
        alert('Кажется, по этому тегу изображения не найдены :(\nПопробуйте ввести другой тег!');
        state.tag = '';
        tagInput.value = '';
    }

    image.onload = () => {
        bodyElement.style.backgroundImage = `url('${data.photos.photo[getRandomNum(0, 99)].url_l}')`;
    }
}

function searchByTag() {
    state.tag = tagInput.value;
    changeState('backgroundsource', state.options['backgroundsource']);
}

tagInput.addEventListener('change', searchByTag);

//Full-screen size app opening
    function handleFullScreenMode() {
        let isFullScreen = document.fullscreenElement;

        if (isFullScreen) {
            document.webkitExitFullscreen();
            screenSizeUpIcon.classList.add('js-hide');
            screenSizeDownIcon.classList.remove('js-hide');
        } else {
            document.documentElement.requestFullscreen();
            screenSizeUpIcon.classList.remove('js-hide');
            screenSizeDownIcon.classList.add('js-hide');
        }
    }
    
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('screensize-icon-container') || event.target.classList.contains('screensize-icon')) 
        handleFullScreenMode();
    });
