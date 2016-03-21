// Models
import ArticleType from './ArticleType.js' 
// GraphQL
import {
	GraphQLString,
	GraphQLList,
	GraphQLInt,
	GraphQLObjectType
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT, ADMIN_ID } from '../../constants/configurations.js';

let ArticleQuery = {
	'getAllArticles' : {
		type: new GraphQLList(ArticleType),
		description: 'Get all articles under the selected category',
		args: {
			category_id: {
				type: GraphQLString,
				description: 'The category id for filtering articles'
			},
			tag_id: {
				type: GraphQLString,
				description: 'The tag for filtering articles'
			},
			last_update_time: {
				type: GraphQLString,
				description: 'The last update time of the article'
			},
			author_id: {
				type: GraphQLString,
				description: 'The author of the article'
			}	
		},
		resolve: async (root, { category_id, tag_id ,last_update_time,author_id}) => {
			let connection = null,
				filterFunc = article => {
					let haveCategoryId = !!category_id ,
						haveTag = !!tag_id;
					if(haveCategoryId && !haveTag){
						return article('category_ids').contains(category_id);
					}else if(!haveCategoryId && haveTag){
						return article('tags').contains(tag_id);
					}else if(haveCategoryId && haveTag){
						return article('category_ids').contains(category_id).and(article('tags').contains(tag_id));
					}else{
						return true;
					}
					
				},
			    result = null,
			    filterCondition = {};
		    if(author_id){
		    	filterCondition = {'author_id' : author_id};
		    }

		    if(last_update_time){
		    	filterCondition.updated_time = last_update_time;
		    }
			let	query = r.db('work_genius').table('articles')
				    .filter(filterFunc)
				    .filter(filterCondition)
				    .orderBy('updated_time')
				    .coerceTo('array');

			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				result = await query.run(connection);
				if(result){
					for (let article of result) {
						if(article.created_time){
							article.created_at = new Date(article.created_time).getTime();
						}
						if(article.updated_time){
							article.updated_at = new Date(article.updated_time).getTime();
						}
						//get author object
						query = r.db('work_genius').table('users')
							.get(article.author_id).pluck('id','name');
						let authorObj = await query.run(connection);
						if(authorObj){
							article.author = authorObj;
						}
						//get comment list
						article.comments = [];
						for(let comment_id of article.comment_ids){
							query = r.db('work_genius').table('comments').get(comment_id);
							let comment = await query.run(connection);
							if(comment.created_at){
								comment.created_at = new Date(comment.created_at).getTime();
							}
							if(comment.updated_at){
								comment.updated_at = new Date(comment.updated_at).getTime();
							}
							article.comments.push(comment);
						}

						//get file list
						article.files = [];
						for(let file_id of article.file_ids){
							query = r.db('work_genius').table('files').get(file_id);
							let file = await query.run(connection);
							if(file && file.created_at){
							file.created_at = new Date(file.created_at).getTime();
						}
							article.files.push(file);
						}
						
					}
				}
				
				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
		
	},
	'getArticle':{
		type: ArticleType,
		description: 'Get single article by article id ',
		args: {
			article_id: {
				type: GraphQLString,
				description: 'Article ID'
			}
		},
		resolve: async (root, {article_id}) => {
			let connection = null,result = null;
			let	query = r.db('work_genius').table('articles')
				    .get(article_id);

			try {
				connection = await r.connect({ host: DB_HOST, port: DB_PORT });
				result = await query.run(connection);
				if(result){
					if(result.created_time){
						result.created_at = new Date(result.created_time).getTime();
					}
					if(result.updated_time){
						result.updated_at = new Date(result.updated_time).getTime();
					}
					//get author object
					query = r.db('work_genius').table('users')
						.get(result.author_id).pluck('id','name');
					let authorObj = await query.run(connection);
					if(authorObj){
						result.author = authorObj;
					}
					//get comment list
					result.comments = [];
					for(let comment_id of result.comment_ids){
						query = r.db('work_genius').table('comments').get(comment_id);
						let comment = await query.run(connection);
						if(comment.created_at){
							comment.created_at = new Date(comment.created_at).getTime();
						}
						if(comment.updated_at){
							comment.updated_at = new Date(comment.updated_at).getTime();
						}
						result.comments.push(comment);
					}
					//get file list
					result.files = [];
					for(let file_id of result.file_ids){
						query = r.db('work_genius').table('files').get(file_id);
						let file = await query.run(connection);
						if(file && file.created_at){
							file.created_at = new Date(file.created_at).getTime();
						}
						result.files.push(file);
					}
				}
				
				await connection.close();
			} catch (err) {
				return err;
			}
			return result;
		}
	}
};

export default ArticleQuery;