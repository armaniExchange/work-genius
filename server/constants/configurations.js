export const DB_HOST = '192.168.95.155';
export const DB_PORT = 28015;
export const LDAP = { 
	url: 'ldap://corp.a10networks.com:389',
	baseDN: 'dc=corp,dc=a10networks,dc=com',
	username: 'coverity@corp.a10networks.com',
	password: 'cm@a10!' 
};

export const ADMIN = ['zli', 'stsai'];
export const LDAP_AUTH_PREFIX = 'corp\\';
export const SECURE_KEY = '@a10networks';export const DB_PORT = 28015;
export const GK2_LOG_IN_ACCOUNT = '';
export const GK2_LOG_IN_PASSWORD = '';
export const GK2_LOG_IN_URL = 'https://gk2.a10networks.com/login/';
export const GK2_REFERER_URL = 'https://gk2.a10networks.com/login/?next=/';
export const GK2_BEIJING_MUST_FIX_BUG_URL = 'https://gk2.a10networks.com/projects/227573/bugs/list/must-fix/?pb_status=open&team=10&group_by_member=yes&must_fix=on';