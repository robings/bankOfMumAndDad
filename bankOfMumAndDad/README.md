# API Endpoints

## Account

### GET

**/api/Account/{id}** - Gets an account by Id

- Url Params:
  - id=[integer]
- Data Params:
  - Required: None
  - Optional: None
  - Sends: None
- Returns:
  - if successful:
    - `status 200`
    - `{ "success": true, "message": "Account details returned.", "data": [ { retrieved data } ] }`
  - if unsuccessful:
    - `status 405`
    - `{ "success": false, "message": "Account not found.", "data": [] }`
    - `status 500`
    - `{ "success": false, "message": "error message", "data": [] }`

### GET

**/api/Account/all** - Gets all accounts

- Data Params:
  - Required:
    - None
  - Optional:
    - None
- Returns:
  - if successful:
    - `status 200`
    - `{ "success": true, "message": "Account details returned.", "data": [ { retrieved data } ] }`
  - if unsuccessful:
    - `status 405`
    - `{ "success": false, "message": "Account not found.", "data": [] }`
    - `status 500`
    - `{ "success": false, "message": "error message", "data": [] }`

### POST

**/api/Account** - Adds an account

- Data Params:
  - Required:
    - `firstName` - updated first name of account holder
    - `lastName` - updated last name of account holder
    - `openingBalance` - the opening balance of the account
    - `currentBalance` - the current balance of the account
  - Optional:
    - None
- Sends:
  - `{ "firstName": "string", "lastName": "string", "openingBalance": decimal, "currentBalance": decimal }`
- Returns:
  - if successful:
    - `status 200`
    - `{ "success": true, "message": "Successfully created account.", "data": [ { retrieved data } ] }`
  - if unsuccessful:
    - `status 400`
    - `{ "success": false, "message": "Validation error.", "data": [] }`
    - `status 500`
    - `{ "success": false, "message": "error message", "data": [] }`

### PUT

**/api/Account** - Edits an account

- Data Params:
  - Required:
    - `id` - The Account Id
  - Optional:
    - `firstName` - updated first name of account holder
    - `lastName` - updated last name of account holder
    - `currentBalance` - the current balance of the account
- Sends:
  - `{ "id": long, "firstName": "string", "lastName": "string", "currentBalance": decimal }`
- Returns:
  - if successful:
    - `status 200`
    - `{ "success": true, "message": "Account details updated.", "data": [ { retrieved data } ] }`
  - if unsuccessful:
    - `status 400`
    - `{ "success": false, "message": "Validation error.", "data": [] }`
    - `status 405`
    - `{ "success": false, "message": "Account not found.", "data": [] }`
    - `status 500`
    - `{ "success": false, "message": "error message", "data": [] }`

### DELETE

**/api/Account** - Soft deletes an account by Id, along with any associated transactions

- Data Params:
  - Required:
    - `id` - The Account Id
  - Optional:
    - None
- Sends:
  - `{ "id": "long" }`
- Returns:
  - if successful:
    - `status 200`
    - `{ "success": true, "message": "Account successfully deleted.", "data": [ { retrieved data } ] }`
  - if unsuccessful:
    - `status 405`
    - `{ "success": false, "message": "Account not found.", "data": [] }`
    - `status 500`
    - `{ "success": false, "message": "error message", "data": [] }`

## Transaction

### GET

**/api/Transaction/{id}** - Gets transactions by account Id

- Url Params:
  - id=[integer]
- Data Params:
  - Required:
    - None
  - Optional:
    - None
- Sends:
  - None
- Returns:
  - if successful:
    - `status 200`
    - `{ "success": true, "message": "Transaction details returned.", "data": [ { retrieved data } ] }`
  - if unsuccessful:
    - `status 405`
    - `{ "success": false, "message": "Account not found.", "data": [] }`
    - `status 405`
    - `{ "success": false, "message": "No transactions found for account.", "data": [] }`
    - `status 500`
    - `{ "success": false, "message": "error message", "data": [] }`

### POST

**/api/Transaction** - Adds transaction

- Data Params:
  - Required:
    - `amount` - the amount of the transaction
    - `date` - the date of the transaction
    - `type` - either 0 - a deposit, or 1 a withdrawal
    - `comments` - string
    - `accountId` - the account Id
  - Optional:
    - None
- Sends:
  - `{ "amount": decimal, "date": "YYYY-MM-DD", "type": boolean, "comments": "string", "accountId": long }`
- Returns:
  - if successful:
    - `status 200`
    - `{ "success": true, "message": "Successfully added transaction.", "data": [] }`
  - if unsuccessful:
    - `status 400`
    - `{ "success": false, "message": "Validation error.", "data": [] }`
    - `status 400`
    - `{ "success": false, "message": "Transaction type error.", "data": [] }`
    - `status 500`
    - `{ "success": false, "message": "error message", "data": [] }`

### PUT

**/api/Transaction** - Not supported
- Returns:
  - `status 405`
  - `{ "success": false, "message": "Action not supported", "data": [] }`

### DELETE

**/api/Transaction** - Not supported
- Returns:
  - `status 405`
  - `{ "success": false, "message": "Action not supported", "data": [] }`
