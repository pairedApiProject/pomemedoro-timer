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
        console.log(result);

    // const imageToPush = result.data['fixed_height_downsampled_url'];
    // console.log(imageToPush);

    // $('.memeContainer').html(`<img src="${imageToPush}">`);

    // FOR ARRAY -> OBJECTS
    const objectArray = result.data;

    const imageArray = objectArray.map((value) => {
        return value.images['downsized'].url;
    })

    // const getRandomImage = (imageArray) => {
    //     let randomImage = Math.floor( Math.random() * imageArray.length);
    //     let img = imageArray[randomImage];
    //     let imgStr = '<img src ="' + img + '">';
    //     $('.memeContainer').html(`<img src="${imageToPush}">`);

    // };  
    // console.log(resultArray);


    })
};

app.getGifs = () => {
    
}

app.init = () => {
    app.dbRef = firebase.database().ref();
    app.giphy();
};

$(document).ready( () => {
    firebase.initializeApp(app.firebaseConfig);
    app.init();

});

