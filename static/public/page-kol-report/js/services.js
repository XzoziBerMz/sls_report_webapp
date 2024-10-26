(function ($, window, axios) {
  const endpoint = {
    getPokemon: `/get-pokemon`,
  };

  function getOrderManual(body = {}, token) {
    return axios({
      method: "post",
      url: basepath + `/api/v1/kol/filter`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }

  function getChannelAll(token) {
    return axios({
      method: "get",
      url: basepath + `/api/v1/tiktok-live/list-shop`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      headers: { "x-auth-token": token },
    });
  }

  function getlog(body = {}, token) {
    return axios({
      method: "post",
      url: basepath + `/api/v1/log/filter`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }

  function updateData(body = {}, token) {
    return axios({
      method: "post",
      url: basepath + `/api/v1/kol/update`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }

  const services = {
   
    getOrderManual,
    getChannelAll,
    getlog,
    updateData,
  };
  window.services = services;
})(jQuery, window, axios);
