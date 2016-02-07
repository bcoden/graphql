import fs from 'fs';

const _CONFIG = "./config.json";
const configuration = function() {
	var _config;
	fs.readFileSync(_CONFIG, 'utf8', (err, data) => {
		console.log("data: " +  data);
		if (!err) {
			_config = JSON.parse(data);
		}
	});
	
	console.log(_config);

	return _config || {};
}; 

const config = {
	getConfiguration: configuration
}

export default config;