"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioServer = void 0;
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const Video_json_1 = require("./Video.json");
let RadioServer = (() => {
    class RadioServer {
        constructor() {
            this.app = express();
            this.app.use(cors());
            this.port = process.env.PORT || RadioServer.PORT;
            this.server = http.createServer(this.app);
            this.listen();
            this.register();
            this.app.use(express.static(path.join('C:\\Users', 'shubh', 'Desktop', 'Oldbox', 'src', 'client')));
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
                return res.send(radio);
            });
        }
        listen() {
            this.server.listen(this.port, () => {
                console.log('Running server on port %s', this.port);
            });
        }
    }
    RadioServer.PORT = 8080;
    return RadioServer;
})();
exports.RadioServer = RadioServer;
new RadioServer();
//# sourceMappingURL=init.js.map