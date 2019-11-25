const app = {};

// start of properties for timer //
app.countdown = 0;
    
app.seconds = 1500;

app.workTime = 25;

app.breakTime = 5;

app.isWorkTime = true;

app.isPaused = true;

app.status = $('.status');

app.timerDisplay = $('.timerDisplay');

app.startButton = $('#start');

app.resetButton = $('#reset');

app.workMin = $('#workMin');

app.breakMin = $('#breakMin');

app.alarm = $('#alarm');

app.increment = 5;

app.workPlus = $('#workPlus');

app.breakPlus = $('#breakPlus');

app.workMinus = $('#workMinus');

app.breakMinus = $('#breakMinus');

app.gifButtons = $('.buttonContainer button');

app.gifContainer = $('.gifContainer');

app.apiKey = 'k7mCxvFuj9fH4f1oknjhDcLF11W7hyhF';

app.minutes = 0;

app.remainderSeconds = 0;
// end of properties for timer //

app.firebaseConfig = {
    apiKey: 'AIzaSyAZDtWtR2JE52zQWdRGBm0huf5XZ2dEGWI',
    authDomain: 'pomodoroapp-b07bd.firebaseapp.com',
    databaseURL: 'https://pomodoroapp-b07bd.firebaseio.com',
    projectId: 'pomodoroapp-b07bd',
    storageBucket: 'pomodoroapp-b07bd.appspot.com',
    messagingSenderId: '650747741337',
    appId: '1:650747741337:web:76dda3ce7fe846137f2408'
};

app.callGiphyAPI = searchTerm => {
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
    });
};

app.appendGif = (gif) => {
    app.gifContainer.html(`<img src=${gif.url}>`);
};

app.filterGif = (gifObject) => {
    const gifWidth = gifObject.images.original.width;
    const gif = gifObject.images.original;

    if (gifWidth < 360) {
        app.callGiphyAPI();
    } else {
        app.appendGif(gif);
    }
};

app.listenForGifTag = () => {
    app.gifButtons.on('click', function(e) {
        e.preventDefault();

        app.searchTerm = $(this).val();
        
        app.callGiphyAPI(app.searchTerm);
    });
};

app.insertErrorMessage = () => {
    const $errorMessage = "<p class='error' role='alert' tabindex='0'>You can only have 5 tasks to complete at a time. Please mark one as complete to remove it from the list</p>";
    if ($('.error').length === 0) {
        $('label[for=userTask]').after($errorMessage);
    }
};

app.userTaskList = () => {
    $('form').on('submit', function(e) {
        e.preventDefault();

        if ($('input').val() !== '') {
            const task = $('input').val();
            const taskObject = {
              description: task
            };

            if ($('ul').children().length <= 4) {
                app.newTask = app.dbOnly.ref('tasks').push(taskObject);
            } else {
                app.insertErrorMessage();
            }

            $('input').val('');
        };

        app.appendNewTasksFromFirebase();
    });
};

app.appendNewTasksFromFirebase = () => {
    const userRefForNewTasks = app.dbOnly.ref('tasks');

    userRefForNewTasks.on('value', (data) => {
        const userTaskData = data.val();
        const userTaskArray = [];

        for (let userTask in userTaskData) {
          userTaskArray.push(`<li data-key=${userTask}><input type='checkbox' id=${userTask} tabindex="0"><label for=${userTask} tabindex="0">${userTaskData[userTask].description}</label></li>`);
        };

        $('ul').empty();

        if ($('ul').children().length <= 4) {
            userTaskArray.forEach(task => {
                $('ul').append(task);
            });
        }
    });
};

app.appendExistingTasksFromFireBase = () => {
    const userRefForExistingTasks = app.dbOnly.ref('tasks');

    userRefForExistingTasks.once('value', (data) => {
        const userTaskData = data.val();
        const userTaskArray = [];

        for (let userTask in userTaskData) {
            userTaskArray.push(`<li data-key=${userTask}><input type='checkbox' id=${userTask} tabindex="0"><label for=${userTask} tabindex="0">${userTaskData[userTask].description}</label></li>`);
        };

        userTaskArray.forEach(task => {
            $('ul').append(task);
        }); 
    });
};

app.taskClickListener  = () => {             
    $('ul').on('click', 'li', function() {
        $(this).toggleClass('taskComplete');

        if ($(this).hasClass('taskComplete')) {
            const $dataKey = $(this).attr('data-key');

            $(this).remove();
            app.dbOnly.ref(`tasks/${$dataKey}`).remove();
        }
    });
};

// start of timer functions //
app.startTimer = () => {
    app.startButton.on('click', () => {
        clearInterval(app.countdown);
        
        app.isPaused = !(app.isPaused);
        
        if (!(app.isPaused)) {
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
        app.isWorkTime = true;
    })
};

app.toggleGifAndButtons = () => {
    if (app.isWorkTime) {
        app.gifButtons.toggle();
        app.gifContainer.empty();
    }

    if (!(app.isWorkTime)) {
        app.gifButtons.toggle();
        app.callGiphyAPI();
        $('html, body').stop().animate({
            scrollTop: ($('.gifContainer').offset().top)
        }, 500, () => {
            app.gifContainer.focus();
        });

    }
};

app.timerCountdown = () => {
    app.seconds--;

    if (app.seconds <= 0) {
        alarm.play();
        app.alarm.currentTime = 0;
        clearInterval(app.countdown);
        app.seconds = (app.isWorkTime ? app.breakTime : app.workTime) * 60;
        app.isWorkTime = !(app.isWorkTime);
        app.countdown = setInterval(app.timerCountdown, 10);
        app.toggleGifAndButtons();
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

    for (let timerFunction in incrementFunctions) {
        if (incrementFunctions.hasOwnProperty(timerFunction)) {
            let buttonId = timerFunction.toString();
            $(`#${timerFunction}`).on('click', function() {
                incrementFunctions[buttonId]();
            });
        }
    }
};


app.buttonDisplay = () => {
    if (app.isPaused && app.countdown === 0) {
        app.startButton.text('Start');
    } else if (app.isPaused && app.countdown !== 0) {
        app.startButton.text('Continue'); 
    } else {
        app.startButton.text('Pause');
    }
};

app.countdownDisplay = () => {
    app.minutes = Math.floor(app.seconds / 60);
    app.remainderSeconds = app.seconds % 60;
    app.timerDisplay.text(`${app.minutes} : ${app.remainderSeconds < 10 ? '0' : ''}${app.remainderSeconds}`);
};

app.updateTimerHTML = () => {
    app.countdownDisplay();
    app.buttonDisplay();
    app.isWorkTime ? app.status.text('Keep Working') : app.status.text('Take a Break!');
    app.workMin.text(app.workTime);
    app.breakMin.text(app.breakTime); 
};
// end of timer functions //

app.init = () => {
    app.dbRef = firebase.database().ref();
    app.dbOnly = firebase.database();
    app.appendExistingTasksFromFireBase();
    app.userTaskList();
    app.taskClickListener();
    app.listenForGifTag();
    app.updateTimerHTML();
    app.incrementFunctionality();
    app.startTimer();
    app.resetTimer();
    app.gifButtons.toggle();
    setInterval(app.updateTimerHTML, 10);
};

$(document).ready( () => {
    firebase.initializeApp(app.firebaseConfig);
    app.init();
});