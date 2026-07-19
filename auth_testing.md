# Auth Testing Playbook — EuroKredit

## Step 1: MongoDB Verification
```
mongosh
use test_database
db.users.find({role: "admin"}).pretty()
db.users.findOne({role: "admin"}, {password_hash: 1})
```
Verify: bcrypt hash starts with `$2b$`. Indexes exist on users.email (unique).

## Step 2: API tests
```
API=https://credit-easy-2.preview.emergentagent.com
curl -c /tmp/c.txt -X POST "$API/api/auth/login" -H "Content-Type: application/json" -d '{"email":"admin@eurokredit.fr","password":"Admin2026!"}'
curl -b /tmp/c.txt "$API/api/auth/me"
```

Register + list personal apps:
```
curl -c /tmp/c2.txt -X POST "$API/api/auth/register" -H "Content-Type: application/json" -d '{"name":"Test","email":"client.test@eurokredit.fr","password":"Client2026!"}'
curl -b /tmp/c2.txt "$API/api/applications/me"
```
