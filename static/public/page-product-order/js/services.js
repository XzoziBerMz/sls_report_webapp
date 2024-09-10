(function ($, window, axios) {
  const endpoint = {
    getPokemon: `/get-pokemon`,
  };

  function getInsertOrderManualHandler(body = {}, token) {
    return axios({
      method: "post",
      url: basepath + `/api/v1/order/insert-manual`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }

  const services = {
    getInsertOrderManualHandler,
  };
  window.services = services;
})(jQuery, window, axios);
