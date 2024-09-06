(function ($, window, Vue, axios) {
    'use strict';
    const token_header = getCookie('token');
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
                dataInsert: [],

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

            validateForm() {
                this.errors = {};  // Reset the errors
                let isValid = true;
            
                // Manually validate each field by converting it to a string before trimming
                if (String(this.formData.marwellsoy24).trim() === "") {
                    this.errors.marwellsoy24 = "กรุณากรอกข้อมูล";
                    isValid = false;
                }
            
                if (String(this.formData.lookjeab).trim() === "") {
                    this.errors.lookjeab = "กรุณากรอกข้อมูล";
                    isValid = false;
                }
            
                if (String(this.formData.goodSup).trim() === "") {
                    this.errors.goodSup = "กรุณากรอกข้อมูล";
                    isValid = false;
                }
            
                if (String(this.formData.somchai).trim() === "") {
                    this.errors.somchai = "กรุณากรอกข้อมูล";
                    isValid = false;
                }
            
                if (String(this.formData.kaopan).trim() === "") {
                    this.errors.kaopan = "กรุณากรอกข้อมูล";
                    isValid = false;
                }
            
                if (String(this.formData.meemong).trim() === "") {
                    this.errors.meemong = "กรุณากรอกข้อมูล";
                    isValid = false;
                }
            
                if (String(this.formData.marwell224).trim() === "") {
                    this.errors.marwell224 = "กรุณากรอกข้อมูล";
                    isValid = false;
                }
            
                if (String(this.formData.tt5).trim() === "") {
                    this.errors.tt5 = "กรุณากรอกข้อมูล";
                    isValid = false;
                }
            
                if (String(this.formData.littleCactus).trim() === "") {
                    this.errors.littleCactus = "กรุณากรอกข้อมูล";
                    isValid = false;
                }
            
                if (String(this.formData.ketoFood).trim() === "") {
                    this.errors.ketoFood = "กรุณากรอกข้อมูล";
                    isValid = false;
                }
            
                if (String(this.formData.supplement).trim() === "") {
                    this.errors.supplement = "กรุณากรอกข้อมูล";
                    isValid = false;
                }
            
                if (String(this.formData.marineeY).trim() === "") {
                    this.errors.marineeY = "กรุณากรอกข้อมูล";
                    isValid = false;
                }
            
                if (String(this.formData.tt6).trim() === "") {
                    this.errors.tt6 = "กรุณากรอกข้อมูล";
                    isValid = false;
                }
            
                if (String(this.formData.myorder).trim() === "") {
                    this.errors.myorder = "กรุณากรอกข้อมูล";
                    isValid = false;
                }
            
                if (String(this.formData.lineOa).trim() === "") {
                    this.errors.lineOa = "กรุณากรอกข้อมูล";
                    isValid = false;
                }
            
                return isValid;
            }
            ,
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
                            "marwellsoy24": Number(this.formData.marwellsoy24), 
                            "lookjeab789": Number(this.formData.lookjeab),
                            "marwell224": Number(this.formData.marwell224),
                            "tt5": Number(this.formData.tt5),
                            "tt6": Number(this.formData.tt6),
                            "good_sup": Number(this.formData.goodSup),
                            "somchai": Number(this.formData.somchai),
                            "little_cactus": Number(this.formData.littleCactus),
                            "keto_food": Number(this.formData.supplement),
                            "keowpun": Number(this.formData.kaopan),
                            "meemomg": Number(this.formData.meemong),
                            "serm_d": Number(this.formData.ketoFood),
                            "marinee_y": Number(this.formData.marineeY),
                            "myorder": Number(this.formData.myorder),
                            "line_oa": Number(this.formData.lineOa)
                        };

                        const responsegetInsert = await services.getInsert(data, this.token_header);
                        const response = responsegetInsert?.data || {};

                        this.dataInsert = response.data || [];

                        this.clearFormData();


                    } catch (error) {
                        console.warn("Error loading data:", error);
                    }

                    console.log("Form is valid. Submitting data...");
                } else {
                    console.log("Form validation failed.");
                }
            }
        },
        mounted() {
            console.log("ok");
        }
    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
