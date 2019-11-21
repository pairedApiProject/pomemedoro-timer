const app = {};

app.apiKey = 'k7mCxvFuj9fH4f1oknjhDcLF11W7hyhF';

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
    $("button").on('click', function (e) {
        e.preventDefault();

        app.searchTerm = $(this).val();
        
        app.giphy(app.searchTerm);
    });
};

app.init = () => {
    app.dbRef = firebase.database().ref();
    // keep this api call here, so gif appears on page load
    app.giphy();
    app.getButtonValue();
};

$(document).ready( () => {
    firebase.initializeApp(app.firebaseConfig);
    app.init();
});

