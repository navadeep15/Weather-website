const express=require("express")
const https=require("https")
const bodyParser=require("body-parser")

const app=express()

app.use(bodyParser.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html")

})

app.post("/", function(req, res) {
    const query = req.body.cityName;
    const apiKey = "832c7d5ad97f3048dc3bb20450098e5c";  // Hardcoded here for clarity; ensure this is correct
    const unit = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;

    https.get(url, (response) => {
        console.log(`Status Code: ${response.statusCode}`);

        if (response.statusCode !== 200) {
            res.write(`<p>Error: Unable to fetch weather data. Server responded with status: ${response.statusCode}</p>`);
            res.send();
            return; // Stop further execution in this callback
        }

        response.on("data", function(data) {
            const weatherData = JSON.parse(data);
            const temperature = weatherData.main.temp;
            const desc = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Weather Result</title>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
                            color: #ffffff;
                            margin: 0;
                            padding: 20px;
                            text-align: center;
                            height: 100vh;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                        }
                        p, h1 {
                            margin: 10px 0;
                        }
                        img {
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <h1>The Weather in ${query}</h1>
                    <p>The temperature is ${temperature}°C.</p>
                    <p>The weather is currently described as: ${desc}.</p>
                    <img src="${imgURL}" alt="Weather icon">
                </body>
                </html>
            `);
            res.send();
        });
    }).on('error', (e) => {
        console.error(`Error making HTTP request: ${e.message}`);
        res.send("<p>Failed to retrieve weather data.</p>");
    });
});





app.listen(3000,function(){
    console.log("server started at port 3000")
})


