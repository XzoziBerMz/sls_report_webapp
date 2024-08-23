
(function($, window, axios) {
    const endpoint = {
         getPokemon:`/get-pokemon`,
        
    }
    
    function getPokemon (body = {}) {
        console.log( window.csrfToken)
        return axios({
            method: 'post',
            url: endpoint.getPokemon,
            data: {...body},
            headers: {"X-Csrf-Token":window.csrfToken}
        });
    }
    const services = {
        getPokemon,
    };
    window.services = services;
})(jQuery, window, axios);