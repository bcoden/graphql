import Sequelize from 'sequelize';
import _ from 'lodash';
import Faker from 'faker';

// sets up the connection to the db
const Conn = new Sequelize(
	'relay',
	'postgres',
	'postgres',
	{
		dialect: 'postgres',
		host: 'localhost'
	}
);

// sequalize specific model definitions
const Person = Conn.define('Person', {
	firstName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	lastName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			isEmail: true
		}
	}
});

const Post = Conn.define('Post', {
	title: {
		type: Sequelize.STRING,
		allowNull: false
	},
	content: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

// relationships
Person.hasMany(Post);
Post.belongsTo(Person);


// sets up some fake data in our schema
Conn.sync({force: true}).then(() => {
	_.times(10, () => {
		return Person.create({
			firstName: Faker.name.firstName(),
			lastName: Faker.name.lastName(),
			email: Faker.internet.email()
		}).then(person => {
			return person.createPost({
				title: `Sample title by ${person.firstName}`,
				content: 'This is a sample article'
			})
		});
	});
});

export default Conn;