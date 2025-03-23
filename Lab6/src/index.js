const express = require('express');
const app = express();
const path = require("path");



app.use(express.json({extended: false }));
app.use(express.static(path.join(__dirname, "views")));
app.set('view engine', 'ejs');
app.set('views', 'src/views')

// Chuyen sang dung AWS SDK v3 boi vi AWS SDK v2 khong ho tro version moi nhat cua NodeJS
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const multer = require('multer');
const upload = multer();

app.use(express.json()); // đọc dữ liệu JSON từ body của request
app.use(express.urlencoded({ extended: true })); // đọc dữ liệu form-urlencoded từ body của request

// Dotenv -> Lay du lieu tu file .env
require('dotenv').config();

// Khoi tao client va docClient
const client = new DynamoDBClient({
    region:'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
})
// Khoi tao docClient
const docClient = DynamoDBDocumentClient.from(client);

const tableName = 'Product';

// Xem danh sách sản phẩm
app.get('/', async (req, res) =>  {
    try {
        
        // Lay du lieu tu table Product
        const params = {
            TableName: tableName,
        }
        // Tao ScanCommand -> Lay du lieu tu table Product
        const command = new ScanCommand(params);
        
        // Giai thich:
        // - docClient.send(command) se gui command toi table Product
        // - data: la ket qua tra ve tu table Product
        const data = await docClient.send(command);
        res.render('index', {sanPhams: data.Items})
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send('Internal Server Error');
    }
})
//Thêm sản phẩm
app.post('/', upload.fields([]),async (req, res) =>  {
    try {

        const {Id, product_name, quantity} = req.body;

        // Tao params -> chua du lieu can them vao table Product
        const params = {
            TableName: tableName,
            Item: {
                Id: Id,
                product_name: product_name,
                quantity: Number(quantity)
            }
        }
        // Tao PutCommand -> Them du lieu vao table Product
        const command = new PutCommand(params);

        // post
        await docClient.send(command);
        res.redirect('/')

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send('Internal Server Error');
    }
})

app.listen(3000, () => {
    console.log('server is running on port 3000')
})