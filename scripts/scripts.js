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


app.giphy = () => {
        $.ajax({
        url: `https://api.giphy.com/v1/gifs/search`,
        method: 'GET',
        dataType: 'json',
        data: {
            api_key: app.apiKey,
            q: 'animals'
        }
    }).then(result => {
        console.log(result.data);

    // FOR ARRAY -> OBJECTS
    const objectArray = result.data;

    const imageArray = objectArray.map((value) => {
        return value.images['downsized'].url;
    });

    
    let randomImage = Math.floor( Math.random() * imageArray.length);
    let img = imageArray[randomImage];
    
    console.log(img);
    $('.gifContainer').html(`<img src="${img}">`);

})};

app.getGifs = (category) => {
    $(`button[id=${category}]`).on('submit', event => {
        event.preventDefault();
        console.log(this);
        app.giphy();
        // $('.gifContainer').html(`<img src="${imageArray}">`);

    })
}

$("button").click(function (e) {
    e.preventDefault();
    $.ajax({
        type: "GET",
        url: `https://api.giphy.com/v1/gifs/search`,
        data: {
            q: $(this).val(),
            api_key: app.apiKey
        }
        
    }).then(result => {
        console.log(`success!`, result);

        const objectArray = result.data;

        const imageArray = objectArray.map((value) => {
            return value.images['downsized'].url;
        });

        let randomImage = Math.floor(Math.random() * imageArray.length);
        let img = imageArray[randomImage];

        console.log(img);
        $('.gifContainer').html(`<img src="${img}">`);
    })
});

app.init = () => {
    app.dbRef = firebase.database().ref();
    app.giphy();
};

$(document).ready( () => {
    firebase.initializeApp(app.firebaseConfig);
    app.init();

});

