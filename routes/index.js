let express = require('express');
const axios = require("axios")
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/message", async function (req, res, next) {
  let table_name = req.body.table_name;
  let message = req.body.message
  let schema = {
    auth: [
      {
        name: 'user_id',
        type: 'uuid'
      },{
        name: 'email',
        type: 'text',
      },{
        name: 'phone',
        type: 'text'
      },{
        name: 'fullname',
        type: 'text'
      },{
        name: 'password',
        type: 'text'
      },{
        name: 'username',
        type: 'text'
      },{
        name: 'dp',
        type: 'text'
      }
    ]
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
    method: 'POST',
    url: 'https://api.openai.com/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer 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'
    },
    data: {
      model: 'gpt-4',
      messages: [{role: 'user', content: `table schema:
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
      ]`}],
      temperature: 0.7
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
    if (!columns.includes(element['key'])){
      return res.status(400).json({message: `Invalid Column : ${element['key']}`});
    }
    let save = element['save'];
    if (save){
      columnsToSave.push(element['key']);
    }
    if (save!==undefined){
      delete element.save;
    }
    headers.push(element)
  }

  let mutation = "";
  if (columnsToSave.length>0){
    mutation += `mutation updateUser($id: uuid,`;
    for (let i = 0; i < columnsToSave.length; i++) {
      mutation += `$${columnsToSave[i]}: ${schemaTypeMap[columnsToSave[i]]}`;
      if (i!=columnsToSave.length-1){
        mutation += ", ";
      }
    }
    mutation += `) {
      update_${table_name}(_set: {`
    for (let i = 0; i < columnsToSave.length; i++) {
        mutation += `${columnsToSave[i]}: $${columnsToSave[i]}`;
        if (i!=columnsToSave.length-1){
          mutation += ", ";
        }
      }
    mutation += `}, where: {id: {_eq: $id}}) {
          affected_rows
        }
      }`
    }

  var components = [{
    type: "table",
    id: "usersTable",
    title: "Users",
    query_item: "auth",
    query: `query getUsers {
      auth(order_by: {}, where: {}, limit: 100, offset: 0) {
        ${result.map(element => `\n    ${element.key}`).join('')}
      }
    }`,
    heads: headers,
    saveActions: columnsToSave.length>0?[{
      keys: columnsToSave,
      mutation: mutation,
      mutation_item: `update_${table_name}`
  }]:[]
  }]

  res.status(200).json({components: components});
})

module.exports = router;
