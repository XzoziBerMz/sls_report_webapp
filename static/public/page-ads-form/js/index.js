(function ($, window, Vue, axios) {
    'use strict';

    const token_header = getCookie('token');

    const app = Vue.createApp({
        data: function () {
            return {
                user: window.user || "",
                currentPage: 'ads_form',
                authstatus: window.authstatus,
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                dataProduct: [],
                dataShop: [],
                token_header: token_header || '',
                form: {
                    name: '',
                    total_cost: '',
                    budget: '',
                    total_income: '',
                    cost_per_purchase: '',
                    purchase: '',
                    note: '',
                },
                errors: {}
            }
        },
        computed: {




        },
        methods: {
            async init() {
                let self = this

                try {
                    try {
                        const req = await services.getProduct(self.token_header)
                        self.dataProduct = req.data.data || []
                    } catch (error) {
                        console.log("🚀 ~ init ~ error:", error)
                    }
                    try {
                        let data = {}
                        const req = await services.getShop(data, self.token_header)
                        self.dataShop = req.data.data || []
                    } catch (error) {
                        console.log("🚀 ~ init ~ error:", error)
                    }

                } catch (error) {
                    console.log("🚀 ~ init ~ error:", error)
                } finally {
                    $("#kt_datepicker_1").flatpickr({
                        altInput: true,
                        altFormat: "d/m/Y",
                        dateFormat: "Y-m-d",
                        onChange: function (selectedDates, dateStr, instance) {
                            self.date_time = instance.formatDate(selectedDates[0], "Y-m-d"); // Update date in form data
                            // console.log("🚀 ~ init ~ self.start_date:", self.start_date)
                            // self.flatpickr_dp_end_date.set('minDate', selectedDates[0]);

                            // if (self.end_date && new Date(self.start_date) > new Date(self.end_date)) {
                            //     self.flatpickr_dp_end_date.clear();
                            //     self.end_date = "";
                            // }
                            delete self.errors.date_time;
                        },
                    });

                    $('#select_product').html(`<option></option>`).select2({
                        allowInput: false,
                        // dropdownParent: $('#select_product').closest('.fv-row'),
                        data: [..._.cloneDeep(self.dataProduct) || []]
                            .map(item => ({ ...item, id: item.product_id, text: item.product_name })),
                    });
                    $('#select_product').on("change.custom", async function () {
                        const values = $(this).select2("data") || [];
                        const name = values?.[0]?.text || "";
                        self.product_value = name;
                    });
                    $('#select_shop').html(`<option></option>`).select2({
                        allowInput: false,
                        // dropdownParent: $('#select_shop').closest('.fv-row'),
                        data: [..._.cloneDeep(self.dataShop) || []]
                            .map(item => ({ ...item, id: item.shop_id, text: item.shop_name })),
                    });
                    $('#select_shop').on("change.custom", async function () {
                        const values = $(this).select2("data") || [];
                        const name = values?.[0]?.text || "";
                        self.shop_value = name;
                    });
                    $('#select_status').val('active').trigger('change');

                }
            },
            validateForm() {
                this.errors = {};

                if (!this.date_time) {
                    this.errors.date_time = 'กรุณาเลือกวันที่';
                }
                if (!this.form.name) {
                    this.errors.name = 'กรุณากรอก ชื่อ ADS';
                }
                if (!this.shop_value) {
                    this.errors.shop = 'กรุณาเลือก ร้าน';
                }
                if (!this.product_value) {
                    this.errors.product = 'กรุณาเลือก สินค้า';
                }
                if (!this.form.total_cost) {
                    this.errors.total_cost = 'กรุณากรอก ค่าใช้จ่ายทั้งหมด';
                }
                if (!this.form.budget) {
                    this.errors.budget = 'กรุณากรอก งบประมาณ';
                }
                if (!this.form.total_income) {
                    this.errors.total_income = 'กรุณากรอก รายได้รวม(ร้านค้า)';
                }
                if (!this.form.cost_per_purchase) {
                    this.errors.cost_per_purchase = 'กรุณากรอก ต้นทุนต่อการซื้อ(ร้านค้า)';
                }
                if (!this.form.purchase) {
                    this.errors.purchase = 'กรุณากรอก การซื้อ';
                }


                return Object.keys(this.errors).length === 0;
            },
            async savePage() {
                const self = this;
                if (self.validateForm()) {
                    try {
                        let data = {
                            "shop_name": self.shop_value || '',
                            "name": self.form.name || '',
                            "product": self.product_value || '',
                            "total_cost": Number(self.form.total_cost) || '',
                            "budget": Number(self.form.budget) || '',
                            "total_shop_income": Number(self.form.total_income) || '',
                            "cost_per_purchase": Number(self.form.cost_per_purchase) || '',
                            "purchase": self.form.purchase || '',
                            "note": self.form.note || '',
                            "ref_default": 1,
                            "date": self.date_time || ''
                        }

                        const req = await services.insertData(data, self.token_header)
                        if (req.data.code === 200) {
                            closeLoading()
                            Msg("บันทึกสำเร็จ", 'success');
                            setTimeout(function () {
                                window.location.reload();
                            }, 2000)
                        }
                    } catch (error) {
                        console.log("🚀 ~ savePage ~ error:", error)
                    }
                } else {
                    console.log("Form validation failed.");
                    closeLoading()
                }
            }

        },
        watch: {
            "form.total_cost"(newValue) {
                let formattedValue = `${newValue}`.replace(/[^0-9.]/g, "");
                const decimalParts = formattedValue.split('.');
                if (decimalParts.length > 2) {
                    formattedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
                }
                this.form.total_cost = formattedValue;
            },
            "form.budget"(newValue) {
                let formattedValue = `${newValue}`.replace(/[^0-9.]/g, "");
                const decimalParts = formattedValue.split('.');
                if (decimalParts.length > 2) {
                    formattedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
                }
                this.form.budget = formattedValue;
            },
            "form.total_income"(newValue) {
                let formattedValue = `${newValue}`.replace(/[^0-9.]/g, "");
                const decimalParts = formattedValue.split('.');
                if (decimalParts.length > 2) {
                    formattedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
                }
                this.form.total_income = formattedValue;
            },
            "form.cost_per_purchase"(newValue) {
                let formattedValue = `${newValue}`.replace(/[^0-9.]/g, "");
                const decimalParts = formattedValue.split('.');
                if (decimalParts.length > 2) {
                    formattedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
                }
                this.form.cost_per_purchase = formattedValue;
            },
            // "form.purchase"(newValue) {
            //     let formattedValue = `${newValue}`.replace(/[^0-9.]/g, "");
            //     const decimalParts = formattedValue.split('.');
            //     if (decimalParts.length > 2) {
            //         formattedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
            //     }
            //     this.form.purchase = formattedValue;
            // },
        },

        mounted: async function () {
            let self = this

            await self.init();
            console.log("ok")
        }


    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
