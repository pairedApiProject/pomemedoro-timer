const app = {};

app.countdown = 0; // variable to set/clear intervals

app.seconds = 1500; // seconds left on the clock

app.workTime = 25;

app.breakTime = 5;

app.isBreak = true;

app.isPaused = true;

app.status = $("#status");

app.timerDisplay = $(".timerDisplay");

app.startButton = $("#start");

app.resetButton = $("#reset");

app.workMin = $("#workMin");

app.breakMin = $("#breakMin");

app.alarm = $('#alarm');

app.increment = 5;

app.workPlus = $('#workPlus');

app.breakPlus = $('#breakPlus');

app.workMinus = $('#workMinus');

app.breakMinus = $('#breakMinus');

app.apiKey = 'k7mCxvFuj9fH4f1oknjhDcLF11W7hyhF';

app.minutes = '';

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

app.timerLogic = () => {
    

};

/* EVENT LISTENERS FOR START AND RESET BUTTONS */
app.timerButtons = () => {
    app.start.on('click', () => {
        clearInterval(app.countdown);
        app.isPaused = !app.isPaused;
        if (!app.isPaused) {
            app.countdown = setInterval(app.timerButtons, 1000);
        }
    })

    resetBtn.on('click', () => {
        clearInterval(app.countdown);
        app.seconds = app.workTime * 60;
        app.countdown = 0;
        app.isPaused = true;
        app.isBreak = true;
    })
};

/* TIMER - HANDLES COUNTDOWN */
app.timerCountdown = () => {
    app.seconds--;
    if (app.seconds < 0) {
        clearInterval(app.countdown);
        // alarm.currentTime = 0;
        app.alarm.play();
        
        if (app.isBreak) {
            app.seconds = app.breakTime * 60;
        } else {
            app.seconds = app.workTime * 60;
        }

        app.isBreak = !app.isBreak;
        app.countdown = setInterval(app.timerButtons, 1000);
    }
};

app.incrementFunctionality = () => {
    const incrementFunctions = {
        workPlus: () => { 
            app.workTime = Math.min(app.workTime + app.increment, 60);
        },
        workMinus: () => {
            app.workTime = Math.max(app.workTime - app.increment, 5);
        },
        breakPlus: function () {
            app.breakTime = Math.min(app.breakTime + app.increment, 60);
        },
        breakMinus: () => {
            app.breakTime = Math.max(app.breakTime - app.increment, 5);
        }
    };

    for (let key in incrementFunctions) {
        if (incrementFunctions.hasOwnProperty(key)) {
            console.log("it worked");
            let buttonId = key.toString();
            $(`#${key}`).on('click', function() {
                incrementFunctions[buttonId]();
            });
        }
    }
}
app.updateHtml = () => {
    app.minutes = Math.floor(seconds / 60);
    remainderSeconds = seconds % 60;
    timerDisplay.textContent = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
};

app.toDoList = () => {
    $('form').on('submit', function(e) {
        e.preventDefault();

        if ($('input').val() !== '') {
            // store what the user typed in a variable
            const toDoItem = $('input').val();

            $('ul').append("<li> <span class='fa fa-square-o'></span> " + toDoItem + "</li>");

            // create obj that contains toDoItems
            const toDoObj = {
              description: toDoItem,
              completed: false,
            };
            // push new object into my database
            app['dbRef'].push(toDoObj);
            
            // clear input
            $('input').val('');
        };

        app['dbRef'].on('value', (data) => {
            const toDoData = data.val();
            console.log(data.val());
          
            const toDoArray = [];
      
            for (let property in toDoData) {
              toDoArray.push(`<li><span class="fa fa-square-o"></span> ${toDoData[property].description}</li>`);
            };
      
            $('ul').empty();
      
            toDoArray.forEach(item => {
                console.log(item);
              $('ul').append(item);
            });
        });

        $('ul').on('click', 'li', function() {
            const checkBox = $(this).find('.fa');
            checkBox.toggleClass("fa-square-o fa-check-square-o");
            $(this).toggleClass("text-muted")
        });
    });
};

app.init = () => {
    app.dbRef = firebase.database().ref();
    app.toDoList();
    // keep this api call here, so gif appears on page load
    app.giphy();
    app.getButtonValue();
    app.incrementFunctionality();
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
