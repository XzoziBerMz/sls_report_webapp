(function ($, window, Vue, axios) {
    'use strict';


    const token_header = getCookie('token');
    const app = Vue.createApp({
        data: function () {
            return {
                user: window.user || "",
                currentPage: window.currentPage,
                authstatus: window.authstatus,
                token_header: token_header || '',
                datas: [],
                inventoryDetail: [],
                search: "",
                serach_value: "",
                filtered: [],
                dataDataAdd: [],
                "order_by": "desc",

            }
        },
        computed: {




        },
        methods: {
            async init() {
                let self = this

            },

            async loadDataAdd() {
                const self = this;
                try {
                    showLoading();
                    let data = {
                        "search": "",
                        "page": 1,
                        "per_page": 10,
                        "order": "shop_name",
                        "order_by": "desc"
                    }
                    let responseGetAdd = await services.getAdsCost(data, self.token_header);
                    const dataAddr = responseGetAdd?.data.data || [];
                    self.dataDataAdd = dataAddr;
                    // self.totalItems = responseGetAdd.data.total;
                    closeLoading()

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                    closeLoading()
                }
            },

        },

        mounted: function () {
            let self = this
            //    self.getPokemon()
            self.loadDataAdd()
            console.log("ok")
        }


    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
