(function ($, window, axios) {
  const basePath = "https://sls-report-api.945.report";
  const endpoint = {
    getKeyReview: `/api/v1/review/filter-negative`,
    // getKeyReview: `/negatvie-list`,
  };

  function createData(body = {},token) {
    return axios({
      method: "post",
      url: basepath + `/api/v1/kol/insert`,
      // url: endpoint.getKeyReview,
      // url: basePath + endpoint.getKeyReview,
      data: { ...body },
      headers: { "x-auth-token": token },
    });
  }
  function updateData(body = {},token) {
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
    createData,
    updateData,
  };
  window.services = services;
})(jQuery, window, axios);
