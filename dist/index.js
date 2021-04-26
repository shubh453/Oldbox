"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioServer = void 0;
const express = require("express");
const https = require("https");
const http = require("http");
const cors = require("cors");
const Video_json_1 = require("./server/Video.json");
var selfsigned = require('selfsigned');
const path_1 = require("path");
let RadioServer = (() => {
    class RadioServer {
        constructor() {
            this.path = path_1.join('C:', 'Users', 'shubh', 'Desktop', 'Oldbox', 'src', 'client');
            this.app = express();
            this.app.use(cors());
            this.port = process.env.PORT || RadioServer.PORT;
            this.httpServer = http.createServer(this.app);
            var pems = this.selfSign();
            this.httpsServer = https.createServer({
                key: pems.private,
                cert: pems.cert
            }, this.app);
            this.register();
            this.app.use('/', express.static(this.path, { index: 'index.html' }));
            this.listen();
        }
        selfSign() {
            return selfsigned.generate(null, {
                keySize: 2048,
                days: 30,
                algorithm: 'sha256',
                extensions: [{ name: 'basicConstraints', cA: true }],
                pkcs7: true,
                clientCertificate: true,
                clientCertificateCN: 'jdoe'
            });
        }
        register() {
            this.app.get('/playlist:category', (req, res) => {
                let filter = req.params.category || 'all';
                let availableCategories = Video_json_1.categories;
                let reqCategory = availableCategories.find((c) => c === filter);
                if (reqCategory == undefined) {
                    return res.status(404).send('Playlist Unavailable!!');
                }
                else {
                    let videoList = Video_json_1.videos;
                    videoList = videoList.filter((v) => v.category.indexOf(reqCategory) !== -1);
                    const radio = { audios: [], videos: videoList };
                    return res.send(radio);
                }
            });
            this.app.get('/playlist', (req, res) => {
                let videoList = Video_json_1.videos;
                const radio = { audios: [], videos: videoList };
                return res.header('Cache-Control', 'public, max-age=600, immutable').send(radio);
            });
        }
        listen() {
            this.httpServer.listen(this.port, () => {
                console.log('Running server on port %s', this.port);
            });
            this.httpsServer.listen(443, () => {
                console.log('Running server on port %s', 443);
            });
        }
    }
    RadioServer.PORT = 80;
    return RadioServer;
})();
exports.RadioServer = RadioServer;
new RadioServer();
//# sourceMappingURL=index.js.map