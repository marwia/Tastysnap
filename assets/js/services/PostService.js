// assets/js/services/PostService.js
angular.module('PostService', []).factory('posts', ['$http', 'auth', function($http, auth){
// service body
var o = {
    posts: []
};

// dichiaro una funzione di questa factory
// questa richiede tutti i post al server
o.getAll = function() {
    return $http.get('/api/v1/post').success(function(data){
        angular.copy(data, o.posts);
    });
};

// questa richiede di creare un nuovo post
o.create = function(post) {
    return $http.post('/api/v1/post', post, {
        headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
        o.posts.push(data);
    });
};

o.upvote = function(post) {
    return $http.put('/api/v1/post/' + post.id + '/upvote', null, {
        headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
        post.upvotes += 1;
    });
};

o.get = function(id) {
    return $http.get('/api/v1/post/' + id).then(function(res){
        return res.data;
    });
};

o.addComment = function(id, comment) {
    return $http.post('/api/v1/post/' + id + '/comment', comment, {
        headers: {Authorization: 'Bearer '+auth.getToken()}
    });
};

o.upvoteComment = function(post, comment) {
    return $http.put('/api/v1/post/' + post.id + '/comment/'+ comment.id + '/upvote', null, {
        headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
        comment.upvotes += 1;
    });
};

return o;
}]);
