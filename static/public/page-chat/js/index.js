(function ($, window, Vue, axios) {
    'use strict';
    const token_header = getCookie('token');
    const app = Vue.createApp({
        data: function () {
            return {
                user: window.user || "",
                currentPage: 'chat',
                authstatus: window.authstatus,
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                dataInsert: [],
                dataShop: [],

                formData: {
                    marwellsoy24: "",
                    lookjeab: "",
                    goodSup: "",
                    somchai: "",
                    kaopan: "",
                    meemong: "",
                    marwell224: "",
                    tt5: "",
                    littleCactus: "",
                    ketoFood: "",
                    supplement: "",
                    marineeY: "",
                    tt6: "",
                    myorder: "",
                    lineOa: ""
                },
                errors: {
                    marwellsoy24: "",
                    lookjeab: "",
                    goodSup: "",
                    somchai: "",
                    kaopan: "",
                    meemong: "",
                    marwell224: "",
                    tt5: "",
                    littleCactus: "",
                    ketoFood: "",
                    supplement: "",
                    marineeY: "",
                    tt6: "",
                    myorder: "",
                    lineOa: ""
                },
                token_header: token_header || '',
            }
        },
        methods: {

            async loadDataShop() {
                const self = this;
                let data = { "channel_id": "" };
                try {
                    showLoading();
                    let responsegetShop = await services.getShop(data, self.token_header);
                    const dataShop = responsegetShop?.data.data || [];
                    self.dataShop = dataShop;

                    // Initialize formData and errors dynamically based on dataShop
                    dataShop.forEach(shop => {
                        self.formData[shop.shop_id] = "";
                        self.errors[shop.shop_id] = "";
                    });

                    closeLoading();
                } catch (error) {
                    console.warn(`Error in loadDataShop:`, error);
                    closeLoading();
                }
            },

            validateForm() {
                this.errors = {};  // Reset the errors
                let isValid = true;

                // Validate each dynamically created form field
                for (let item of this.dataShop) {
                    const value = String(this.formData[item.shop_id]).trim();
                    if (value === "") {
                        this.errors[item.shop_id] = "กรุณากรอกข้อมูล";
                        isValid = false;
                    }
                }
                return isValid;
            },


            // validateForm() {
            //     this.errors = {};  // Reset the errors
            //     let isValid = true;

            //     // Manually validate each field by converting it to a string before trimming
            //     if (String(this.formData.marwellsoy24).trim() === "") {
            //         this.errors.marwellsoy24 = "กรุณากรอกข้อมูล";
            //         isValid = false;
            //     }

            //     if (String(this.formData.lookjeab).trim() === "") {
            //         this.errors.lookjeab = "กรุณากรอกข้อมูล";
            //         isValid = false;
            //     }

            //     if (String(this.formData.goodSup).trim() === "") {
            //         this.errors.goodSup = "กรุณากรอกข้อมูล";
            //         isValid = false;
            //     }

            //     if (String(this.formData.somchai).trim() === "") {
            //         this.errors.somchai = "กรุณากรอกข้อมูล";
            //         isValid = false;
            //     }

            //     if (String(this.formData.kaopan).trim() === "") {
            //         this.errors.kaopan = "กรุณากรอกข้อมูล";
            //         isValid = false;
            //     }

            //     if (String(this.formData.meemong).trim() === "") {
            //         this.errors.meemong = "กรุณากรอกข้อมูล";
            //         isValid = false;
            //     }

            //     if (String(this.formData.marwell224).trim() === "") {
            //         this.errors.marwell224 = "กรุณากรอกข้อมูล";
            //         isValid = false;
            //     }

            //     if (String(this.formData.tt5).trim() === "") {
            //         this.errors.tt5 = "กรุณากรอกข้อมูล";
            //         isValid = false;
            //     }

            //     if (String(this.formData.littleCactus).trim() === "") {
            //         this.errors.littleCactus = "กรุณากรอกข้อมูล";
            //         isValid = false;
            //     }

            //     if (String(this.formData.ketoFood).trim() === "") {
            //         this.errors.ketoFood = "กรุณากรอกข้อมูล";
            //         isValid = false;
            //     }

            //     if (String(this.formData.supplement).trim() === "") {
            //         this.errors.supplement = "กรุณากรอกข้อมูล";
            //         isValid = false;
            //     }

            //     if (String(this.formData.marineeY).trim() === "") {
            //         this.errors.marineeY = "กรุณากรอกข้อมูล";
            //         isValid = false;
            //     }

            //     if (String(this.formData.tt6).trim() === "") {
            //         this.errors.tt6 = "กรุณากรอกข้อมูล";
            //         isValid = false;
            //     }

            //     if (String(this.formData.myorder).trim() === "") {
            //         this.errors.myorder = "กรุณากรอกข้อมูล";
            //         isValid = false;
            //     }

            //     if (String(this.formData.lineOa).trim() === "") {
            //         this.errors.lineOa = "กรุณากรอกข้อมูล";
            //         isValid = false;
            //     }

            //     return isValid;
            // },
            clearError(field) {
                this.errors[field] = "";
            },

            restrictToNumbers(field) {
                this.formData[field] = this.formData[field].replace(/[^0-9]/g, "");
                this.clearError(field);
            },

            clearFormData() {
                for (let key in this.formData) {
                    if (this.formData.hasOwnProperty(key)) {
                        this.formData[key] = "";  // Reset each field
                    }
                }
            },

            async savePage() {
                if (this.validateForm()) {
                    try {
                        let data = {
                            data_json: []
                        };

                        // Populate the data to be submitted based on formData
                        this.dataShop.forEach(item => {
                            data.data_json.push({
                                shop_name: item.shop_name,         // Use shop_name from the dataShop
                                total_count: Number(this.formData[item.shop_id]) // Use the corresponding formData value
                            });
                        });

                        const responsegetInsert = await services.getInsert(data, this.token_header);
                        const response = responsegetInsert?.data || {};
                        this.dataInsert = response.data || [];

                        this.clearFormData();
                        Msg("บันทึกสำเร็จ", 'success');
                        setTimeout(() => window.location.reload(), 2000);
                    } catch (error) {
                        console.warn("Error saving data:", error);
                    }
                } else {
                    console.log("Form validation failed.");
                }
            }
        },
        mounted() {
            this.loadDataShop()
            console.log("ok");
        }
    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
