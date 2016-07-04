/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  //'*':'postParam',

  /*
  PostController: {
      // Apply 'postParam' to the 'upvote' action.
      upvote: 'postParam'
  },*/
  /*
  CommentController: {
      // Apply 'postParam' and 'commentParam' to the 'create' action.
      create: ['postParam', 'commentParam'],
      upvote: 'commentParam'
  },*/

  // Le seguenti sono policy non bloccanti e servono a tutti gli end-point
  //In realtà servono solo agli end-point che non sono definiti qui di seguito...
  '*' : ['attachUser', 'updateUserStats'], // Di base tutte le operazioni sono autorizzate

  // Elenco dei casi particolari
  
  'UserController' : {
    'destroy' : false, // Eliminazione non consentita
    'uploadCoverImage': ['isAuthorized', 'findUser', 'updateUserStats'],
    'getLastSeen': ['isAuthorized']
  },

  'CollectionController' : {
    'create' : ['isAuthorized', 'updateUserStats'],
    'destroy' : ['isAuthorized', 'isCollectionAuthor', 'updateUserStats']
  },
  
  'ViewCollectionController' : {
      'create' : ['isAuthorized', 'findCollection', 'updateUserStats']
  },

  'CommentController' : {
    'create' : ['isAuthorized', 'findRecipe', 'updateUserStats'],
    'update' : ['isAuthorized', 'isCommentAuthor', 'findRecipe', 'updateUserStats'],
    'destroy' : ['isAuthorized', 'isCommentAuthor', 'findRecipe', 'updateUserStats'],
    'find' : ['findRecipe', 'attachUser', 'updateUserStats'],
    'findOne' : ['findRecipe', 'attachUser', 'updateUserStats']
  },

  'RecipeController' : {
    'create' : ['isAuthorized', 'updateUserStats'],
    'update' : ['isAuthorized', 'isRecipeAuthor', 'updateUserStats'],
    'findOne' : ['attachUser','setRecipeViewed', 'updateUserStats'],
    'destroy' : ['isAuthorized', 'isRecipeAuthor', 'findRecipe', 'updateUserStats'],
    'uploadCoverImage' : ['isAuthorized', 'isRecipeAuthor', 'updateUserStats'],
    'uploadBlurredCoverImage' : ['isAuthorized', 'isRecipeAuthor', 'updateUserStats'],
    'uploadImage' : ['isAuthorized', 'isRecipeAuthor', 'updateUserStats']
  },
  
  'RecipeStepController' : {
    'create' : ['isAuthorized', 'isRecipeAuthor', 'updateUserStats'],
    'update' : ['isAuthorized', 'isRecipeAuthor', 'updateUserStats'],
    'destroy' : ['isAuthorized', 'isRecipeAuthor', 'updateUserStats'],
    'findSteps' : ['findRecipe', 'attachUser', 'updateUserStats']
  },

  'IngredientGroupController' : {
    'create' : ['isAuthorized', 'isRecipeAuthor', 'updateUserStats'],
    'update' : ['isAuthorized', 'isRecipeAuthor', 'updateUserStats'],
    'destroy' : ['isAuthorized', 'isRecipeAuthor', 'updateUserStats']
  },

  'IngredientController' : {
    'create' : ['isAuthorized', 'isRecipeAuthor', 'findIngredientGroup', 'updateUserStats'],
    'update' : ['isAuthorized', 'isRecipeAuthor', 'findIngredientGroup', 'updateUserStats'],
    'destroy' : ['isAuthorized', 'isRecipeAuthor', 'findIngredientGroup', 'updateUserStats']
  },

  'VoteRecipeController' : {
    'create' : false,
    'find' : false,
    'findOne' : false,
    'destroy' : ['isAuthorized', 'findRecipe', 'updateUserStats'],// isAuthor è implicito
    'createUpvote' : ['isAuthorized', 'findRecipe', 'updateUserStats'],
    'createDownvote' : ['isAuthorized', 'findRecipe', 'updateUserStats'],
    'checkVote' : ['isAuthorized', 'findRecipe', 'updateUserStats'],
    'findUpvotes' : ['findRecipe', 'attachUser', 'updateUserStats'],
    'findDownvotes' : ['findRecipe', 'attachUser', 'updateUserStats']
  },
  
  'VoteCommentController' : {
    'create' : false,
    'find' : false,
    'findOne' : false,
    'destroy' : ['isAuthorized', 'findComment'],// isAuthor è implicito
    'createUpvote' : ['isAuthorized', 'findComment'],
    'createDownvote' : ['isAuthorized', 'findComment'],
    'checkVote' : ['isAuthorized', 'findComment'],
    'findUpvotes' : ['findComment', 'attachUser', 'updateUserStats'],
    'findDownvotes' : ['findComment', 'attachUser', 'updateUserStats']
  },
  
  'ViewRecipeController' : {
      'create' : ['isAuthorized', 'findRecipe', 'updateUserStats']
  },
  
  'TryRecipeController' : {
    'create' : ['isAuthorized', 'findRecipe', 'updateUserStats'],
    'find' : ['findRecipe', 'attachUser', 'updateUserStats'],
    'findOne' : false,
    'destroy' : ['isAuthorized', 'findRecipe', 'updateUserStats'],// isAuthor è implicito
    'checkTry' : ['isAuthorized', 'findRecipe', 'updateUserStats']
  },
  
  'ReviewRecipeController' : {
    'create' : ['isAuthorized', 'findRecipe', 'updateUserStats'],
    'destroy' : ['isAuthorized', 'isReviewAuthor', 'findRecipe', 'updateUserStats'],
    'update' : ['isAuthorized', 'findRecipe', 'updateUserStats'],
    'find' : ['findRecipe', 'attachUser', 'updateUserStats'],
    'checkReview' : ['isAuthorized', 'findRecipe', 'updateUserStats'],
    'getTotalValueForTypology' : ['findRecipe', 'attachUser', 'updateUserStats']
  },
  
  'ReportRecipeController' : {
    'create' : ['isAuthorized', 'findRecipe', 'updateUserStats'],
    'find' : ['findRecipe', 'attachUser', 'updateUserStats']
  },

  'FollowCollectionController' : {
    'create' : ['isAuthorized', 'findCollection', 'updateUserStats'],
    'find' : ['findRecipe', 'attachUser', 'updateUserStats'],
    'areYouFollowing' : ['isAuthorized', 'findCollection', 'updateUserStats']
  },

  'CollectionRecipeController' : {
    'create' : ['isAuthorized', 'findCollection', 'updateUserStats'],
    'destroy' : ['isAuthorized', 'isCollectionAuthor', 'updateUserStats'],
    'getRecipes' : ['findCollection', 'attachUser', 'updateUserStats']
  },

  'FollowUserController' : {
    'create' : ['isAuthorized', 'findUser', 'updateUserStats'],
    'getFollowers' : ['findUser', 'attachUser', 'updateUserStats'],
    'getFollowing' : ['findUser', 'attachUser', 'updateUserStats'],
    'areYouFollowing' : ['isAuthorized', 'findUser', 'updateUserStats'],
    'isFollowing' : ['findUser', 'attachUser', 'updateUserStats']
  }



  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
	// RabbitController: {

		// Apply the `false` policy as the default for all of RabbitController's actions
		// (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
		// '*': false,

		// For the action `nurture`, apply the 'isRabbitMother' policy
		// (this overrides `false` above)
		// nurture	: 'isRabbitMother',

		// Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
		// before letting any users feed our rabbits
		// feed : ['isNiceToAnimals', 'hasRabbitFood']
	// }
};
