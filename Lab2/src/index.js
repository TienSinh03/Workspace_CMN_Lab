const express = require('express');
const app = express();
const path = require("path");


app.use(express.json({extended: false }));
app.use(express.static(path.join(__dirname, "views")));
app.set('view engine', 'ejs');
app.set('views', 'src/views')

app.get('/', (req, res) => {
    return res.render('index');
})

app.listen(3000, () => {
    console.log('server is running on port 3000')
})