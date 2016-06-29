// GraphQL
import {
    GraphQLString
} from 'graphql';
// RethinkDB
import r from 'rethinkdb';
// Constants
import { DB_HOST, DB_PORT } from '../../constants/configurations.js';

let BugMutation = {
    'updateDevice': {
        type: GraphQLString,
        description: 'edit a devices ',
        args: {
            data: {
                type: GraphQLString,
                description: 'new device data'
            }
        },
        resolve: async (root, { data }) => {
            let connection = null,
                query = null;

            try {
                let device = JSON.parse(data);
                //total_row is used for pagination, don't need to be insert into db
                let ip = null;
                if (!!device.ip){
                    ip = device.ip;
                    delete device.ip;
                }
                if (!ip){
                    return 'Fail to update device! No IP';
                }
                console.log(device);
                query = r.db('work_genius').table('devices').filter({ip: ip}).update(device);
                connection = await r.connect({ host: DB_HOST, port: DB_PORT });
                await query.run(connection);
                await connection.close();
            } catch (err) {
                return 'Fail to update device!';
            }
            return 'Update device successfully!';
        }
    }

};

export default BugMutation;