/**
 * assets/js/services/RecipeService.js
 * 
 * Servizio per gestire le operazioni con il server che riguardano le ricette.
 */
angular.module('RecipeService', []).factory('recipes', ['$http', 'auth', function($http, auth){

var server_prefix = '/api/v1';
// service body
var o = {
    recipes: []
};

/**
 * Metodo per richiedere una lista di ricette.
 */
o.getAll = function() {
    return $http.get( server_prefix + '/recipe'  ).success(function(data){
        angular.copy(data, o.recipes);
    });
};

/*
o.create = function(post) {
    return $http.post( server_prefix+'/post', post, {
        headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
        o.posts.push(data);
    });
};

o.upvote = function(post) {
    return $http.put( server_prefix+'/post/' + post.id + '/upvote', null, {
        headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
        post.upvotes += 1;
    });
};

o.get = function(id) {
    return $http.get( server_prefix+'/post/' + id).then(function(res){
        return res.data;
    });
};

o.addComment = function(id, comment) {
    return $http.post( server_prefix+'/post/' + id + '/comment', comment, {
        headers: {Authorization: 'Bearer '+auth.getToken()}
    });
};

o.upvoteComment = function(post, comment) {
    return $http.put( server_prefix+'/post/' + post.id + '/comment/'+ comment.id + '/upvote', null, {
        headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
        comment.upvotes += 1;
    });
};
*/

return o;
}]);
