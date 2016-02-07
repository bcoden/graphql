import {
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLList,
	GraphQLSchema,
	GraphQLNonNull
} from 'graphql';
import DB from './db';
import api from './api';
import flatfile from './flatfile';

// defines your schema in graphql
const Person = new GraphQLObjectType({
	name: 'Person',
	description: 'This represents a person',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				resolve(person) {
					return person.id
				}
			},
			firstName: {
				type: GraphQLString,
				resolve(person) {
					return person.firstName
				}
			},
			lastName: {
				type: GraphQLString,
				resolve(person) {
					return person.lastName
				}
			},
			email: {
				type: GraphQLString,
				resolve(person) {
					return person.email
				}	
			}, 
			posts: {
				type: new GraphQLList(Post),
				resolve(person) {
					return person.getPosts();
				}
			}
		}
	}
});

const User = new GraphQLObjectType({
	name: 'User',
	description: 'This represents a remote user',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				resolve(user) {
					return user.id
				}
			},
			name: {
				type: GraphQLString,
				resolve(user) {
					return user.name
				}
			},
			username: {
				type: GraphQLString,
				resolve(user) {
					return user.username
				}
			},
			email: {
				type: GraphQLString,
				resolve(user) {
					return user.email
				}
			}

		}
	}
});

const Question = new GraphQLObjectType({
	name: 'Question',
	description: 'This represents a questions file',
	fields: () => {
		return {
			id: {
				type: GraphQLString,
				resolve(question) {
					return question.id
				}
			},
			label: {
				type: GraphQLString,
				resolve(question) {
					return question.label
				}
			}
		}
	}
});

const Post = new GraphQLObjectType({
	name: 'Post',
	description: 'This is a post',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				resolve(person) {
					return person.id
				}
			},
			title: {
				type: GraphQLString,
				resolve(post) {
					return post.title				
				}	
			},
			content: {
				type: GraphQLString,
				resolve(post) {
					return post.content				
				}	
			},
			person: {
				type: Person,
				resolve(post) {
					return post.getPerson();				
				}	
			}
		};
	}
});

// sets up essentially our public api methods
const Query = new GraphQLObjectType({
	name: 'Query',
	description: 'This is a query',
	fields: () => {
		return {
			people: {
				type: new GraphQLList(Person),
				args: {
					id: {
						type: GraphQLInt
					},
					email: {
						type: GraphQLString
					}
				},
				resolve(root, args) {
					// returns promise
					return DB.models.Person.findAll({where: args});
				}
			},
			users: {
				type: new GraphQLList(User),
				args: {
					id: {
						type: GraphQLInt
					},
					email: {
						type: GraphQLString
					}
				},
				resolve(root, args) {
					// returns promise
					if (args.id !== undefined) {
						return api.getuser(args.id);
					}
					return api.getAllUsers();
				}
			},

			questions: {
				type: new GraphQLList(Question),
				args: {
					id: {
						type: GraphQLString
					}
				},
				resolve(root, args) {
					// returns promise
					return flatfile.getContents();
				}
			},

			post: {
				type: new GraphQLList(Post),
				args: {
					id: {
						type: GraphQLInt
					}
				},
				resolve(root, args) {
					// returns promise
					return DB.models.Post.findAll({where: args});
				}
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	description: 'Functions to create staff',
	fields: () => {
		return {
			addPerson: {
				type: Person,
				args: {
					firstName: {
						type: new GraphQLNonNull(GraphQLString)
					},
					lastName: {
						type: new GraphQLNonNull(GraphQLString)
					},
					email: {
						type: new GraphQLNonNull(GraphQLString)
					}
				},
				resolve(_, args) {
					return DB.models.Person.create({
						firstName: args.firstName,
						lastName: args.lastName,
						email: args.email.toLowerCase()
					});
				}
			}
		}
	}
});

// only one query per schema
const Schema = new GraphQLSchema({
	query: Query,
	mutation: Mutation
});

export default Schema;