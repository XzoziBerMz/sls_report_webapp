(function ($, window, axios) {
  // const basepath = "https://sls-report-api.945.report";
  const endpoint = {
    get_ads: `/api/v1/ads/cost/filter`,
  };

  function getAdsCost(body = {}, token) {
    return axios({
      method: "post",
      url: basepath + endpoint.get_ads,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }

  const services = {
    getAdsCost,
  };
  window.services = services;
})(jQuery, window, axios);
