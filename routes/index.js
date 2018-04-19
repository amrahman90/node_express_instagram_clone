var express = require('express');
var router = express.Router();
var utils = require("../utils")
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/:username', (req, res) => {
	const username = req.params.username
	const instagramAPI = 'https://www.instagram.com/'+username+'/?__a=1'

	utils.HTTP.get(instagramAPI, null)
	.then(data => {
	//	data['cdn'] = process.env.TURBO_CDN
		res.render('index',{followers: data.graphql.user.edge_followed_by.count, user: data.graphql.user})
	})
	.catch(err => {
		const data = {
			message: err.message || 'Check your spelling!'
		}
		res.render('error', data)
	})
})

router.get('/:username/:postcode', (req, res) => {
	const username = req.params.username
	const postcode = req.params.postcode

	const instagramAPI = 'https://www.instagram.com/'+username+'/?__a=1'

	utils.HTTP.get(instagramAPI, null)
	.then(data => {
		const user = data.graphql.user
		const posts = user.edge_owner_to_timeline_media.edges
		let selectedPost = null


		for (let i=0; i<posts.length; i++){
			const post = posts[i].node
			console.log(post)
			if (post.shortcode == postcode){
				selectedPost = post
				break
			}
		}
		if (selectedPost == null){
			throw new Error('Post not found!')
			return
		}
		selectedPost['user'] = {
			username: user.username,
			icon: user.profile_pic_url
		}

		res.render('post', selectedPost)
		return
	})
	.catch(err => {
		const data = {
			message: err.message || 'Check your spelling!'
		}
		res.render('error', data)
		return
	})
})

module.exports = router
