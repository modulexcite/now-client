const path = require('path')
const os = require('os')

const axios = require('axios')

const ERROR = {
  MISSING_ID: {
    code: 'missing_id',
    message: 'Missing `id` parameter'
  },
  MISSING_FILE_ID: {
    code: 'missing_file_id',
    message: 'Missing `fileId` parameter'
  },
  MISSING_BODY: {
    code: 'missing_body',
    message: 'Missing `body` parameter'
  },
  MISSING_PACKAGE: {
    code: 'missing_package',
    message: 'Missing `package` object in body'
  },
  MISSING_ALIAS: {
    code: 'missing_body',
    message: 'Missing `alias` parameter'
  },
  MISSING_NAME: {
    code: 'missing_name',
    message: 'Missing `name` parameter'
  },
  MISSING_VALUE: {
    code: 'missing_value',
    message: 'Missing `value` parameter'
  }
}

/**
 * Tries to obtain the API token and returns it.
 * If NOW_TOKEN isn't defined, it will search in the user's home directory
 * @return {String} – now API Token
 */
function _getToken() {
  let token = process.env.NOW_TOKEN

  if (!token) {
    try {
      const configPath = path.join(os.homedir(), '.now.json')
      token = require(configPath).token // eslint-disable-line global-require
    } catch (err) {
      console.error(`Error: ${err}`)
    }
  }

  return token
}

/**
 * Initializes the API. Looks for token in ~/.now.json if none is provided.
 * @constructor
 * @param {String} [token] - Your now API token.
 */
