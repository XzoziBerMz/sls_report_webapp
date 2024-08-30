(function ($, window, Vue, axios) {
    'use strict';



    const app = Vue.createApp({
        data: function () {
            return {
                user: window.user || "",
                currentPage: window.currentPage,
                authstatus: window.authstatus,
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                dataOrder: [],
                
            }
        },
        computed: {

        },
        methods: {
            async init() {
                let self = this

            },

            async loadDataOrder() {
                const self = this;
                try {
                    let data = {
                        page: 1,
                        per_page: 100,
                    }
                    let responseGetOrder = await services.getOrder();
                    const dataOrder = responseGetOrder?.data.data || [];
                    self.dataOrder = dataOrder;

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
            },

            // getPokemon:async function (){
            //   const self = this;
            //   try {
            //       showLoading();
            //       const response = await services.getPokemon({})
            //       if (response){
            //           console.log(response)
            //           closeLoading();

            //       }

            //   }catch(err){
            //       closeLoading();
            //       Msg("errorMsg",'error');

            //   }finally{

            //   }
            // }

        },

        mounted: function () {
            let self = this
               self.loadDataOrder()
            //    self.getPokemon()
            console.log("ok")
        }


    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
