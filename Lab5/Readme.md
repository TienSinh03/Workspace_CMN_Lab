## NodeJs - DynamoDB
### Code connect giữa NodeJs và DynamoDB 

#### Install
- AWS SDK v3: 
  
      npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
- multer: upload data

      npm install multer
  
> **Connect**
> ![Screenshot 2025-03-23 140115](https://github.com/user-attachments/assets/949653d6-1d1c-4193-ac45-8be2909e9d4a)
>
> **Get**

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
    }})

> **Create**

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
