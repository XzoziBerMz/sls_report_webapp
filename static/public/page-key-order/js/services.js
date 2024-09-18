(function ($, window, axios) {
  const endpoint = {
    getPokemon: `/get-pokemon`,
  };

  function getOrderManual(body = {}, token) {
    return axios({
      method: "post",
      url: basepath + `/api/v1/order/filter-manual`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }
  function getmanual(token) {
    return axios({
      method: "get",
      url: basepath + `/api/v1/order/list-product-manual`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      headers: { "x-auth-token": token },
    });
  }

  function getChannelAll(token) {
    return axios({
      method: "get",
      url: basepath + `/api/v1/order/list-channel-manual`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      headers: { "x-auth-token": token },
    });
  }

  function getusermanual(token) {
    return axios({
      method: "get",
      url: basepath + `/api/v1/order/list-user-manual`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      headers: { "x-auth-token": token },
    });
  }


  const services = {
   
    getOrderManual,
    getmanual,
    getChannelAll,
    getusermanual,
  
  };
  window.services = services;
})(jQuery, window, axios);
