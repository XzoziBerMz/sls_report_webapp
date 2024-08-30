
(function($, window, axios) {
    const endpoint = {
         getPokemon:`/get-pokemon`,
        
    }
    
    function getOrder (body = {}) {
        return axios.get(`/page-key-order/mockjson/get_order.json`)
        // return axios({
        //     method: 'post',
        //     url: endpoint.getCaretaker,
        //     data: { ...body },
        //     headers: { "x-auth-token": window.csrfToken }
        // });
    }
    const services = {
        getOrder,
    };
    window.services = services;
})(jQuery, window, axios);