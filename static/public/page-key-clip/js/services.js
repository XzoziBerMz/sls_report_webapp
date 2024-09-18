(function ($, window, axios) {
  const endpoint = {
    getPokemon: `/get-pokemon`,
  };

  function getInsertVdoHandler(body = {}, token) {
    return axios({
      method: "post",
      url: basepath + `/api/v1/vdo/insert`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }

  function getChannel(token) {
    return axios({
      method: "get",
      url: basepath + `/api/v1/channel/list`,
      headers: { "x-auth-token": token },
    });
  }
  function getvdo(token) {
    return axios({
      method: "get",
      url: basepath + `/api/v1/product/list`,
      headers: { "x-auth-token": token },
    });
  }

    function getInputChannel(body = {},token) {
    return axios({
      method: "post",
      url: basepath + `/api/v1/shop/vdo/list`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }

  const services = {
    getChannel,
    getvdo,
    getInsertVdoHandler,
    getInputChannel,
  };
  window.services = services;
})(jQuery, window, axios);
