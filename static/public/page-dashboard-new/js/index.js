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
                dataReview: [],
                dataCaretaker: [],
                dataClip: [],
                dataProductChannel: [],

            }
        },
        computed: {

        },
        methods: {
            async init() {
                let self = this

            },
            async loadDataClip() {
                const self = this;
                try {
                    let data = {
                        page: 1,
                        per_page: 100,
                    }
                    let responseGetClip = await services.getClip();
                    const dataClip = responseGetClip?.data.data || [];
                    self.dataClip = dataClip;

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
            },
            async loadDataProductChannel() {
                const self = this;
                try {
                    let data = {
                        page: 1,
                        per_page: 100,
                    }
                    let responseGetProductChannel = await services.getProductChannel();
                    const dataProductChannel = responseGetProductChannel?.data.data || [];
                    self.dataProductChannel = dataProductChannel;

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
            },
            async loadDataReview() {
                const self = this;

                try {
                    let data = {
                        page: 1,
                        per_page: 100,
                    }
                    let responseGetAccount = await services.getReview();
                    const dataReview = responseGetAccount?.data.data || [];
                    self.dataReview = dataReview;

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
            },
            async loadDataSelect() {
                try {
                    const responseGetCaretaker = await services.getCaretaker();
                    const dataCaretaker = responseGetCaretaker?.data.data || [];
                    this.dataCaretaker = dataCaretaker
                    await this.initSelect();
                } catch (error) {
                    console.warn(`🌦️ ~ loadDataSelect ~ error:`, error);
                }
            },
            initSelect() {
                const self = this;

                self.dataReview.forEach((list, index) => {
                    const selected = '#select_admin_' + index
                    $(selected).select2({
                        minimumResultsForSearch: -1,
                        allowClear: true,
                        placeholder: 'Select Caretaker',
                        data: self.dataCaretaker.map((item) => ({
                            id: item.code,
                            text: item.name
                        }))
                    })
                });
            }
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
            //    self.getPokemon()
            self.loadDataClip()
            self.loadDataProductChannel()
            self.loadDataReview()
            self.loadDataSelect()
            console.log("ok")
        }


    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
