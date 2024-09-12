(function ($, window, Vue, axios) {
    'use strict';
    const token_header = getCookie('token');
    const app = Vue.createApp({
        data: function () {
            return {
                user: window.user || "",
                // currentPage: window.currentPage,
                currentPage: 'product-order',
                authstatus: window.authstatus,
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                dataProduct: [],
                token_header: token_header || '',
                form: {
                    product: "",
                    shop_name: "",
                    product_name: "",
                    add_fee: "",
                    added_income: "",
                    name: "",
                },
                dataEditStars: [
                    {
                        id: 1,
                        name: "ป้าวปั้น",
                    },
                    {
                        id: 2,
                        name: "คีโด789",
                    },
                    {
                        id: 3,
                        name: "ฟู๊ด",
                    },
                    {
                        id: 4,
                        name: "มีมง",
                    },
                    {
                        id: 5,
                        name: "ลิสเติ้ล",
                    },
                    {
                        id: 6,
                        name: "somchai",
                    },
                    {
                        id: 7,
                        name: "TT2",
                    },
                    {
                        id: 8,
                        name: "TT4",
                    },
                    {
                        id: 9,
                        name: "TT5",
                    },
                    {
                        id: 10,
                        name: "TT6",
                    },
                ],
                flatpickr_dp_from_date: null,
                errors: {}
            }
        },
        methods: {
            async init() {
                let self = this;
            },
            async DefaultData() {
                const self = this;
                self.flatpickr_dp_from_date = flatpickr("#kt_td_picker_basic_input", {
                    static: true,
                    enableTime: true,
                    disableMobile: "true",
                    dateFormat: "d/m/Y",
                    onChange: function (selectedDates, dateStr, instance) {
                        self.form.date = instance.formatDate(selectedDates[0], "Y-m-d") + ' 00:00:00';
                        delete self.errors.date;
                    },
                });
            },

            validateForm() {
                this.errors = {};

                if (!this.form.date) {
                    this.errors.date = 'กรุณาเลือกวันที่';
                }

                if (!this.form.editstars) {
                    this.errors.editstars = 'กรุณาเลือกร้าน';
                }

                if (!this.form.add_fee) {
                    this.errors.add_fee = 'กรุณากรอกค่าแอด';
                }

                if (!this.form.added_income) {
                    this.errors.added_income = 'กรุณากรอกรายได้แอด';
                }

                if (!this.form.total_income) {
                    this.errors.total_income = 'กรุณากรอกรายได้รวม';
                }
                if (!this.form.name) {
                    this.errors.name = 'กรุณากรอกชื่อ';
                }
                if (!this.form.product_name) {
                    this.errors.product_name = 'กรุณากรอกชื่อ';
                }


                return Object.keys(this.errors).length === 0;
            },

            async loadData() {
                const self = this;
                showLoading();
                try {
                    const [responseGetProduct] = await Promise.all([
                        services.getProduct(self.token_header)
                    ]);

                    const dataProduct = responseGetProduct?.data.data || [];
                    self.dataProduct = dataProduct;

                } catch (error) {
                    console.warn('🌦 ~ loadData ~ error:', error);
                } finally {
                    closeLoading();
                }
            },

            async handleSubmit(event) {
                event.preventDefault();

                if (!this.validateForm()) {
                    console.error("กรุณากรอกข้อมูลให้ครบถ้วน");
                    return;
                }

                try {

                    let dateParts = this.form.date.split('/');
                    let formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;

                    console.log('Form data:', this.form);
                    showLoading();
                    let data = {
                        "shop_name": this.form.editstars,   
                        "name": this.form.name,           
                        "product": this.form.product_name,     
                        "total_cost": parseFloat(this.form.add_fee),  
                        "budget": parseFloat(this.form.added_income),
                        "total_shop_income": parseFloat(this.form.total_income),  
                        // "cost_per_purchase": 0,  
                        // "purchase": "",         
                        // "note": "",            
                        // "ref_default": 1,       
                        // "user": "username",      
                        "date": formattedDate   
                    };


                    console.log('Data being sent:', data);
                    const response = await services.getInsertAsd(data, this.token_header);
                    const responseData = response.data || {};
                    if (responseData.code === 200) {
                        this.dataInsertOrderManualHandler = responseData.data || [];
                        closeLoading()

                        Msg("บันทึกสำเร็จ", 'success');
                        setTimeout(function () {
                            window.location.reload();
                        }, 2000)
                    }



                } catch (error) {
                    console.warn("Error loading data:", error);
                    closeLoading()
                }
            },

            handleInput(field) {

                this.errors[field] = '';
            },
        },




        mounted: function () {
            let self = this;
            self.loadData();
            self.DefaultData();
            console.log("ok");
        }
    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
