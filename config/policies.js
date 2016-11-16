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
  '*' : ['attachUser'], // Di base tutte le operazioni sono autorizzate

  // Elenco dei casi particolari
  
  'UserController' : {
    'destroy' : false, // Eliminazione non consentita
    'uploadCoverImage': ['isAuthorized', 'findUser'],
    'getLastSeen': ['isAuthorized'],
    'registerToNotifications' : ['isAuthorized'],
  },

  'CollectionController' : {
    'create' : ['isAuthorized'],
    'destroy' : ['isAuthorized', 'isCollectionAuthor'],
    'findOne' : 'attachUser', // includo l'utente per il conteggio delle visualizzazioni e per togliere le collection private di altri utenti
    'find' : 'attachUser', // includo l'utente per togliere le collection private di altri utenti
    'update': ['isAuthorized', 'isCollectionAuthor']
  },
  
  'ViewCollectionController' : {
      'create' : false, // Operazione eseguita quando si richiede una collection
      'destroy': false, // Operazione vietata
      'update': false // Operazione vietata
  },

  'CommentController' : {
    'create' : ['isAuthorized', 'findRecipe'],
    'update' : ['isAuthorized', 'isCommentAuthor', 'findRecipe'],
    'destroy' : ['isAuthorized', 'isCommentAuthor', 'findRecipe'],
    'find' : ['findRecipe'],
    'findOne' : ['findRecipe']
  },

  'RecipeController' : {
    'create' : ['isAuthorized'],
    'update' : ['isAuthorized', 'isRecipeAuthor'],
    'findOne' : 'attachUser', // includo l'utente per il conteggio delle visualizzazioni
    'destroy' : ['isAuthorized', 'isRecipeAuthor', 'findRecipe'],
    'uploadCoverImage' : ['isAuthorized', 'isRecipeAuthor'],
    'uploadBlurredCoverImage' : ['isAuthorized', 'isRecipeAuthor'],
    'uploadImage' : ['isAuthorized', 'isRecipeAuthor']
  },
  
  'RecipeStepController' : {
    'create' : ['isAuthorized', 'isRecipeAuthor'],
    'update' : ['isAuthorized', 'isRecipeAuthor'],
    'destroy' : ['isAuthorized', 'isRecipeAuthor'],
    'findSteps' : ['findRecipe']
  },

  'IngredientGroupController' : {
    'create' : ['isAuthorized', 'isRecipeAuthor'],
    'update' : ['isAuthorized', 'isRecipeAuthor'],
    'destroy' : ['isAuthorized', 'isRecipeAuthor']
  },

  'IngredientController' : {
    'create' : ['isAuthorized', 'isRecipeAuthor', 'findIngredientGroup'],
    'update' : ['isAuthorized', 'isRecipeAuthor', 'findIngredientGroup'],
    'destroy' : ['isAuthorized', 'isRecipeAuthor', 'findIngredientGroup'],
    'addIngredientReq': 'isAuthorized'
  },

  'VoteRecipeController' : {
    'create' : false,
    'find' : false,
    'findOne' : false,
    'destroy' : ['isAuthorized', 'findRecipe'],// isAuthor è implicito
    'createUpvote' : ['isAuthorized', 'findRecipe'],
    'createDownvote' : ['isAuthorized', 'findRecipe'],
    'checkVote' : ['isAuthorized', 'findRecipe'],
    'findUpvotes' : ['findRecipe'],
    'findDownvotes' : ['findRecipe']
  },
  
  'VoteCommentController' : {
    'create' : false,
    'find' : false,
    'findOne' : false,
    'destroy' : ['isAuthorized', 'findComment'],// isAuthor è implicito
    'createUpvote' : ['isAuthorized', 'findComment'],
    'createDownvote' : ['isAuthorized', 'findComment'],
    'checkVote' : ['isAuthorized', 'findComment'],
    'findUpvotes' : ['findComment'],
    'findDownvotes' : ['findComment']
  },
  
  'ViewRecipeController' : {
      'create' : false, // Operazione eseguita quando si richiede una ricetta
      'destroy': false, // Operazione vietata
      'update': false // Operazione vietata
  },
  
  'TryRecipeController' : {
    'create' : ['isAuthorized', 'findRecipe'],
    'find' : ['findRecipe'],
    'findOne' : false,
    'destroy' : ['isAuthorized', 'findRecipe'],// isAuthor è implicito
    'checkTry' : ['isAuthorized', 'findRecipe']
  },
  
  'ReviewRecipeController' : {
    'create' : ['isAuthorized', 'findRecipe'],
    'destroy' : ['isAuthorized', 'isReviewAuthor', 'findRecipe'],
    'update' : ['isAuthorized', 'findRecipe'],
    'find' : ['findRecipe'],
    'checkReview' : ['isAuthorized', 'findRecipe'],
    'getTotalValueForTypology' : ['findRecipe']
  },
  
  'ReportRecipeController' : {
    'create' : ['isAuthorized', 'findRecipe'],
    'find' : ['findRecipe']
  },

  'FollowCollectionController' : {
    'create' : ['isAuthorized', 'findCollection'],
    'find' : ['findRecipe'],
    'areYouFollowing' : ['isAuthorized', 'findCollection'],
    'destroy': ['isAuthorized', 'findCollection']
  },

  'CollectionRecipeController' : {
    'create' : ['isAuthorized', 'findCollection', 'findRecipe'],
    'destroy' : ['isAuthorized', 'isCollectionAuthor'],
    'getRecipes' : ['findCollection']
  },

  'FollowUserController' : {
    'create' : ['isAuthorized', 'findUser'],
    'destroy': ['isAuthorized', 'findUser'],
    'getFollowers' : ['findUser'],
    'getFollowing' : ['findUser'],
    'areYouFollowing' : ['isAuthorized', 'findUser'],
    'isFollowing' : ['findUser']
  },

  'NotificationController' : {
    'create' : false,
    'update' : false,
    'findOne' : false,
    'find' : 'isAuthorized',
    'findActivity' : 'isAuthorized',
    'red' : ['isAuthorized', 'isNotificationsRecipient'],
    'notRed' : ['isAuthorized', 'isNotificationsRecipient']
  },

  'RecipeRecommendationController' : {
    'recommendFor' : 'isAuthorized',
    'mostSimilarUsers' : 'isAuthorized',
    'leastSimilarUsers' : 'isAuthorized'
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
