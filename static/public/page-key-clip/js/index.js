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
                dataChannel: [],
                dataVdo: [],
                form: {
                    date: "",
                    channel: "",
                    product: "",
                    vdo: "",
                    // remark: ""
                },
                errors: {}
            }
        },
        methods: {
            async init() {
                let self = this;
            },

            async loadData() {
                const self = this;
                try {
                    let responseGetChannel = await services.getChannel();
                    const dataChannel = responseGetChannel?.data?.data || [];
                    this.dataChannel = dataChannel;
                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
                try {
                    let responseGetVdo = await services.getvdo();
                    const dataVdo = responseGetVdo?.data.data || [];
                    self.dataVdo = dataVdo;

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
            },

            async DefaultData() {
                const self = this;
                self.flatpickr_dp_from_date = $("#kt_td_picker_basic_input").flatpickr({
                    static: true,
                    enableTime: true,
                    disableMobile: "true",
                    dateFormat: "Y-m-d H:i",
                    onChange: function (selectedDates, dateStr, instance) {
                        self.form.date = dateStr; // Update date in form data
                        delete self.errors.date; // Remove validation error for date field
                    },
                });
            },

            validateForm() {
                this.errors = {};
        
                if (!this.form.date) {
                    this.errors.date = 'กรุณาเลือกวันที่';
                }
                if (!this.form.channel) {
                    this.errors.channel = 'กรุณาเลือกชื่อช่องทาง';
                }
                if (!this.form.product) {
                    this.errors.product = 'กรุณาเลือกสินค้า';
                }
                // if (!this.form.vdo) {
                //     this.errors.vdo = 'กรุณากรอกลิ้งค์ VDO';
                // }
                // if (!this.form.remark) {
                //     this.errors.remark = 'กรุณากรอกหมายเหตุ';
                // }
        
                // If there are no errors, return true
                return Object.keys(this.errors).length === 0;
            },

            handleInput(field) {
                delete this.errors[field]; // Remove the error message for this field
            },

            async handleSubmit(event) {
                event.preventDefault();
                
                if (this.validateForm()) {
                    // Form is valid, proceed with submission
                    Swal.fire({
                        text: "กรอกข้อมูล สำเร็จ!",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    }).then(() => {
                        // Reset form fields
                        this.form = {
                            date: "",
                            channel: "",
                            product: "",
                            // vdo: "",
                            remark: ""
                        };
        
                        // Reset the errors object
                        this.errors = {};
                        
                        // Reset the date picker
                        this.flatpickr_dp_from_date.clear();
        
                        // Add any additional logic you need after successful submission
                    });
                } else {
                    // Form is invalid, show an error message
                    Swal.fire({
                        text: "กรุณากรอกข้อมูลให้ครบถ้วน",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-danger"
                        }
                    });
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
