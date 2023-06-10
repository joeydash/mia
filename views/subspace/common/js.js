// Ths is done to read the GET values
let _GET = (function () {
    let _get = {};
    let re = /[?&]([^=&]+)(=?)([^&]*)/g;
    while (m = re.exec(location.search)) _get[decodeURIComponent(m[1])] = (m[2] == '=' ? decodeURIComponent(m[3]) : true);
    return _get;
})();
const CONSTANT_DATA = {
    graphql_url: "https://db.grow90.org",
    authentication_url: "https://auth.grow90.org",
    graphqlURL: "/subspace/graphql",
    graphql_ws_url: "wss://db.grow90.org/v1/graphql"
};
let g90Client = (query, variables = {}) => {
    return new Promise((resolve, reject) => {
        fetch(CONSTANT_DATA.graphqlURL, {
            method: 'post',
            headers: localStorage.getItem('auth_token') === null ? {'Content-Type': 'application/json'} : {
                'Authorization': 'Bearer ' + localStorage.getItem('auth_token'), 'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: query, variables: variables
            })
        })
            .then(result => result.json())
            .then(result => resolve(result))
            .catch(error => {
                console.log(error);
                reject(error);
            });
    })
}

function makeHead(str) {
    try {
        if (str === null) return null; else if (str === undefined) return undefined; else if (typeof str == "boolean") return str; else if (typeof str == "number") return str;
        let splitStr = str.toLowerCase().split('_');
        for (let i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    } catch (e) {
        console.log(e);
        return str;
    }
}

function difference(origObj, newObj) {
    function changes(newObj, origObj) {
        let arrayIndexCounter = 0
        return _.transform(newObj, function (result, value, key) {
            if (!_.isEqual(value, origObj[key])) {
                let resultKey = _.isArray(origObj) ? arrayIndexCounter++ : key
                result[resultKey] = (_.isObject(value) && _.isObject(origObj[key])) ? changes(value, origObj[key]) : value
            }
        })
    }

    return changes(newObj, origObj)
}

alertify.set('notifier', 'position', 'top-center');

if (localStorage.getItem("auth_token") === null || localStorage.getItem("auth_token") === undefined) window.location.href = "/login?redirect=" + window.location.pathname;
