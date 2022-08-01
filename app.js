const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const { func } = require('assert-plus');
const { render } = require('ejs');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

app.get("/", function(req, res)
{
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res)
{
    let url = "https://api.openweathermap.org/data/2.5/weather?appid=a304b14f73bbd2849e304cce26cebd22&q="+req.body.city+"&units=metric";
    https.get(url, function (api_response)
    {
        // console.log(r.statusCode);
        api_response.on('data', function(data)
        {
            let obj = JSON.parse(data);
            if(obj.cod != 404)
            {
                console.log(obj);
                let city = req.body.city;
                let temp = obj.main.temp;
                let feel = obj.main.feels_like;
                let hum = obj.main.humidity;
                // res.write(`<h1 text-alignment : center>The temperature in ${req.body.city} is ${obj.main.temp} degrees C</h1>`);
                // res.sendFile(__dirname + "/weather.html", {city : city, temp : temp});
                res.render('weather.html', {city : city, temp : temp, feel : feel, hum : hum});
            }
            else
            {
                res.render('failure.html');
            }
        });
    });
});

app.listen(3000 || process.env.PORT , function()
{
    console.log("listening on port 3000!");
});