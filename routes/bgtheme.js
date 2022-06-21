const express = require('express')
const router = express.Router()

// //Config
const config = require('../config/default')
const file_config =  config.files
const base_path = file_config.basepath 

// // List of bgthemes
router.get('/', async(req, res) => {

	let filenames = ['bg1.svg', 'bg2.svg', 'bg3.svg', 'bg4.svg', 'bg5.svg', 'bg6.svg']
	
	return res.send(filenames.map(filename => {
		return `${base_path}static/theme/${filename}`
	}))
})

module.exports = router