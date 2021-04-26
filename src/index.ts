import * as express from 'express';
import https = require('https');
import http = require('http');
import * as cors from 'cors';
import { videos, categories } from './server/Video.json';
var selfsigned = require('selfsigned');
import { join } from 'path';

export class RadioServer {
	public static readonly PORT: number = 80;
	private app: express.Application;
	private httpServer: http.Server;
	private httpsServer: https.Server;
	private port: string | number;
	private path = join('C:', 'Users', 'shubh', 'Desktop', 'Oldbox', 'src', 'client');

	constructor() {
		this.app = express();
		this.app.use(cors());
		this.port = process.env.PORT || RadioServer.PORT;

		this.httpServer = http.createServer(this.app);
		var pems = this.selfSign();
		this.httpsServer = https.createServer(
			{
				key: pems.private,
				cert: pems.cert
			},
			this.app
		);
		this.register();
		this.app.use('/', express.static(this.path, { index: 'index.html' }));
		this.listen();
	}

	private selfSign() {
		return selfsigned.generate(null, {
			keySize: 2048, // the size for the private key in bits (default: 1024)
			days: 30, // how long till expiry of the signed certificate (default: 365)
			algorithm: 'sha256', // sign the certificate with specified algorithm (default: 'sha1')
			extensions: [ { name: 'basicConstraints', cA: true } ], // certificate extensions array
			pkcs7: true, // include PKCS#7 as part of the output (default: false)
			clientCertificate: true, // generate client cert signed by the original key (default: false)
			clientCertificateCN: 'jdoe' // client certificate's common name (default: 'John Doe jdoe123')
		});
	}

	private register() {
		this.app.get('/playlist:category', (req: express.Request, res: express.Response) => {
			let filter = req.params.category || 'all';
			let availableCategories = categories;
			let reqCategory = availableCategories.find((c) => c === filter);

			if (reqCategory == undefined) {
				return res.status(404).send('Playlist Unavailable!!');
			} else {
				let videoList = videos as VideoList[];
				videoList = videoList.filter((v) => v.category.indexOf(reqCategory!) !== -1);
				const radio: RadioResponse = { audios: [], videos: videoList };
				return res.send(radio);
			}
		});

		this.app.get('/playlist', (req: express.Request, res: express.Response) => {
			let videoList = videos as VideoList[];
			const radio: RadioResponse = { audios: [], videos: videoList };
			return res.header('Cache-Control', 'public, max-age=600, immutable').send(radio);
		});
	}

	private listen(): void {
		this.httpServer.listen(this.port, () => {
			console.log('Running server on port %s', this.port);
		});
		this.httpsServer.listen(443, () => {
			console.log('Running server on port %s', 443);
		});
	}
}

new RadioServer();
