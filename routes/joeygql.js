const fetch = require('node-fetch');
const _ = require('lodash');


let mHasuraGraphqlUrl = "";
let mHasuraAccessKey = "";

let joeygql = {
    admin_client: async (query, variables = {}, headers = {}) => {
        return (await fetch(mHasuraGraphqlUrl, {
            method: "POST", headers: _.merge({
                'x-hasura-admin-secret': mHasuraAccessKey,
            }, headers), body: JSON.stringify({
                query: query, variables: variables
            })
        })).json();
    }, save_dashboard: async (path, data) => {
        return (await fetch(mHasuraGraphqlUrl, {
            method: "POST", headers: _.merge({
                'x-hasura-admin-secret': mHasuraAccessKey,
            }, headers), body: JSON.stringify({
                query: `mutation MyMutation($data: String = "", $path: String = "") {
                          insert_mia_admin(objects: {path: $path, data: $data}) {
                            affected_rows
                          }
                        }`, variables: {path: path, data: data}
            })
        })).json();
    }, getObjectFromArray: (array) => {
        let object = {};
        _.each(array, (item) => {
            object[item.key] = item.value;
        });
        return object;
    }, getSiteData: (host) => {
        return new Promise(function (resolve, reject) {
            let mQuery = '{\n' + '  t_site_data {\n' + '    key\n' + '    value\n' + '  }\n' + '}\n';
            fetch(mHasuraGraphqlUrl, {
                method: "POST", headers: {
                    'X-Hasura-Role': 'website',
                    'X-Hasura-Access-Key': mHasuraAccessKey,
                    'X-Hasura-Website-Host': "%'" + host + "'%"
                }, body: JSON.stringify({query: mQuery, variables: null})
            })
                .then(data => data.json())
                .then(data => {
                    resolve(joeygql.getObjectFromArray(data.data.t_site_data));
                }).catch(err => reject(err));
        });
    }
};
module.exports = joeygql;
