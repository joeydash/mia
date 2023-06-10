let express = require('express');
const axios = require("axios")
let router = express.Router();
let joeygql = require('./joeygql');
const {Client} = require("whatsapp-web.js");
const PG = require('pg');

const pg = new PG.Client("");
pg.connect();
let client;
let contacts;
let private_contacts;
let groups;
let isSignedIn = false;
let loading_message = "Loading ...⌛ We wil message you once this is done.";
let format_not_correct_message = "Format not correct. Please try again.";
let table_name = "";
/* GET home page. */
let privateApp = {
    getReply: async (msg) => {
        if (msg.body.startsWith('/start')) {
            msg.reply('Please choose an option from the following: \n 1. Razorpay \n 2. Google Sheets \n 3. Google Forms\n 4. Shopify\n 5. Dukaaan');
        } else if (msg.body.startsWith('/select razorpay')) {
            msg.reply('Please send your razorpay details with proper format /razorpay <Key_ID> <Key_Secret>');
        } else if (msg.body.startsWith('/razorpay testid testsecret')) {
            msg.reply(loading_message);
        } else if (msg.body.startsWith('/table')) {

            const matches = msg.body.match(/\/table\s+(\w+)/i);
            if (matches) {
                table_name = matches[1];
                console.log("SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name = '"+table_name+"';");
                let tableSchema = await pg.query("SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name = '"+table_name+"';");
                console.log(tableSchema.rows);
                // msg.reply("Your table name is set to: " + table_name); // Output: "auth"
            } else {
                await msg.reply(format_not_correct_message);
            }
            await msg.reply(loading_message);
        } else await msg.reply('I\'m sorry, it seems my circuits are feeling a little under the weather today, and I\'m having trouble comprehending your message. Could you please rephrase or provide more context? I\'ll do my best to assist you once I recover from this momentary glitch. Thank you for your understanding! 🤖🤕');
    }
}
// client = new Client({
//     puppeteer: {
//         args: ['--no-sandbox',],
//     }
// });
// client.on("qr", (qr) => {
//     console.log(qr);
//     // qrcode.generate(qr, {small: true});
// });
// client.on("ready", async () => {
//     console.log("Client is ready!")
//     contacts = await client.getContacts();
//     private_contacts = contacts.filter((data) => !data.isGroup && !data.isMe);
//     groups = contacts.filter((data) => data.isGroup);
// });
// client.initialize();
// client.on("authenticated", (_session) => {
//     console.log("Client is authenticated!");
//     isSignedIn = true;
// });

// client.on("message", async (msg) => {
//     if (!msg.hasMedia && msg.body !== "") {
//         if (msg.body.startsWith('/start')){
//             // The message body starts with '/start'
//             // Perform the desired actions here
//             console.log('Received a "/start" command');
//         }
//         await msg.reply('pong');
//     }
// });
router.post('/subspace/graphql', async function (req, res) {
    try {
        let data = await joeygql.admin_client(req.body.query, req.body.variables);
        res.json(data);
    } catch (e) {
        console.log(e);
        res.json({error: "Some Error Found!"});
    }
});

router.get('/test', function (req, res, next) {

    privateApp.getReply({
        body: req.body.message, reply: (reply) => {
            console.log(reply);
        }
    });
    res.json({
        "message": "Mia is working!",
    });
});

router.get('/dashboard/:path', async function (req, res, next) {
    let getDataResponse = await joeygql.admin_client(`query getData($path: String = "") {
                                                              mia_admin(where: {path: {_eq: $path}}) {
                                                                data
                                                              }
                                                            }
                                                            `, {
        path: req.params.path
    });
    if (getDataResponse.errors) res.json({"message": "Mia is not registered!"}); else if (getDataResponse.data.mia_admin.length <= 0) res.json({"message": "Mia is not registered!"}); else {
        joeygql.getSiteData("https://grow90.org")
            .then(data => {
                data.jsData = getDataResponse.data.mia_admin[0];
                res.render('subspace/app', data);
            });
    }
});
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Mia is working!'});
});

