import request from 'request-promise';
import promise from 'promise';
import _ from 'lodash';

const _BASE = "http://jsonplaceholder.typicode.com/";
const _POSTS = _BASE + "posts";
const _USERS = _BASE + "users";
const _OPTIONS = {
	json: true
}

var _users = [];

const getAllUsers = function() {
	var _user = {};
	_OPTIONS.uri = _USERS; 
	var promise = request(_OPTIONS);
	
	// prefill users array
	promise.then(function(users) {
		_users = users;
	});

	return promise;
}

const getUser = function(id) {
	var user,promise,users = [];
	var getUser = function(id, users) {
			var _user;
			if (users === undefined) {
				return;
			}

			_(users).forEach(function(value) {
			if (value.id === id) {
				_user = value;
			}
		});
		return _user;
	};
	

	promise = new Promise((resolve, reject) => {
		var users = []; 
		getAllUsers().then(function(data) {
			user = getUser(id, data);
			if (user !== undefined) {
				users.push(user);
			}
			resolve(users);
		});
	});

	return promise;
}

const api = {
	getuser: getUser,
	getAllUsers: getAllUsers
};

export default api;