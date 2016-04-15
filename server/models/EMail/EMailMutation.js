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
    MAILER_ADDRESS
} from '../../constants/configurations.js';

let MailMutation = {
	'sendMail': {
		type: GraphQLString,
		description: 'Send a e-mail to target',
        args: {
			to: {
				type: new GraphQLList(GraphQLString),
				description: 'target email addresses'
			},
            cc: {
				type: new GraphQLList(GraphQLString),
				description: 'cc email addresses'
			},
            bcc: {
				type: new GraphQLList(GraphQLString),
				description: 'bcc email addresses'
			},
            subject: {
				type: GraphQLString,
				description: 'email subject'
			},
            text: {
				type: GraphQLString,
				description: 'email text content'
			},
            html: {
				type: GraphQLString,
				description: 'email html content'
			}
		},
		resolve: async ({ transporter }, { to, cc, bcc, subject, text, html }) => {
			let mailConfig =  {
                    from: MAILER_ADDRESS,
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
				description: 'target email addresses'
			},
            cc: {
				type: new GraphQLList(GraphQLString),
				description: 'cc email addresses'
			},
            bcc: {
				type: new GraphQLList(GraphQLString),
				description: 'bcc email addresses'
			},
            subject: {
				type: GraphQLString,
				description: 'email subject'
			},
            text: {
				type: GraphQLString,
				description: 'email text content'
			},
            html: {
				type: GraphQLString,
				description: 'email html content'
			}
		},
		resolve: async ({ transporter }, { to, cc, bcc, subject, text, html }) => {
			let query = r.db('work_genius').table('users').filter(r.row('privilege').ge(10)).getField('email').coerceTo('array'),
                connection,
                managers,
                mailConfig =  {
                    from: MAILER_ADDRESS,
                    to,
                    cc,
                    bcc,
                    subject,
                    text,
                    html
                };

			connection = await r.connect({ host: DB_HOST, port: DB_PORT });
			managers = await query.run(connection);

            mailConfig.cc = mailConfig.cc ? managers.concat(mailConfig.cc) : managers;

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
