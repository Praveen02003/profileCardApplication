const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

var port = process.env.PORT || 8080;

var secretKey = process.env.JWT_SECRET_KEY
// console.log(secretKey);


const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

var db;
var customers;

// connectDb function
async function connectDb() {
    try {
        await client.connect();
        console.log("connected");

        db = client.db('localtest');
        customers = db.collection('customers');

    } catch (err) {
        console.error(err);
    }
}

connectDb();

// verifyToken function
function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }
    else {
        try {
            const decoded = jwt.verify(token, secretKey);
            // console.log(decoded, "===>");

            req.userId = decoded.userId;
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: 'Invalid token' });
        }
    }
};

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// deleteParticularuser route
app.get('/deleteParticularuser/:id', verifyToken, async (req, res) => {
    var id = req.params.id
    try {
        const data = await customers.deleteOne({ _id: new ObjectId(id) });
        return res.json({ message: "Deleted Successfully" });
    } catch (error) {
        console.log(error);

        return res.json({ message: error });
    }
});

// getParticularuser route
app.get('/getParticularuser/:id', verifyToken, async (req, res) => {
    var id = req.params.id
    try {
        const data = await customers.findOne({ _id: new ObjectId(id) });
        return res.json({ message: data });
    } catch (error) {
        return res.json({ message: error });
    }
});

// getAllUsers route
app.get('/getAllUsers', verifyToken, async (req, res) => {
    try {
        const data = await customers.find().toArray();
        return res.json({ message: data });
    } catch (error) {
        return res.json({ message: error });
    }
});

// updateUser route
app.post('/updateUser', verifyToken, async (req, res) => {
    const data = req.body.data;
    try {
        console.log(data);

        var getData = await customers.findOne({ _id: new ObjectId(data._id) })
        if (getData) {
            await customers.updateOne({ _id: new ObjectId(data._id) }, {
                $set: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    mobile: data.mobile,
                    shift: data.shift,
                    gender: data.gender,
                    role: data.role,
                    terms: data.terms
                }
            })
            return res.json({ message: "User Updated Successfully" });
        }
        else {
            return res.json({ message: "No User Found" });
        }
    } catch (error) {
        return res.json({ message: error });
    }
});

// addNewUser route
app.post('/addNewUser', verifyToken, async (req, res) => {
    const data = req.body.data;

    const saltRounds = 12;
    try {
        var getData = await customers.findOne({ email: data.email })
        // console.log(getData);
        if (!getData) {
            var hashPassword = await bcrypt.hash(data.password, saltRounds);
            // console.log(hashPassword, "===>");

            await customers.insertOne({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                mobile: "+91" + data.mobile,
                shift: data.shift,
                gender: data.gender,
                role: data.role,
                password: hashPassword,
                terms: data.terms
            })
            return res.json({ message: "New User Added Successfully" });
        }
        else {
            return res.json({ message: "User Already Exists" });
        }
    } catch (error) {
        return res.json({ message: error });
    }
});


// addUsers route
app.post('/addUsers', async (req, res) => {
    const data = req.body.data;
    const saltRounds = 12;
    try {
        var getData = await customers.findOne({ email: data.email })
        // console.log(getData);
        if (!getData) {
            var hashPassword = await bcrypt.hash(data.password, saltRounds);
            // console.log(hashPassword, "===>");

            await customers.insertOne({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                mobile: "+91" + data.mobile,
                shift: data.shift,
                gender: data.gender,
                role: data.role,
                password: hashPassword,
                terms: data.terms
            })
            return res.json({ message: "Signup Successfully" });
        }
        else {
            return res.json({ message: "Email Already Exists" });
        }
    } catch (error) {
        return res.json({ message: error });
    }
});

// loginUser route
app.post('/loginUser', async (req, res) => {
    const data = req.body.data;
    try {
        var getData = await customers.findOne({ email: data.email })
        // console.log(getData);
        if (getData) {
            var comparePassword = await bcrypt.compare(data.password, getData.password);
            // console.log(comparePassword, "===>");
            if (comparePassword) {
                var generateToken = jwt.sign({ userId: getData._id }, secretKey, {
                    expiresIn: '1h',
                });
                return res.json({ message: "Login Successfully", data: generateToken });
            }
            else {
                return res.json({ message: "Password Mismatch" });
            }
        }
        else {
            return res.json({ message: "Invalid Credentials" });
        }
    } catch (error) {
        return res.json({ message: error });
    }
});

app.listen(port, () => {
    console.log(`server running at port ${port}`);
});