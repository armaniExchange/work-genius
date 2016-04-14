// GraphQL
import {
    GraphQLList,
    GraphQLString
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import {
    DB_HOST,
    DB_PORT,
    MAIL_TRANSPORTER_CONFIG
} from '../../constants/configurations.js';

let MailMutation = {
	'sendMail': {
		type: GraphQLString,
		description: 'Send a e-mail to target',
        args: {
			to: {
				type: new GraphQLList(GraphQLString),
				description: 'target email address'
			},
            cc: {
				type: new GraphQLList(GraphQLString),
				description: 'target email address'
			},
            bcc: {
				type: new GraphQLList(GraphQLString),
				description: 'target email address'
			},
            subject: {
				type: GraphQLString,
				description: 'target email address'
			},
            text: {
				type: GraphQLString,
				description: 'target email address'
			},
            html: {
				type: GraphQLString,
				description: 'target email address'
			}
		},
		resolve: async ({ transporter }, { to, cc, bcc, subject, text, html }) => {
			let mailConfig =  {
                    from: MAIL_TRANSPORTER_CONFIG.auth.user,
                    to,
                    cc,
                    bcc,
                    subject,
                    text,
                    html
                };

			try {
                await transporter.sendMail(mailConfig);
			} catch (err) {
				return err;
			}
			return 'Mail sent successfully!';
		}
	},
    'sendMailIncludingManagers': {
		type: GraphQLString,
		description: 'Send a e-mail to target and cc managers',
        args: {
			to: {
				type: new GraphQLList(GraphQLString),
				description: 'target email address'
			},
            cc: {
				type: new GraphQLList(GraphQLString),
				description: 'target email address'
			},
            bcc: {
				type: new GraphQLList(GraphQLString),
				description: 'target email address'
			},
            subject: {
				type: GraphQLString,
				description: 'target email address'
			},
            text: {
				type: GraphQLString,
				description: 'target email address'
			},
            html: {
				type: GraphQLString,
				description: 'target email address'
			}
		},
		resolve: async ({ transporter }, { to, cc, bcc, subject, text, html }) => {
			let query = r.db('work_genius').table('users').filter(r.row('privilege').ge(10)).getField('email').coerceTo('array'),
                connection,
                managers,
                mailConfig =  {
                    from: MAIL_TRANSPORTER_CONFIG.auth.user,
                    to,
                    cc: ['howardc@a10networks.com'],
                    bcc,
                    subject,
                    text,
                    html
                };

			connection = await r.connect({ host: DB_HOST, port: DB_PORT });
			managers = await query.run(connection);

            // mailConfig.cc = mailConfig.cc ? managers.concat(mailConfig.cc) : managers.concat(['howardc@a10networks.com']);

			try {
                await transporter.sendMail(mailConfig);
			} catch (err) {
				return err;
			}
			return 'Mail sent successfully!';
		}
	}
};

export default MailMutation;
