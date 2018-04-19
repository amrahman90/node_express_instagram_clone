const superagent = require('superagent')
const Promise = require('bluebird')

module.exports = {

	get: (url, query) => {

		return new Promise((resolve, reject) => {
			superagent.get(url)
			.query(query)
			.set('Accept', 'application/json')
			.end((err, response) => {
				if (err){
					reject(err)
					return
				}

				resolve(response.body)
				// res.render('index', response.body)	
			})
		})
	}

}