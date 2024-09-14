(function ($, window, axios) {
  const endpoint = {
    getPokemon: `/get-pokemon`,
  };

  function getInsertAsd(body = {}, token) {
    return axios({
      method: "post",
      url: basepath + `/api/v1/ads/cost/multiple/insert`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }
  function getShop(body = {}, token) {
    return axios({
      method: "post",
      url: basepath + `/api/v1/shop/list`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }

  // function getProduct(token) {
  //   return axios({
  //     method: "get",
  //     url: basepath + `/api/v1/product/list`,
  //     headers: { "x-auth-token": token },
  //   });
  // }

  const services = {
    getInsertAsd,
    // getProduct,
    getShop,
  };
  window.services = services;
})(jQuery, window, axios);
