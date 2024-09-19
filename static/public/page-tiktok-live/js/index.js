(function ($, window, Vue, axios) {
    'use strict';

    const token_header = getCookie('token');

    const app = Vue.createApp({
        data: function () {
            return {
                ...window.webUtils.data || {},
                user: window.user || "",
                currentPage: 'tiktok_live',
                authstatus: window.authstatus,
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                dataProduct: [],
                dataShop: [],
                dataAds: [],
                token_header: token_header || '',
                form: {
                    channel: '',
                    total_cost: '',
                    total_income: '',
                    note: '',
                },
                errors: {},
                start_date_time: null,
                end_date_time: null,
                selectedDate: '',
                flatpickr_dp_from_date: null,

            }
        },
        computed: {
        },
        methods: {
            ...window.webUtils.method || {},
            async init() {
                let self = this

                await self.loadData()
                // $("#kt_td_picker_start_input").flatpickr({
                //     altInput: true,
                //     altFormat: "d/m/Y",
                //     dateFormat: "Y-m-d",
                //     onChange: function (selectedDates, dateStr, instance) {
                //         // ตรวจสอบค่าที่เลือก
                //         console.log("Selected Dates:", selectedDates);
                //         console.log("Date String:", dateStr);

                //         if (selectedDates.length > 0) {
                //             self.selectedDate = instance.formatDate(selectedDates[0], "Y-m-d") + ' 00:00:00';
                //             console.log("🚀 ~ Updated selectedDate:", self.selectedDate);
                //             self.errors.date = null;
                //         }
                //     },
                // });

                self.flatpickr_dp_from_date = $("#kt_td_picker_start_input").flatpickr({
                    static: true,
                    enableTime: false, 
                    disableMobile: "true",
                    dateFormat: "Y-m-d", 
                    altFormat: "d/m/Y", 
                    altInput: true,
                    maxDate: "today",
                    onChange: async function (selectedDates, dateStr, instance) {
                        if (selectedDates.length) {
                            const selectedDate = selectedDates[0];
                            const year = selectedDate.getFullYear();
                            const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                            const day = String(selectedDate.getDate()).padStart(2, "0");
                            self.selectedDate = `${year}-${month}-${day}`;
                            console.log("🚀 ~ self.selectedDate:", self.selectedDate);
                            self.errors.date = null;
                        }
                    },
                });
                const currentDate = new Date();
                const formattedDate = currentDate
                  .toISOString()
                  .slice(0, 10)
                  .replace("T", " ");
                self.selectedDate = formattedDate;
             
            },
            handleInputN(value, index, field) {
                let formattedValue = `${value}`.replace(/[^0-9.]/g, ""); // ลบอักขระที่ไม่ต้องการ
                const decimalParts = formattedValue.split('.');
                if (decimalParts.length > 2) {
                    formattedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
                }
                this.dataAds[index][field] = formattedValue;
            },

            formatNumber(number) {
                if (typeof number === 'number') {
                    return number.toLocaleString();
                }
                return number;
            },
            async loadData() {
                const self = this;
                try {
                    showLoading();
                    let data = {
                        "channel_id": "CHANNEL_TIKTOK"
                    }
                    const req = await services.getChannel(data, self.token_header)
                    if (req.data.code === 200) {
                        closeLoading();
                        self.errors = {};
                        self.dataAds = req.data.data || []
                    }
                } catch (error) {
                    closeLoading();
                    console.log("🚀 ~ loadData ~ error:", error)
                }
            },
            validateForm() {
                this.errors = {};
                let isValid = true;
                this.dataAds.forEach((item, index) => {
                    let error = {};
                    if (item.new_ads) {
                        if (!item.channel) {
                            error.channel = true;
                            isValid = false;
                        }
                    }
                    if (!item.total_cost) {
                        error.total_cost = true;
                        isValid = false;
                    }
                    if (!item.total_income) {
                        error.total_income = true;
                        isValid = false;
                    }
                    if (!this.selectedDate) {
                        this.errors.date = "กรุณาเลือก วันที่";
                        isValid = false;
                    }
                    this.errors[index] = error;
                    console.log("🚀 ~ this.dataAds.forEach ~ this.errors[index]:", this.errors[index])
                });
                return isValid;
            },
            addAds() {
                const self = this;
                // บังคับให้เป็นตัวเลข โดยใช้การตรวจสอบ NaN
                let totalCost = parseFloat(self.total_cost);
                let totalIncome = parseFloat(self.total_income);
            
                if (isNaN(totalCost)) totalCost = 0;
                if (isNaN(totalIncome)) totalIncome = 0;

                const currentDate = new Date().toISOString().slice(0, 10);
                let formattedDatestart =self.startDate || new Date().toISOString().slice(0, 10);

                let data = {
                    "new_ads": true,
                    "shop_name": self.channel,
                    "total_cost": totalCost,  
                    "total_income": totalIncome, 
                    // "commission": 10.0,
                    "note": self.note,
                    "p_timestamp":formattedDatestart 
                }
                console.log("After parseFloat:", typeof data.total_cost, data.total_cost);
                console.log("After parseFloat:", typeof data.total_income, data.total_income);
                console.log("Selected Date:", self.selectedDate);

                self.dataAds.push(data)
            },

            async savePage() {
                const self = this;

                if (self.validateForm()) {
                    console.log("Form validated successfully, proceeding to save.");
                    console.log("Data to be sent:", self.dataAds);

                    let dataAds = {
                        data: self.dataAds || []
                    }
                    const req = await services.getInsertMultiple(dataAds, self.token_header);
                    console.log("🚀 ~ savePage ~ req:", req)
                    closeLoading();
                    Msg("บันทึกสำเร็จ", 'success');
                    setTimeout(function () {
                        window.location.reload();
                    }, 2000);
                } else {
                    console.log("Form validation failed.");
                    closeLoading();
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
            "form.total_income"(newValue) {
                let formattedValue = `${newValue}`.replace(/[^0-9.]/g, "");
                const decimalParts = formattedValue.split('.');
                if (decimalParts.length > 2) {
                    formattedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
                }
                this.form.total_income = formattedValue;
            },
        },
        mounted: async function () {
            let self = this
            await self.init();
            console.log("ok")
        }
    });
    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
