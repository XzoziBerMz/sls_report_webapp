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
                dataReviewTb2: [],
                dataChannel: [],
                dataProduct: [],
                dataBy: [],
                dataDao: [],
                dataTikTok: [],
                dataLaz: [],
                dataShopPee: [],
                dataFb: [],
                dataLine: [],
                dataOrder: [],
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
            async loadDataReviewTb2() {
                const self = this;
                try {
                    let data = {
                        page: 1,
                        per_page: 100,
                    }
                    let responseGetAccountTb2 = await services.getReviewTb2();
                    const dataReviewTb2 = responseGetAccountTb2?.data.data || [];
                    self.dataReviewTb2 = dataReviewTb2;

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
            },
            async loadDataSelectAdmin() {
                try {
                    const responseGetCaretaker = await services.getCaretaker();
                    const dataCaretaker = responseGetCaretaker?.data.data || [];
                    this.dataCaretaker = dataCaretaker
                    await this.initSelect();
                } catch (error) {
                    console.warn(`🌦️ ~ loadDataSelect ~ error:`, error);
                }
            },

            async loadDataSelectChannel() {
                try {
                    const responseGetChannel = await services.getChannel();
                    const dataChannel = responseGetChannel?.data.data || [];
                    this.dataChannel = dataChannel
                    await this.initSelectTb2();
                } catch (error) {
                    console.warn(`🌦️ ~ loadDataSelect ~ error:`, error);
                }
                try {
                    const responseGetProduct = await services.getProduct();
                    const dataProduct = responseGetProduct?.data.data || [];
                    this.dataProduct = dataProduct
                    await this.initSelectTb2();
                } catch (error) {
                    console.warn(`🌦️ ~ loadDataSelect ~ error:`, error);
                }
                try {
                    const responseGetBy = await services.getBy();
                    const dataBy = responseGetBy?.data.data || [];
                    this.dataBy = dataBy
                    await this.initSelectTb2();
                } catch (error) {
                    console.warn(`🌦️ ~ loadDataSelect ~ error:`, error);
                }
                try {
                    const responseGetDao = await services.getDao();
                    const dataDao = responseGetDao?.data.data || [];
                    this.dataDao = dataDao
                    await this.initSelectTb2();
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
            },

            initSelectTb2() {
                const self = this;
                self.dataReviewTb2.forEach((list, index) => {
                    const selected = '#select_channel_' + index
                    $(selected).select2({
                        minimumResultsForSearch: -1,
                        allowClear: true,
                        placeholder: 'Select Caretaker',
                        data: self.dataChannel.map((item) => ({
                            id: item.code,
                            text: item.name
                        }))
                    })
                });
                self.dataReviewTb2.forEach((list, index) => {
                    const selected = '#select_product_' + index
                    $(selected).select2({
                        minimumResultsForSearch: -1,
                        allowClear: true,
                        placeholder: 'Select Caretaker',
                        data: self.dataProduct.map((item) => ({
                            id: item.code,
                            text: item.name
                        }))
                    })
                });
                self.dataReviewTb2.forEach((list, index) => {
                    const selected = '#select_by_' + index
                    $(selected).select2({
                        minimumResultsForSearch: -1,
                        allowClear: true,
                        placeholder: 'Select Caretaker',
                        data: self.dataBy.map((item) => ({
                            id: item.code,
                            text: item.name
                        }))
                    })
                });
                self.dataReviewTb2.forEach((list, index) => {
                    const selected = '#select_dao_' + index
                    $(selected).select2({
                        minimumResultsForSearch: -1,
                        allowClear: true,
                        placeholder: 'Select Caretaker',
                        data: self.dataDao.map((item) => ({
                            id: item.code,
                            text: item.name
                        }))
                    })
                });
            },

            async loadDataApp() {
                const self = this;
                try {
                    let responseGetTikTok = await services.getTikTok();
                    const dataTikTok = responseGetTikTok?.data.data || [];
                    self.dataTikTok = dataTikTok;

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
                try {
                    let responseGetLaz = await services.getLaz();
                    const dataLaz = responseGetLaz?.data.data || [];
                    self.dataLaz = dataLaz;

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
                try {
                    let responseShoppee = await services.getShoppee();
                    const dataShopPee = responseShoppee?.data.data || [];
                    self.dataShopPee = dataShopPee;

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
                try {
                    let responseFb = await services.getFb();
                    const dataFb = responseFb?.data.data || [];
                    self.dataFb = dataFb;

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
                try {
                    let responseLine = await services.getLine();
                    const dataLine = responseLine?.data.data || [];
                    self.dataLine = dataLine;

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
                try {
                    let responseOrder = await services.getOrder();
                    const dataOrder = responseOrder?.data.data || [];
                    self.dataOrder = dataOrder;

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
            },
            formatNumber(amount) {
                return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
            self.loadDataReviewTb2()
            self.loadDataSelectAdmin()
            self.loadDataSelectChannel()
            self.loadDataApp()
            console.log("ok")
        }


    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
