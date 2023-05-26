import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express().use(bodyParser.json());

const token = process.env.TOKEN;
const myToken = process.env.MY_TOKEN;

app.listen(3001 ||process.env.PORT, () => {
    console.log("webhook is listening");
});

app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const challenge = req.query["hub.challenge"];
    const verify_token = req.query["hub.verify_token"];

    if(mode && verify_token) {
        if(mode === "subscribe" && verify_token === myToken) {
            res.status(200).send(challenge);
        } else {
            res.status(403)
        }
    }
});

app.post("/webhook", (req, res) => {
    const body = req.body;

    console.log(JSON.stringify(body, null, 2));

    if(body.object) {
        if(body.entry && body.entry[0].changes && 
            body.entry[0].changes[0].value.messages && 
            body.entry[0].changes[0].value.messages[0]) {
            
            const phoneNumberID = body.entry[0].changes[0].value.metadata.phone_number_id
            const from = body.entry[0].changes[0].value.messages[0].from;
            const messageBody = body.entry[0].changes[0].value.messages[0].text.body; // user message 

            console.log("phoneNumberID", phoneNumberID);
            console.log("from", from);
            console.log("messageBody", messageBody);

            // search api goes here

            axios({
                method: "post",
                url: "https://graph.facebook.com/v16.0/" + phoneNumberID + "/messages?access_token="+token,
                data: {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: "Hi, From Textify"
                    }
                },
                headers: {
                    "Content-Type": "application/json"
                }
            });

            res.sendStatus(200);
        } else {
            res.sendStatus()
        }
    }
});

app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
});