function Now(token = _getToken()) {
  if (!token) {
    return console.error(
      'No token found! ' +
      'Supply it as argument or use the NOW_TOKEN env variable. ' +
      '"~/.now.json" will be used, if it\'s found in your home directory.'
    )
  }

  if (!(this instanceof Now)) {
    return new Now(token)
  }

  this.token = token

  this.axios = axios.create({
    baseURL: 'https://api.zeit.co/now',
    timeout: 30000,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

Now.prototype = {
  // Handles errors with Promise
  handleError: function handleError(err) {
    return new Promise((resolve, reject) => {
      reject(err)
    })
  },

  // Processes requests
  handleRequest: function handleRequest(config, selector) {
    return new Promise((resolve, reject) => {
      this.axios.request(config)
        .then(res => {
          const data = selector ? res.data[selector] : res.data
          resolve(data)
        })
        .catch(err => {
          let errData
          if (err.data && err.data.err) {
            errData = err.data.err
          } else if (err.data) {
            errData = err.data
          } else {
            errData = err.toString()
          }
          reject(errData)
        })
    })
  },

  /**
   * Returns an array with all deployments.
   * @return {Promise}
   * @see https://zeit.co/api#list-endpoint
   */
  getDeployments: function getDeployments() {
    return this.handleRequest({
      url: '/deployments',
      method: 'get'
    }, 'deployments')
  },

  /**
   * Returns an object with deployment data.
   * @return {Promise}
   * @param  {String} id     ID of deployment
   * @see https://zeit.co/api#get-endpoint
   */
  getDeployment: function getDeployment(id) {
    if (!id) {
      return this.handleError(ERROR.MISSING_ID)
    }

    return this.handleRequest({
      url: `/deployments/${id}`,
      method: 'get'
    })
  },

  /**
   * Creates a new deployment and returns its data.
   * @return {Promise}
   * @param  {Object} body     Object a package key (for package.json data).
   * The other keys should represent a file path, with their respective values
   * containing the file contents.
   * @see https://zeit.co/api#instant-endpoint
   */
  createDeployment: function createDeployment(body) {
    if (!body) {
      return this.handleError(ERROR.MISSING_BODY)
    }

    if (!body.package) {
      return this.handleError(ERROR.MISSING_PACKAGE)
    }

    return this.handleRequest({
      url: '/deployments',
      method: 'post',
      data: body
    })
  },

  /**
   * Deletes a deployment and returns its data.
   * @return {Promise}
   * @param  {String} id     ID of deployment
   * @see https://zeit.co/api#rm-endpoint
   */
  deleteDeployment: function deleteDeployment(id) {
    if (!id) {
      return this.handleError(ERROR.MISSING_ID)
    }

    return this.handleRequest({
      url: `/deployments/${id}`,
      method: 'delete'
    })
  },

  /**
   * Returns an array with the file structure.
   * @return {Promise}
   * @param  {String} id     ID of deployment
   * @see https://zeit.co/api#file-structure-endpoint
   */
  getFiles: function getFiles(id) {
    if (!id) {
      return this.handleError(ERROR.MISSING_ID)
    }

    return this.handleRequest({
      url: `/deployments/${id}/files`,
      method: 'get'
    })
  },

  /**
   * Returns the content of a file either as string or object, depending on the filetype.
   * @return {Promise}
   * @param  {String} id     ID of deployment
   * @param  {String} fileId     ID of the file
   * @see https://zeit.co/api#file--endpoint
   */
  getFile: function getFile(id, fileId) {
    if (!id) {
      return this.handleError(ERROR.MISSING_ID)
    }

    if (!fileId) {
      return this.handleError(ERROR.MISSING_FILE_ID)
    }

    return this.handleRequest({
      url: `/deployments/${id}/files/${fileId}`,
      method: 'get'
    })
  },

  /**
   * Returns an array with all aliases.
   * @return {Promise}
   * @param  {String|Function} [id]     ID of deployment
   * @see https://zeit.co/api#user-aliases
   */
  getAliases: function getAliases(id) {
    return this.handleRequest({
      url: `/deployments/${id}/aliases`,
      method: 'get'
    }, 'aliases')
  },

  /**
   * Creates an alias for the given deployment.
   * @return {Promise}
   * @param  {String} id     ID of deployment
   * @param  {String} alias     Hostname or custom url for the alias
   * @see https://zeit.co/api#create-alias
   */
  createAlias: function createAlias(id, alias) {
    if (!id) {
      return this.handleError(ERROR.MISSING_ID)
    }

    if (!alias) {
      return this.handleError(ERROR.MISSING_ALIAS)
    }

    return this.handleRequest({
      url: `/deployments/${id}/aliases`,
      method: 'post',
      data: {
        alias
      }
    })
  },

  /**
   * Deletes an alias and returns a status.
   * @return {Promise}
   * @param  {String} id     ID of alias
   * @see https://zeit.co/api#delete-user-aliases
   */
  deleteAlias: function deleteAlias(id) {
    if (!id) {
      return this.handleError(ERROR.MISSING_ID)
    }

    return this.handleRequest({
      url: `/aliases/${id}`,
      method: 'delete'
    })
  },

  /**
   * Returns an array with all secrets.
   * @return {Promise}
   * @param  {String} [id]     ID of deployment
   * @see https://zeit.co/api#get-now-secrets
   */
  getSecrets: function getSecrets() {
    return this.handleRequest({
      url: '/secrets',
      method: 'get'
    }, 'secrets')
  },

  /**
   * Creates a secret and returns its ID.
   * @return {Promise}
   * @param  {String} name     name for the secret
   * @param  {String} value     value for the secret
   * @see https://zeit.co/api#post-now-secrets
   */
  createSecret: function createSecret(name, value) {
    if (!name) {
      return this.handleError(ERROR.MISSING_NAME)
    }

    if (!value) {
      return this.handleError(ERROR.MISSING_VALUE)
    }

    return this.handleRequest({
      url: '/secrets',
      method: 'post',
      data: {
        name,
        value
      }
    })
  },

  /**
   * Changes the name of the given secret and returns its ID and name.
   * @return {Promise}
   * @param  {String} id     id or name of the secret
   * @param  {String} name     new name for the secret
   * @see https://zeit.co/api#patch-now-secrets
   */
  renameSecret: function renameSecret(id, name) {
    if (!id) {
      return this.handleError(ERROR.MISSING_ID)
    }

    if (!name) {
      return this.handleError(ERROR.MISSING_NAME)
    }

    return this.handleRequest({
      url: `/secrets/${id}`,
      method: 'patch',
      data: {
        name
      }
    })
  },

  /**
   * Deletes a secret and returns its ID.
   * @return {Promise}
   * @param  {String} id     ID or name of the secret
   * @see https://zeit.co/api#delete-user-aliases
   */
  deleteSecret: function deleteSecret(id) {
    if (!id) {
      return this.handleError(ERROR.MISSING_ID)
    }

    return this.handleRequest({
      url: `/secrets/${id}`,
      method: 'delete'
    })
  }
}

module.exports = Now
