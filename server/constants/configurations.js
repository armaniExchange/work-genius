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
export const SECURE_KEY = '@a10networks';