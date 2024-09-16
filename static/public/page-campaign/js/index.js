(function ($, window, Vue, axios) {
    'use strict';
    const token_header = getCookie('token');
    const app = Vue.createApp({
        data: function () {
            const _page_settings = {
                // activeTab: null,
                // is_pending: false,
                // view_mode: window.view_mode || "",
                // edit_mode: window.edit_mode || "",
                // back_redirect: "./xxxx.html",
                validator_form: null,

                // page settings
            }
            return {
                user: window.user || "",
                // currentPage: window.currentPage,
                currentPage: 'campaign_form',
                authstatus: window.authstatus,
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                validator_form: null,
                ..._page_settings,
                form: {
                    channel: "",
                    type: "",
                    name: "",
                    start_date: "",
                    end_date: "",
                    desc: "",
                    remark: "",
                },
                token_header: token_header || '',
                dataChannel: [],
                dataType: [
                    { id: 1, type_name: 'Campaign' },
                    { id: 2, type_name: 'Live' },
                    { id: 3, type_name: 'Live Rerun' },
                    { id: 4, type_name: 'Coupon' },
                ],
                dataShop: [],
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
                        const req = await services.getChannel(self.token_header)
                        self.dataChannel = req.data.data || []
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
                    self.flatpickr_dp_start_date = $("#kt_datepicker_start").flatpickr({
                        altInput: true,
                        altFormat: "d/m/Y",
                        dateFormat: "Y-m-d",
                        onChange: function (selectedDates, dateStr, instance) {
                            self.start_date = instance.formatDate(selectedDates[0], "Y-m-d"); // Update date in form data
                            console.log("🚀 ~ init ~ self.start_date:", self.start_date)
                            self.flatpickr_dp_end_date.set('minDate', selectedDates[0]);

                            if (self.end_date && new Date(self.start_date) > new Date(self.end_date)) {
                                self.flatpickr_dp_end_date.clear();
                                self.end_date = "";
                            }
                            delete self.errors.start_date;
                        },
                    });
                    self.flatpickr_dp_end_date = $("#kt_datepicker_end").flatpickr({
                        altInput: true,
                        altFormat: "d/m/Y",
                        dateFormat: "Y-m-d",
                        onChange: function (selectedDates, dateStr, instance) {
                            self.end_date = instance.formatDate(selectedDates[0], "Y-m-d"); // Update date in form data
                            self.flatpickr_dp_start_date.set('maxDate', selectedDates[0]);
                            delete self.errors.end_date;
                        },
                    });
                }
            },
            async savePage() {
                const self = this;
                if (self.validateForm()) {
                    try {
                        showLoading();
                        let data = {
                            "campaign_channel": self.form.channel || '',
                            "campaign_type": self.form.type || '',
                            "campaign_desc": self.form.desc || '',
                            "campaign_remark": self.form.remark || '',
                            "campaign_start_date": self.start_date || '',
                            "campaign_end_date": self.end_date || '',
                            "sls_campaign_name": self.form.name || ''
                        }
                        console.log("🚀 ~ savePage ~ data:", data)
                        const req = await services.insertData(data, self.token_header)
                        if (req.data.code === 200) {
                            closeLoading()
                            Msg("บันทึกสำเร็จ", 'success');
                            setTimeout(function () {
                                window.location.reload();
                            }, 2000)
                        }
                    } catch (error) {
                        closeLoading()
                        console.log("🚀 ~ savePage ~ error:", error)
                    }
                } else {
                    console.log("Form validation failed.");
                    closeLoading()
                }
            },

            validateForm() {
                this.errors = {};

                if (!this.form.channel) {
                    this.errors.channel = 'กรุณาเลือกชื่อช่องทาง';
                }
                if (!this.form.type) {
                    this.errors.type = 'กรุณาเลือก Type';
                }
                if (!this.form.name) {
                    this.errors.name = 'กรุณาเลือก Name';
                }
                if (!this.start_date) {
                    this.errors.start_date = 'กรุณาเลือก Start Date';
                }
                if (!this.end_date) {
                    this.errors.end_date = 'กรุณาเลือก End Date';
                }
                if (!this.form.desc) {
                    this.errors.desc = 'กรุณากรอก Desc';
                }

                return Object.keys(this.errors).length === 0;
            },

        },

        mounted: async function () {
            let self = this
            await self.init()
            //    self.getPokemon()
            console.log("ok")
        }


    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
