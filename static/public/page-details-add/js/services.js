(function ($, window, axios) {
  // const basepath = "https://sls-report-api.945.report";
  const endpoint = {
    get_ads: `/api/v1/ads/cost/filter`,
    get_shop: `/api/v1/ads/cost/shop/list`,
  };

  function getAdsCost(body = {}, token) {
    return axios({
      method: "post",
      url: basepath + endpoint.get_ads,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }
  function getShop(token) {
    return axios({
      method: "get",
      url: basepath + endpoint.get_shop,
      // data: { ...body },
      headers: { "x-auth-token": token },
    });
  }

  const services = {
    getAdsCost,
    getShop,
  };
  window.services = services;
})(jQuery, window, axios);
