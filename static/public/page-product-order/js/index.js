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
                form: {
                    date: "",
                    product: "",
                    nameproduct: "",
                    orderNumber: "",
                    channel: "",
                    remark: ""
                },
                errors: {}
            }
        },
        methods: {
            async init() {
                let self = this;
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
                if (!this.form.product) {
                    this.errors.product = 'กรุณากรอกสินค้า';
                }
                if (!this.form.nameproduct) {
                    this.errors.nameproduct = 'กรุณากรอกชื่อสินค้า';
                }
                if (!this.form.orderNumber) {
                    this.errors.orderNumber = 'กรุณากรอกหมายเลขคำสั่งซื้อ';
                }
                if (!this.form.channel) {
                    this.errors.channel = 'กรุณากรอกช่องทาง';
                }
                if (!this.form.remark) {
                    this.errors.remark = 'กรุณากรอกหมายเหตุ';
                }

                return Object.keys(this.errors).length === 0;
            },

            handleInput(field) {
                delete this.errors[field];
            },

            async handleSubmit(event) {
                event.preventDefault();
                if (this.validateForm()) {
                    // Form is valid
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
                            product: "",
                            orderNumber: "",
                            channel: "",
                            remark: ""
                        };
                        this.errors = {}; // Clear errors
                    });

                    // You can add your axios post request here to submit the form data

                } else {
                    // Form is invalid
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
            console.log("ok");
        }
    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
