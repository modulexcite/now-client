# 𝚫 now client

[![Build Status](https://travis-ci.org/zeit/now-client.svg?branch=master)](https://travis-ci.org/zeit/now-client)

Node.js module to interact with the official [𝚫 now API](https://zeit.co/api).

You need to provide your API token, which you can obtain [here](https://zeit.co/account#api-tokens).
It is possible to pass it as a parameter or with the `NOW_TOKEN` environment variable.
When no token is given, it will use the one contained in your `~/.now.json` file.

```sh
$ npm install --save now-client
```

## Examples

Here are a few snippets on how to use this package in your project:

### ES2015

```js
import nowClient from 'now-client'

const now = nowClient('YOUR TOKEN')

let deployments

try {
  deployments = await now.getDeployments()
} catch (err) {
  console.error(err)
}

console.log(deployments)
```

### Older ES


```js
const nowClient = require('now-client')
const now = nowClient('YOUR TOKEN')

// Supports Promises
now.getDeployments().then(deployments => {
  console.log(deployments)
}).catch(err => {
  console.error(err)
})
```

## API Reference

**Kind**: global class  

* [Now](#Now)
    * [new Now([token])](#new_Now_new)
    * [.getDeployments()](#Now+getDeployments) ⇒ <code>Promise</code>
    * [.getDeployment(id)](#Now+getDeployment) ⇒ <code>Promise</code>
    * [.createDeployment(body)](#Now+createDeployment) ⇒ <code>Promise</code>
    * [.deleteDeployment(id)](#Now+deleteDeployment) ⇒ <code>Promise</code>
    * [.getFiles(id)](#Now+getFiles) ⇒ <code>Promise</code>
    * [.getFile(id, fileId)](#Now+getFile) ⇒ <code>Promise</code>
    * [.getAliases([id])](#Now+getAliases) ⇒ <code>Promise</code>
    * [.createAlias(id, alias)](#Now+createAlias) ⇒ <code>Promise</code>
    * [.deleteAlias(id)](#Now+deleteAlias) ⇒ <code>Promise</code>
    * [.getSecrets([id])](#Now+getSecrets) ⇒ <code>Promise</code>
    * [.createSecret(name, value)](#Now+createSecret) ⇒ <code>Promise</code>
    * [.renameSecret(id, name)](#Now+renameSecret) ⇒ <code>Promise</code>
    * [.deleteSecret(id)](#Now+deleteSecret) ⇒ <code>Promise</code>

<a name="new_Now_new"></a>

### new Now([token])
Initializes the API. Looks for token in ~/.now.json if none is provided.


| Param | Type | Description |
| --- | --- | --- |
| [token] | <code>String</code> | Your now API token. |

<a name="Now+getDeployments"></a>

### now.getDeployments() ⇒ <code>Promise</code>
Returns an array with all deployments.

**Kind**: instance method of <code>[Now](#Now)</code>  
**See**: https://zeit.co/api#list-endpoint  
<a name="Now+getDeployment"></a>

### now.getDeployment(id) ⇒ <code>Promise</code>
Returns an object with deployment data.

**Kind**: instance method of <code>[Now](#Now)</code>  
**See**: https://zeit.co/api#get-endpoint  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | ID of deployment |

<a name="Now+createDeployment"></a>

### now.createDeployment(body) ⇒ <code>Promise</code>
Creates a new deployment and returns its data.

**Kind**: instance method of <code>[Now](#Now)</code>  
**See**: https://zeit.co/api#instant-endpoint  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> | Object a package key (for package.json data). The other keys should represent a file path, with their respective values containing the file contents. |

<a name="Now+deleteDeployment"></a>

### now.deleteDeployment(id) ⇒ <code>Promise</code>
Deletes a deployment and returns its data.

**Kind**: instance method of <code>[Now](#Now)</code>  
**See**: https://zeit.co/api#rm-endpoint  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | ID of deployment |

<a name="Now+getFiles"></a>

### now.getFiles(id) ⇒ <code>Promise</code>
Returns an array with the file structure.

**Kind**: instance method of <code>[Now](#Now)</code>  
**See**: https://zeit.co/api#file-structure-endpoint  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | ID of deployment |

<a name="Now+getFile"></a>

### now.getFile(id, fileId) ⇒ <code>Promise</code>
Returns the content of a file either as string or object, depending on the filetype.

**Kind**: instance method of <code>[Now](#Now)</code>  
**See**: https://zeit.co/api#file--endpoint  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | ID of deployment |
| fileId | <code>String</code> | ID of the file |

<a name="Now+getAliases"></a>

### now.getAliases([id]) ⇒ <code>Promise</code>
Returns an array with all aliases.

**Kind**: instance method of <code>[Now](#Now)</code>  
**See**: https://zeit.co/api#user-aliases  

| Param | Type | Description |
| --- | --- | --- |
| [id] | <code>String</code> &#124; <code>function</code> | ID of deployment |

<a name="Now+createAlias"></a>

### now.createAlias(id, alias) ⇒ <code>Promise</code>
Creates an alias for the given deployment.

**Kind**: instance method of <code>[Now](#Now)</code>  
**See**: https://zeit.co/api#create-alias  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | ID of deployment |
| alias | <code>String</code> | Hostname or custom url for the alias |

<a name="Now+deleteAlias"></a>

### now.deleteAlias(id) ⇒ <code>Promise</code>
Deletes an alias and returns a status.

**Kind**: instance method of <code>[Now](#Now)</code>  
**See**: https://zeit.co/api#delete-user-aliases  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | ID of alias |

<a name="Now+getSecrets"></a>

### now.getSecrets([id]) ⇒ <code>Promise</code>
Returns an array with all secrets.

**Kind**: instance method of <code>[Now](#Now)</code>  
**See**: https://zeit.co/api#get-now-secrets  

| Param | Type | Description |
| --- | --- | --- |
| [id] | <code>String</code> | ID of deployment |

<a name="Now+createSecret"></a>

### now.createSecret(name, value) ⇒ <code>Promise</code>
Creates a secret and returns its ID.

**Kind**: instance method of <code>[Now](#Now)</code>  
**See**: https://zeit.co/api#post-now-secrets  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | name for the secret |
| value | <code>String</code> | value for the secret |

<a name="Now+renameSecret"></a>

### now.renameSecret(id, name) ⇒ <code>Promise</code>
Changes the name of the given secret and returns its ID and name.

**Kind**: instance method of <code>[Now](#Now)</code>  
**See**: https://zeit.co/api#patch-now-secrets  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | id or name of the secret |
| name | <code>String</code> | new name for the secret |

<a name="Now+deleteSecret"></a>

### now.deleteSecret(id) ⇒ <code>Promise</code>
Deletes a secret and returns its ID.

**Kind**: instance method of <code>[Now](#Now)</code>  
**See**: https://zeit.co/api#delete-user-aliases  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | ID or name of the secret |

