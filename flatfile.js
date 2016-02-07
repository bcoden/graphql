import promise from 'promise';
import _ from 'lodash';
import fs from 'fs';

const _QUESTIONS = "./questions.json";

const flatfile = function() {
	const promise = new Promise((resolve, reject) => {
		fs.readFile(_QUESTIONS, 'utf8', (err, data) => {
			if (!err) {
				resolve(JSON.parse(data));
			} else {
				reject(err)
			}
		});
	});

	return promise;
} 

const file = {
	getContents: flatfile
}

export default file;