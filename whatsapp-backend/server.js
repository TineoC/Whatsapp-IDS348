import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import cors from "cors";
import Messages from "./dbMessages.js";
import Users from "./dbUsers.js"
import Chats from "./dbChats.js"
import Contacts from "./dbContacts.js";
import * as dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = process.env.PORT || 9000
const pusher = new Pusher({
    appId: process.env.PUSHER_APPID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: process.env.PUSHER_USETLS
});

app.use(express.json())

// Chequear e investigar acerca de CORS module
app.use(cors())

mongoose.connect(process.env.DB_CONNECTION_URL);

const db = mongoose.connection
db.once('open', ()=> {
    console.log("DB connected")

    const msgCollection = db.collection('messagecontents')
    const changeStream = msgCollection.watch()

    changeStream.on('change', (change)=>{
        console.log(change)
        
        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted', {
            name: messageDetails.name,
            message: messageDetails.message,
            timestamp: messageDetails.timestamp,
            chat: messageDetails.chat,
        });
    } else {
        console.log('Ha ocurrido un error')
    } 
    });
});

app.get('/messages/sync', (req, res) => {
    Messages.find(req.query, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

app.get('/user/login', (req, res) => {
    Users.find(req.query, (err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

app.get('/chat/search', (req, res) => {
    Chats.find(req.query, (err, data) => { // En el req.query tengo que pasarle el nombre del usuario
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

app.get('/chat/searchBy', (req, res) => {
    Chats.find( {users: { $all: [ req.query.main, req.query.find ]}} ,(err, data) => { 
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

app.get('/chat/get', (req, res) => {
    Chats.find(req.query, (err, data) => {
        if(err) {
            res.status(500).send(err)
        } else{
            res.status(200).send(data)
        }
    })
})

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body

    Messages.create(dbMessage, (err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(`nuevo mensaje creado: \n ${data}`)
        }
    })
})

app.post('/user/new', (req, res) => {
    const dbUser = req.body
    Users.create(dbUser, (err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(`nuevo usuario creado: \n ${data}`)
        }
    })
})

app.get('/contact/search', (req, res) => {
    const dbUser = req.query
    Contacts.find(dbUser, {"_id":0, "email":0, "__v": 0}, (err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

app.post('/contact/create', (req, res) => {
    const dbContact = req.body
    Contacts.create(dbContact, (err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(`contenido contacto creado: \n ${data}`)
        }
    })
})

app.post('/contact/add', (req, res) => {
    const dbContacts = req.body
    Contacts.updateOne(dbContacts, (err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(`Nuevo contacto agregado: \n ${data}`)
        }
    })
})

app.get('/contact/select', (req, res) => { // Tengo que pasarle los parametros definiendolos jevi como en el chat/search
    Contacts.aggregate([ 
        {$match : {email: req.query.email}},
        {
           $lookup:
              {
                from: "usercontents",
                localField: "contacts",
                foreignField: "email",
                as: "contacts_info"
             }
        }
     ], (err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
     })
})

app.listen(port, () => console.log(`Listening on localhost: ${port}`))

/*[
        {
           $lookup:
              {
                from: "usercontents",
                localField: "contacts",
                foreignField: "email",
                as: "contacts_info"
             }
        }
     ]*/