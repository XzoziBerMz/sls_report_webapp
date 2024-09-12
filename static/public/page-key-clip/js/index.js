(function ($, window, Vue, axios) {
    'use strict';
    const token_header = getCookie('token');
    const app = Vue.createApp({
        data: function () {
            return {
                user: window.user || "",
                currentPage: 'key-clip',
                // currentPage: window.currentPage,
                authstatus: window.authstatus,
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                dataChannel: [],
                dataVdo: [],
                dataInsertVdoHandler: [],
                token_header: token_header || '',
                form: {
                    channel: "",
                    product: "",
                    vdo: "",
                    date: "",
                },
                errors: {}
            }
        },
        methods: {
            async init() {
                let self = this;
            },
            async loadData() {
                showLoading();
                try {
                    // Make parallel API calls to fetch channel and video data
                    const [responseChannel, responseVdo] = await Promise.all([
                        services.getChannel(this.token_header),
                        services.getvdo(this.token_header)
                    ]);

                    // Assign the response data to the respective variables
                    this.dataChannel = responseChannel?.data?.data || [];
                    this.dataVdo = responseVdo?.data?.data || [];
                } catch (error) {
                    console.warn('🌦️ ~ loadData ~ error:', error);
                } finally {
                    closeLoading();
                }
            },


            async DefaultData() {
                const self = this;
                self.flatpickr_dp_from_date = $("#kt_td_picker_basic_input").flatpickr({
                    static: true,
                    enableTime: true,
                    disableMobile: "true",
                    dateFormat: "d/m/Y",
                    onChange: function (selectedDates, dateStr, instance) {
                        self.form.date = instance.formatDate(selectedDates[0], "Y-m-d") + ' 00:00:00'; // Update date in form data
                        console.log("🚀 ~ DefaultData ~ self.form.date:", self.form.date)
                        delete self.errors.date; // Remove validation error for date field
                    },
                });
            },

            validateForm() {
                this.errors = {};

                if (!this.form.channel) {
                    this.errors.channel = 'กรุณาเลือกชื่อช่องทาง';
                }
                if (!this.form.product) {
                    this.errors.product = 'กรุณาเลือกสินค้า';
                }
                if (!this.form.vdo) {
                    this.errors.vdo = 'กรุณากรอก ลิ้งค์ VDO';
                }
                if (!this.form.date) {
                    this.errors.date = 'กรุณาเลือก Date';
                }

                return Object.keys(this.errors).length === 0;
            },

            handleInput(field) {
                delete this.errors[field];
            },
            async handleSubmit(event) {
                event.preventDefault();

                if (this.validateForm()) {
                    try {
                        showLoading();
                        console.log("🚀 ~ DefaultData ~ self.form.date:", this.form.date);

                       
                        let dateParts = this.form.date.split('/');
                        let formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;

                        console.log("Formatted Date:", formattedDate);

                        let data = {
                            "product": this.form.product || "",
                            "note": this.form.remark || "",
                            "link_vdo": this.form.vdo || "",
                            "approved": "",
                            "approve_date": "",
                            "chanel": this.form.channel || "",
                            "date": formattedDate || ""
                        };
                        console.log("🚀 ~ handleSubmit ~ data:", data)


                        // Call the service to handle the form submission
                        const responsegetInsertVdoHandler = await services.getInsertVdoHandler(data, this.token_header);
                        const response = responsegetInsertVdoHandler?.data || {};

                        if (response.code === 200) {
                            this.dataInsertVdoHandler = response.data || [];
                            closeLoading()
                            Msg("บันทึกสำเร็จ", 'success');
                            setTimeout(function () {
                                window.location.reload();
                            }, 2000)
                        }

                    } catch (error) {
                        console.warn("Error submitting form:", error.response?.data || error.message);
                        closeLoading()
                    }
                } else {
                    console.log("Form validation failed.");
                    closeLoading()
                }
            },



            resetForm() {
                this.form = {
                    channel: "",
                    product: "",
                    vdo: "",
                    remark: "",
                    date: ""
                };

                this.errors = {};

                if (this.flatpickr_dp_from_date) {
                    this.flatpickr_dp_from_date.clear();
                }

            }





        },

        mounted: function () {
            let self = this;
            self.DefaultData();
            self.loadData();
            console.log("ok");
        }
    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