router.post("/message", async function (req, res, next) {
    let table_name = req.body.table_name;
    let message = req.body.message;
    let schema = {
        auth: [{
            name: 'user_id', type: 'uuid'
        }, {
            name: 'email', type: 'text',
        }, {
            name: 'phone', type: 'text'
        }, {
            name: 'fullname', type: 'text'
        }, {
            name: 'password', type: 'text'
        }, {
            name: 'username', type: 'text'
        }, {
            name: 'dp', type: 'text'
        }]
    }

    for (const element of schema.auth) {
        if (element.type === 'text') {
            element.type = 'String';
        }
    }

    const schemaTypeMap = schema.auth.reduce((result, item) => {
        result[item.name] = item.type;
        return result;
    }, {});

    let columns = schema.auth.map(e => e.name);

    let schemaString = '';
    schema.auth.forEach(element => {
        schemaString += `${element.name}, ${element.type}\n`;
    });

    let options = {
        method: 'POST', url: 'https://api.openai.com/v1/chat/completions', headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer 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'
        }, data: {
            model: 'gpt-4', messages: [{
                role: 'user', content: `table schema:
      ${schemaString}
      
      
      columns:
      ${message}
      
      --------
      
      put this int he following JSON structure
      [
      {
        key: "fullname",
        name: "Name",
        type: "String",
        showInList: true,
        canEdit: true,
        networkSearch: true,
        networkSort: true,
        save: false
      },{
        key: "phone",
        name: "Phone",
        type: "String",
        canEdit: true,
        showInList: true,
        networkSearch: true,
        networkSort: true,
        save: false
      }
      ]`
            }], temperature: 0.7
        }
    };
    let response = await axios.request(options)
    // console.log(response.data.choices);
    // console.log(response);
    var result = JSON.parse(response.data.choices[0].message.content);

    // var result = [
    // {
    // "key": "email",
    // "name": "Email",
    // "type": "text",
    // "showInList": true,
    // "canEdit": false,
    // "networkSearch": true,
    // "save": true
    // },
    // {
    // "key": "fullname",
    // "name": "Name",
    // "type": "text",
    // "showInList": true,
    // "canEdit": true,
    // "networkSearch": true,
    // "networkSort": true,
    // "save": true
    // },
    // {
    // "key": "phone",
    // "name": "Phone Number",
    // "type": "text",
    // "showInList": true,
    // "canEdit": true,
    // "networkSort": true
    // },
    // {
    // "key": "dp",
    // "name": "Image",
    // "type": "text",
    // "showInList": false,
    // "canEdit": false,
    // "networkSort": false,
    // "networkSearch": false
    // }];
    let headers = [];
    let columnsToSave = [];
    for (const element of result) {
        if (!columns.includes(element['key'])) {
            return res.status(400).json({message: `Invalid Column : ${element['key']}`});
        }
        let save = element['save'];
        if (save) {
            columnsToSave.push(element['key']);
        }
        if (save !== undefined) {
            delete element.save;
        }
        headers.push(element)
    }

    let mutation = "";
    if (columnsToSave.length > 0) {
        mutation += `mutation updateUser($id: uuid,`;
        for (let i = 0; i < columnsToSave.length; i++) {
            mutation += `$${columnsToSave[i]}: ${schemaTypeMap[columnsToSave[i]]}`;
            if (i != columnsToSave.length - 1) {
                mutation += ", ";
            }
        }
        mutation += `) {
      update_${table_name}(_set: {`
        for (let i = 0; i < columnsToSave.length; i++) {
            mutation += `${columnsToSave[i]}: $${columnsToSave[i]}`;
            if (i != columnsToSave.length - 1) {
                mutation += ", ";
            }
        }
        mutation += `}, where: {id: {_eq: $id}}) {
          affected_rows
        }
      }`
    }

    var components = [{
        type: "table", id: "usersTable", title: "Users", query_item: "auth", query: `query getUsers {
      auth(order_by: {}, where: {}, limit: 100, offset: 0) {
        ${result.map(element => `\n    ${element.key}`).join('')}
      }
    }`, heads: headers, saveActions: columnsToSave.length > 0 ? [{
            keys: columnsToSave, mutation: mutation, mutation_item: `update_${table_name}`
        }] : []
    }]

    res.status(200).json({components: components});
})

module.exports = router;
