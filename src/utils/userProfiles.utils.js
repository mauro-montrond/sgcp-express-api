const profileController = require('../controllers/profile.controller');

exports.getProfiles = (req, res, next) =>{
    let profileList = profileController.getProfilesByParams(req, res, next);
    console.log( "all profiles: " + profileList );
    return profileList;
}