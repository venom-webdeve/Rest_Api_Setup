let express = require("express");
let body_parser = require("body-parser");
let bcrypt = require('bcryptjs');
let cors = require('cors')
const { v4: uuidv4 } = require('uuid');
let app = express();
let port = process.env.PORT || 3300;
let userDetails = [];
// x-www-urlencoded data
app.use(body_parser.urlencoded({ extended: true }));
// body form data
app.use(body_parser.json());
app.use(cors());

app.get('/users', (req, res) => {
    res.status(200).json({ message: "user list", data: userDetails });
});

app.get('/user/:userID', (req, res) => {
    const userID = req.params.userID;
    const newUserData = userDetails.filter((item) => {
        if (item.userId === userID) {
            return item;
        }
    });
    console.log("id data", newUserData);
    res.status(200).json({ message: "user list by id", data: newUserData });
});

app.post('/user', (req, res, next) => {
    let input = req.body;
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (input.userName === undefined || input.userName === "") {
        return res.status(300).json({ status: 300, message: "userName is required" });
    } if (input.userEmail === undefined || input.userEmail === "") {
        return res.status(300).json({ status: 300, message: "email is required" });
    }
    if (!regex.test(input.userEmail.trim())) {
        return res.status(300).json({ status: 300, message: "email is not valid" });
    } if (input.userPassword === undefined || input.userPassword === "") {
        return res.status(300).json({ status: 300, message: "password is required" });
    }
    const userData = {
        userId: uuidv4(),
        userName: input.userName,
        userEmail: input.userEmail,
        userPassword: bcrypt.hashSync(req.body.userPassword.toString(), 10)
    };
    userDetails.push(userData);
    if (res.status === 404) {
        res.status(404).send({ message: "somthing went wrong....!" });
    } else {
        res.status(200).json({
            status: 200,
            message: "successfully getting response",
            data: userDetails,
        });
        //send([{status:"200",message:"successfull getting response",data:userData}]);
    }
    next();

});

app.put('/updateUser/:userId', (req, res) => {
    const userId = req.params.userId;
    const input = req.body;
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (input.userName === undefined || input.userName === "") {
        return res.status(300).json({ status: 300, message: "userName is required" });
    } if (input.userEmail === undefined || input.userEmail === "") {
        return res.status(300).json({ status: 300, message: "email is required" });
    }
    if (!regex.test(input.userEmail.trim())) {
        return res.status(300).json({ status: 300, message: "email is not valid" });
    } if (input.userPassword === undefined || input.userPassword === "") {
        return res.status(300).json({ status: 300, message: "password is required" });
    }
    let updateUser = userArray = {
        userId: userId,
        userName: input.userName,
        userEmail: input.userEmail,
        userPassword: input.userPassword,
    };
    //create a copy of userDetails.
    const userDetailsCopy = [...userDetails];
    //find index of item to be replaced
    const targetIndex = userDetails.findIndex(f => f.userId === userId);
    //replace the object with a new one.
    userDetailsCopy[targetIndex] = updateUser;
    userDetails.length = 0;
    res.status(200).json({ status: "200", message: "user updated successfully", data: userDetailsCopy })
    userDetails.push(userDetailsCopy);
});

app.delete('/userDeleted/:userId', (req, res) => {
    const userId = req.params.userId;
    const userData = userDetails.filter(f => f.userId !== userId);
    userDetails.length = 0;
    userDetails.push(userData);
    res.status(200).json({ status: "200", message: "user deleted successfully", data: userDetails });
});

app.listen(port, () => {
    console.log(' server started on: ' + port);
});


