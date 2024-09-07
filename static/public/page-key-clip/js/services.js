
(function($, window, axios) {
    const endpoint = {
         getPokemon:`/get-pokemon`,
        
    }

    
    function getInsertVdoHandler(body = {}, token) {

        return axios({
            method: 'post',
            url: `http://127.0.0.1:4444/api/v1/vdo/insert`,
            // url: endpoint.getKeyReview,
            // url: basePath + endpoint.getKeyReview,
            data: { ...body },
            headers: { "x-auth-token": token }
        });
    }
    
    function getChannel (token) {
        return axios({
            method: 'get',
            url: `http://127.0.0.1:4444/api/v1/vdo/list-channel`,
            headers: { "x-auth-token": token }
        });
    }
    function getvdo (token) {
        return axios({
            method: 'get',
            url: `http://127.0.0.1:4444/api/v1/vdo/list-product`,
            headers: { "x-auth-token": token }
        });
    }

    const services = {
        getChannel,
        getvdo,
        getInsertVdoHandler,
    };
    window.services = services;
})(jQuery, window, axios);