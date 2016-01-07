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

  '*' : true, // Di base tutte le operazioni sono autorizzate

  // Elenco dei casi particolari
  
  'UserController' : {
    'destroy' : false, // Eliminazione non consentita
    'follow' : ['isAuthorized', 'findUser'],
    'unfollow' : ['isAuthorized', 'findUser'],
    'getFollowers' : 'findUser',
    'getFollowing' : 'findUser',
    'areYouFollowing' : ['isAuthorized', 'findUser'],
    'isFollowing' : 'findUser'
  },

  'PostController' : {
    'create' : 'isAuthorized'
  },

  'CollectionController' : {
    'create' : 'isAuthorized',
    'destroy' : ['isAuthorized', 'isCollectionAuthor'],
    'addRecipe' : ['isAuthorized', 'isCollectionAuthor', 'findCollection'],
    'removeRecipe' : ['isAuthorized', 'isCollectionAuthor', 'findCollection'],
    'getRecipes' : 'findCollection',
    'follow' : ['isAuthorized', 'findCollection'],
    'unfollow' : ['isAuthorized', 'findCollection'],
    'getFollowers' : true,
    'areYouFollowing' : ['isAuthorized', 'findCollection']
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
    'find' : true,
    'findOne' : ['attachUser','setRecipeViewed'],
    'destroy' : ['isAuthorized', 'isRecipeAuthor'],
    'uploadCoverImage' : ['isAuthorized', 'isRecipeAuthor']
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
  
  'TryRecipeController' : {
    'create' : ['isAuthorized', 'findRecipe'],
    'find' : 'findRecipe',
    'findOne' : false,
    'destroy' : ['isAuthorized', 'findRecipe'],// isAuthor è implicito
    'checkTry' : ['isAuthorized', 'findRecipe']
  },
  
  'TryRecipeDetailController' : {
    'create' : ['isAuthorized', 'findRecipe', 'findUserTryRecipe'],
    'destroy' : ['isAuthorized', 'findRecipe', 'findUserTryRecipe'],
    'update' : ['isAuthorized', 'findRecipe', 'findUserTryRecipe']
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
