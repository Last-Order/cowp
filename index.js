#!/usr/bin/env node
const axios = require('axios');
const url = process.argv[2];
if (!url) {
    throw new Error('Please input url');
}
const fileId = url.match(/\/s\/(.+)/)[1];
const transferDetailApi = `https://cowtransfer.com/transfer/transferdetail?url=${fileId}`;
axios({
    url: transferDetailApi,
}).then(transferDetail => {
    const guid = transferDetail.data.transferFileDtos[0].guid;
    const filename = transferDetail.data.transferFileDtos[0].fileName;
    const downloadApi = `https://cowtransfer.com/transfer/download?guid=${guid}`;
    axios({
        method: 'POST',
        url: downloadApi,
        headers: {
            'Referer': url,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36'
        }
    }).then(downloadInfo => {
        console.log(`${downloadInfo.data.link} --header 'referer: ${url}' --header 'authority: static.cowtransfer.com' --header 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36' -O "${filename}"`);
    });
})