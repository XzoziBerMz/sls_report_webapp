
(function($, window, axios) {
    const endpoint = {
         getPokemon:`/get-pokemon`,
        
    }
    
    function getInsert(body = {}, token) {

        return axios({
            method: 'post',
            url: `http://127.0.0.1:4444/api/v1/chat/daily-insert`,
            // url: endpoint.getKeyReview,
            // url: basePath + endpoint.getKeyReview,
            data: { ...body },
            headers: { "x-auth-token": token }
        });
    }

    const services = {
        getInsert,
    };
    window.services = services;
})(jQuery, window, axios);