const app = {};

app.token = "-rMIOIVS06GhTaE1W8f4Y0pxOwqU";

app.getToken = $.ajax({
    url: 'https://oauth.reddit.com',
    method: 'GET',
    dataType: 'json',
    headers: {
        Authorization: `bearer ${app.token}`
    }
}).then(data => {
    console.log(data);
});

app.getToken;