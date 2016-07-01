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
    'uploadCoverImage': ['isAuthorized', 'findUser'],
    'getLastSeen': ['isAuthorized']
  },

  'CollectionController' : {
    'create' : 'isAuthorized',
    'destroy' : ['isAuthorized', 'isCollectionAuthor']
  },
  
  'ViewCollectionController' : {
      'create' : ['isAuthorized', 'findCollection']
  },

  'CommentController' : {
    'create' : ['isAuthorized', 'findRecipe'],
    'update' : ['isAuthorized', 'isCommentAuthor', 'findRecipe'],
    'destroy' : ['isAuthorized', 'isCommentAuthor', 'findRecipe'],
    'find' : 'findRecipe',
    'findOne' : 'findRecipe'
  },

  'RecipeController' : {
    'create' : 'isAuthorized',
    'update' : ['isAuthorized', 'isRecipeAuthor'],
    'findOne' : ['attachUser','setRecipeViewed'],
    'destroy' : ['isAuthorized', 'isRecipeAuthor', 'findRecipe'],
    'uploadCoverImage' : ['isAuthorized', 'isRecipeAuthor'],
    'uploadBlurredCoverImage' : ['isAuthorized', 'isRecipeAuthor'],
    'uploadImage' : ['isAuthorized', 'isRecipeAuthor']
  },
  
  'RecipeStepController' : {
    'create' : ['isAuthorized', 'isRecipeAuthor'],
    'update' : ['isAuthorized', 'isRecipeAuthor'],
    'destroy' : ['isAuthorized', 'isRecipeAuthor'],
    'findSteps' : ['findRecipe'],
  },

  'IngredientGroupController' : {
    'create' : ['isAuthorized', 'isRecipeAuthor'],
    'update' : ['isAuthorized', 'isRecipeAuthor'],
    'destroy' : ['isAuthorized', 'isRecipeAuthor']
  },

  'IngredientController' : {
    'create' : ['isAuthorized', 'isRecipeAuthor', 'findIngredientGroup'],
    'update' : ['isAuthorized', 'isRecipeAuthor', 'findIngredientGroup'],
    'destroy' : ['isAuthorized', 'isRecipeAuthor', 'findIngredientGroup']
  },

  'VoteRecipeController' : {
    'create' : false,
    'find' : false,
    'findOne' : false,
    'destroy' : ['isAuthorized', 'findRecipe'],// isAuthor è implicito
    'createUpvote' : ['isAuthorized', 'findRecipe'],
    'createDownvote' : ['isAuthorized', 'findRecipe'],
    'checkVote' : ['isAuthorized', 'findRecipe'],
    'findUpvotes' : 'findRecipe',
    'findDownvotes' : 'findRecipe'
  },
  
  'VoteCommentController' : {
    'create' : false,
    'find' : false,
    'findOne' : false,
    'destroy' : ['isAuthorized', 'findComment'],// isAuthor è implicito
    'createUpvote' : ['isAuthorized', 'findComment'],
    'createDownvote' : ['isAuthorized', 'findComment'],
    'checkVote' : ['isAuthorized', 'findComment'],
    'findUpvotes' : 'findComment',
    'findDownvotes' : 'findComment'
  },
  
  'ViewRecipeController' : {
      'create' : ['isAuthorized', 'findRecipe']
  },
  
  'TryRecipeController' : {
    'create' : ['isAuthorized', 'findRecipe'],
    'find' : 'findRecipe',
    'findOne' : false,
    'destroy' : ['isAuthorized', 'findRecipe'],// isAuthor è implicito
    'checkTry' : ['isAuthorized', 'findRecipe']
  },
  
  'ReviewRecipeController' : {
    'create' : ['isAuthorized', 'findRecipe'],
    'destroy' : ['isAuthorized', 'isReviewAuthor', 'findRecipe'],
    'update' : ['isAuthorized', 'findRecipe'],
    'find' : 'findRecipe',
    'checkReview' : ['isAuthorized', 'findRecipe'],
    'getTotalValueForTypology' : 'findRecipe',
  },
  
  'ReportRecipeController' : {
    'create' : ['isAuthorized', 'findRecipe'],
    'find' : 'findRecipe'
  },

  'FollowCollectionController' : {
    'create' : ['isAuthorized', 'findCollection'],
    'find' : 'findRecipe',
    'areYouFollowing' : ['isAuthorized', 'findCollection']
  },

  'CollectionRecipeController' : {
    'create' : ['isAuthorized', 'findCollection'],
    'destroy' : ['isAuthorized', 'isCollectionAuthor'],
    'getRecipes' : 'findCollection'
  },

  'FollowUserController' : {
    'create' : ['isAuthorized', 'findUser'],
    'getFollowers' : 'findUser',
    'getFollowing' : 'findUser',
    'areYouFollowing' : ['isAuthorized', 'findUser'],
    'isFollowing' : 'findUser',
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
