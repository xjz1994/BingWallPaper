let fs = require('fs');
let request = require('request');
var Agent = require('socks5-http-client/lib/Agent');//使用代理

let id = 1;
let JSONData = {};

let startPage = 0
let pageLimit = 7;                          //由于必应的API限制，最多只能获取7天前的壁纸
let downloadPath = 'data/'                  //下载路径
let timeLimit = 1000;

var startApp = async () => {
    console.log("start");
    for (let i = startPage; i <= pageLimit; i++) {
        await getPage(i).catch((err) => { console.log(err) });
        await wait(timeLimit);
    }
    console.log("finish");
}

var wait = (timeLimit) => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, timeLimit);
    });
}

var getPath = (page) => {
    return opt = {
        url: `https://www.bing.com/HPImageArchive.aspx?format=js&idx=${page}&n=1&mkt=cn`,
        // agentClass: Agent,
        // agentOptions: {
        //     socksHost: 'localhost', // Defaults to 'localhost'.
        //     socksPort: 1080 // Defaults to 1080.
        // },
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
        },
    };
}

var getImgPath = (url) => {
    return opt = {
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
        },
        encoding: null//让request返回的body是buffer
    };
}

var getPage = (curPage) => {
    return new Promise((resolve, reject) => {
        request(getPath(curPage), (error, response, body) => {
            if (error) reject(error);
            let url = "http://s.cn.bing.net/" + JSON.parse(body).images[0].url;
            request(getImgPath(url), (error, response, body) => {
                if (error) reject(error);
                let arr = url.split("/");
                let name = arr[arr.length - 1];
                fs.writeFile(downloadPath + name, body, function (error, written) {
                    if (error) reject(error);
                    console.log(`Successfully written ${name}`);
                    resolve();
                });
            });
        });
    });
}

startApp();