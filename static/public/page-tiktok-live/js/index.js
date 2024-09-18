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
                selectedDate: '' ,
            }
        },
        computed: {
        },
        methods: {
            ...window.webUtils.method || {},
            async init() {
                let self = this
                    await self.created()
                    await self.loadData()
                    $("#kt_td_picker_start_input").flatpickr({
                        altInput: true,
                        altFormat: "d/m/Y",
                        dateFormat: "Y-m-d",
                        onChange: function (selectedDates, dateStr, instance) {
                            self.selectedDate = instance.formatDate(selectedDates[0], "Y-m-d") + ' 00:00:00';
                            console.log("🚀 ~ DefaultData ~ self.selectedDate:", self.selectedDate);
                            self.errors.date = null;
                        },
                    });
            },
            handleInputN(value, index, field) {
                let formattedValue = `${value}`.replace(/[^0-9.]/g, ""); // ลบอักขระที่ไม่ต้องการ
                const decimalParts = formattedValue.split('.');
                if (decimalParts.length > 2) {
                    formattedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
                }
                this.dataAds[index][field] = formattedValue;
            },
            created() {
                const currentDate = new Date();
                currentDate.setDate(currentDate.getDate());
                const formattedDate = currentDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
                console.log("🚀 ~ created ~ this.searchData.start_at:", this.start_date_time)
            },

            // focusNext(column, nextIndex) {
            //     const nextInput = this.$refs[column + '_' + nextIndex];
            //     if (nextInput && nextInput[0]) {
            //         nextInput[0].focus(); 
            //     } else if (nextInput) {
            //         nextInput.focus(); 
            //     }
            // },
      

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
                
                let data = {
                    "new_ads": true,
                    "shop_name": self.channel,
                    "total_cost": parseFloat(self.total_cost) || 0,  
                    "total_income": parseFloat(self.total_income) || 0,  
                    // "commission": 10.0,
                    "note": self.note, 
                    "p_timestamp": self.selectedDate
                }
                self.dataAds.push(data)
            },
            
            async savePage() {
                const self = this;
                if (self.validateForm()) {
                    console.log("Form validated successfully, proceeding to save.");
                    // const currentDate = new Date();
                    // currentDate.setDate(currentDate.getDate() + 1);
                    // const formattedDate = currentDate.toISOString().split('T')[0];
                    
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
