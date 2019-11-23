const app = {};

// properties for timer //
app.countdown = 0; // variable to set/clear intervals
    
app.seconds = 1500; // seconds left on the clock

app.workTime = 25;

app.breakTime = 5;

app.isBreak = true;

app.canLoadGif = false;

app.isPaused = true;

app.status = $(".status");

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

app.minutes = 0;

app.remainderSeconds = 0;
// properties for timer //

app.firebaseConfig = {
    apiKey: "AIzaSyAZDtWtR2JE52zQWdRGBm0huf5XZ2dEGWI",
    authDomain: "pomodoroapp-b07bd.firebaseapp.com",
    databaseURL: "https://pomodoroapp-b07bd.firebaseio.com",
    projectId: "pomodoroapp-b07bd",
    storageBucket: "pomodoroapp-b07bd.appspot.com",
    messagingSenderId: "650747741337",
    appId: "1:650747741337:web:76dda3ce7fe846137f2408"
};

app.giphy = (searchTerm = 'puppies') => {
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
    
    if (!app.isBreak)   {
        if (imageWidth < 360) {
        app.giphy();
        } else {
            app.appendGif(gif);
        }
    } else {
        $('.gifContainer').empty();
    }
};

app.getButtonValue = () => {
    $(".buttonContainer button").on('click', function (e) {
        e.preventDefault();

        app.searchTerm = $(this).val();
        
        app.giphy(app.searchTerm);
    });
};

app.toDoList = () => {
    $('form').on('submit', function(e) {
        e.preventDefault();

        if ($('input').val() !== '') {
            // store what the user typed in a variable
            const toDoItem = $('input').val();

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
              $('ul').append(item);
            });
        });

        
        
      
    });
};

app.loadPreviousToDoList = () => {
    app['dbRef'].once('value', (data) => {
        const toDoData = data.val();
        console.log(data.val());

        const toDoArray = [];

        for (let property in toDoData) {
            toDoArray.push(`<li><span class="fa fa-square-o"></span> ${toDoData[property].description}</li>`);
        };

        toDoArray.forEach(item => {
            console.log(item);
            $('ul').append(item);
        });
    });
};

app.isToDoComplete = () => {
    $('ul').on('click', 'li', function () {
        console.log('it worked');
        const checkBox = $(this).find('.fa');
        const selectedKey = $(this).data('key');
        // creating a reference to the correct node using the previous variable
        const toDoItemRef = firebase.database().ref(`/${selectedKey}`);
        // getting snapshot of the appropriate node without listening for changes
        // toDoItemRef.once('value', (data) => {
        // grab the data
        // const targeted = data.val();
        // update the complete status of the correct to-do
        // toDoItemRef.update({
        //     complete: !targeted.complete
        // })
        // })
        checkBox.toggleClass("fa-square-o fa-check-square-o");
        $(this).toggleClass("text-muted")
    });
};

// timer functions //
app.startTimer = () => {
    console.log("is paused 1: ", app.isPaused);
    app.startButton.on('click', () => {
        clearInterval(app.countdown);
        app.isPaused = !app.isPaused;
        console.log("is paused 2: ", app.isPaused);
        if (!app.isPaused) {
            console.log("is paused 3: ", app.isPaused);
            app.countdown = setInterval(app.timerCountdown, 10);
        }
    })    
};

app.resetTimer = () => {
    app.resetButton.on('click', () => {
        clearInterval(app.countdown);
        app.seconds = app.workTime * 60;
        app.countdown = 0;
        app.isPaused = true;
        app.isBreak = true;
    })
};

app.timerCountdown = () => {
    app.seconds--;

    if (app.seconds <= 0) {
        clearInterval(app.countdown);
        // alarm.currentTime = 0;
        // app.alarm.play();
        app.seconds = (app.isBreak ? app.breakTime : app.workTime) * 60; 
        app.isBreak = !app.isBreak;
        app.countdown = setInterval(app.timerCountdown, 10);
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
            let buttonId = key.toString();
            $(`#${key}`).on('click', function() {
                incrementFunctions[buttonId]();
            });
        }
    }
};


app.buttonDisplay = () => {
    if (app.isPaused && app.countdown === 0) {
        app.startButton.text("START");
    } else if (app.isPaused && app.countdown !== 0) {
        app.startButton.text("Continue"); 
    } else {
        app.startButton.text("Pause");
    }
};

app.countdownDisplay = () => {
    app.minutes = Math.floor(app.seconds / 60);
    app.remainderSeconds = app.seconds % 60;
    app.timerDisplay.text(`${app.minutes} : ${app.remainderSeconds < 10 ? '0' : ''}${app.remainderSeconds}`);
};

app.updateHTML = () => {
    app.countdownDisplay();
    app.buttonDisplay();
    app.isBreak ? app.status.text("Keep Working") : app.status.text("Take a Break!");

    app.workMin.text(app.workTime);
    app.breakMin.text(app.breakTime); 
};
// timer functions //

app.init = () => {
    app.dbRef = firebase.database().ref();
    app.loadPreviousToDoList();
    app.toDoList();
    app.isToDoComplete();
    // keep this api call here, so gif appears on page load
    app.updateHTML();
    app.giphy();
    app.incrementFunctionality();
    app.startTimer();
    app.resetTimer();
    setInterval(app.updateHTML, 10);
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
