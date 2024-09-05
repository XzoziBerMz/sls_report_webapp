
(function($, window, axios) {
    const endpoint = {
         getPokemon:`/get-pokemon`,
        
    }
    
    
    function getMatterViolation (body = {}) {
        return axios.get(`/page-negative-review/mockjson/get_matter_violation.json`)
        // return axios({
        //     method: 'post',
        //     url: endpoint.getCaretaker,
        //     data: { ...body },
        //     headers: { "x-auth-token": window.csrfToken }
        // });
    }
    function getInputChannel (body = {}) {
        return axios.get(`/page-negative-review/mockjson/get_input_channel.json`)
        // return axios({
        //     method: 'post',
        //     url: endpoint.getCaretaker,
        //     data: { ...body },
        //     headers: { "x-auth-token": window.csrfToken }
        // });
    }

    const services = {
        getMatterViolation,
        getInputChannel,
    };
    window.services = services;
})(jQuery, window, axios);