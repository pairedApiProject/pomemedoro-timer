const app = {};

app.apiKey = 'k7mCxvFuj9fH4f1oknjhDcLF11W7hyhF';

app.timerInterval = new Date();

app.firebaseConfig = {
    apiKey: "AIzaSyAZDtWtR2JE52zQWdRGBm0huf5XZ2dEGWI",
    authDomain: "pomodoroapp-b07bd.firebaseapp.com",
    databaseURL: "https://pomodoroapp-b07bd.firebaseio.com",
    projectId: "pomodoroapp-b07bd",
    storageBucket: "pomodoroapp-b07bd.appspot.com",
    messagingSenderId: "650747741337",
    appId: "1:650747741337:web:76dda3ce7fe846137f2408"
};

app.giphy = (searchTerm = 'pomodoro') => {
    $.ajax({
        url: `https://api.giphy.com/v1/gifs/random`,
        method: 'GET',
        dataType: 'json',
        data: {
            api_key: app.apiKey,
            tag: searchTerm,
            rating: 'G',
            limit: 25
        }
    }).then(result => {
        app.filterGif(result.data);    
})};

app.appendGif = (bigGif) => {
    $('.gifContainer').html(`<img src="${bigGif.url}">`);
};

app.filterGif = (giphyObject) => {
    const imageWidth = giphyObject.images.original.width;
    const gif = giphyObject.images.original;
    
    if (imageWidth < 360) {
        app.giphy();
    } else {
        app.appendGif(gif);
    }
};

app.getButtonValue = () => {
    $(".buttonContainer button").on('click', function (e) {
        e.preventDefault();

        app.searchTerm = $(this).val();
        
        app.giphy(app.searchTerm);
    });
};

app.startTimer = () => {
    
    $('.timerButtons button').on('click', function(e) {
        const $buttonId = $(this).val();
        const $timer = $('#timer');

        e.preventDefault();
        
        console.log($buttonId);

        if ($buttonId === 'start') {
            $timer.text('25:00');
            app.timer(25);
        }

        if ($buttonId === 'shortBreak') {
            $timer.text('5:00');
            app.timer(5);
        }
        
        if ($buttonId === 'longBreak') {
            $timer.text('20:00');
            app.timer(20);
        }
        
        if ($buttonId === 'stop') {
            app.stopInterval();
            $timer.text('25:00');
        }
    })
};

console.log(app.timerInterval.getTime());

app.timer = (minutes) => {
    let duration = moment.duration({
        'minutes': minutes,
        'seconds': 01
    });
  
    const interval = 1;
    let timer = setInterval(function() {
        app.timerInterval = new Date().getTime(interval * 1000);

        duration = moment.duration(duration.asSeconds() - interval, 'seconds');
        let min = duration.minutes();
        let sec = duration.seconds();

        sec--;

        if (min < 0) {
            app.stopInterval();
        }
        if (min < 10 && min.length !== 2) {
            min = '0' + min;
        }
        if (sec < 0 && min !== 0) {
            min --;
            sec = 59;
        } else if (sec < 10 && sec.length !== 2) {
            sec = '0' + sec;
        }

        $('#timer').text(min + ':' + sec);
        
        if (min === 25 && sec === 0)
            app.stopInterval();
    }, 1000);

};

app.stopInterval = () => {
    clearInterval(app.timerInterval);
};

app.init = () => {
    app.dbRef = firebase.database().ref();
    // keep this api call here, so gif appears on page load
    app.giphy();
    app.getButtonValue();
    app.startTimer();
};

$(document).ready( () => {
    firebase.initializeApp(app.firebaseConfig);
    app.init();
});

// timer to blank on page load
// when user clicks a button, it starts countdown from 25 minutes
// increment counter by 1

// button event handler

// own little function
    // when 25 minutes is up, something notifies user to take a break (maybe a sound??? alert???)
    // count down 5 minutes
    // buttons become visible
    // then hide when 5 minutes is up

// own function
    // start 25 minute timer again 
    // increment counter by 1

// once the counter reaches 3
// start a timer for a 20 minute break
// enable buttons again

//repeat
