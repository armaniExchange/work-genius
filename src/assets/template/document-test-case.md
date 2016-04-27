
### Feature Function:
`know what this feature do`

### CLI Config Test Case##
```
system anomaly log
system attack log
system ddos-attack log
!
system ipsec packet-round-robin
system ipsec crypto-core 12
system ipsec crypto-mem 3
!
partition partitiion1 id 22
!
terminal idle-timeout 0
!
class-list kkkk ac
  user-tag Security
!
ip access-list SLi_vip_005a_acl
  remark "SSLi default"
```
### AXAPI Test Case
API1. 
**URL:** /axapi/v3/admin/oper 
**Method: **GET
**Response Expected:**
```
{
 admin: {
 xxxx:xxxx
 }
}
```

API2.
**URL**: /axapi/v3/admin
**Method**: POST
**Input**: 
```
{
}
```
**Response Expected:**
```
{

}
```

### GUI Config Steps

1. Config Name for example
**Input:** some params
**Expected Result:** some error or output result

2. xxxxx
xxxxxxxxxx
