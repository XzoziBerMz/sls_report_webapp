
(function($, window, axios) {
    const endpoint = {
         getPokemon:`/get-pokemon`,
        
    }
    

    function getChannel (body = {}) {
        return axios.get(`/page-key-clip/mockjson/get_channel.json`)
        // return axios({
        //     method: 'post',
        //     url: endpoint.getCaretaker,
        //     data: { ...body },
        //     headers: { "x-auth-token": window.csrfToken }
        // });
    }
    function getvdo (body = {}) {
        return axios.get(`/page-key-clip/mockjson/get_vdo.json`)
        // return axios({
        //     method: 'post',
        //     url: endpoint.getCaretaker,
        //     data: { ...body },
        //     headers: { "x-auth-token": window.csrfToken }
        // });
    }

    const services = {
        getvdo,
        getChannel,
    };
    window.services = services;
})(jQuery, window, axios);