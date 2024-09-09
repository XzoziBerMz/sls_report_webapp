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
                token_header: token_header || '',
                inventoryDetail: [],
                search: "",
                filtered: [],
                dataChannel: [],
                dataProduct: [],
                dataDailyHandler: [],

                form: {
                    date: "",
                    channel: "",
                    product: "",
                    nameTT: "",
                    phone_number: "",
                    note: "",
                    editstars: ""
                },
                dataEditStars: [
                    {
                        id: 1,
                        name: "ติดตามดาว",
                    },
                    {
                        id: 2,
                        name: "รอติดต้อเบอร์",
                    },
                    {
                        id: 3,
                        name: "ติดต่อไม่ได้/ไม่ได้รัยสาย",
                    },
                    {
                        id: 4,
                        name: "ลูกค้าไม่ตอบแชท",
                    },
                    {
                        id: 5,
                        name: "ลูกค้าแก้ไม่ได้แล้ว",
                    },
                    {
                        id: 6,
                        name: "แก้ไขกาวแล้ว",
                    },
                    {
                        id: 7,
                        name: "ยังไม่ได้แก้ไข",
                    },
                    {
                        id: 8,
                        name: "ไม่รับสายครั้งที่ 1",
                    },
                    {
                        id: 9,
                        name: "ไม่รับสายครั้งที่ 2",
                    },
                    {
                        id: 10,
                        name: "ไม่รับสายครั้งที่ 3",
                    },
                ],

                errors: {}
            }
        },
        methods: {
            async init() {
                let self = this;
            },

            async loadData() {
                const self = this;
                showLoading();
                try {
                    const [responseGetChannel, responseGetProduct] = await Promise.all([
                        services.getChannel(),
                        services.getProduct()
                    ]);

                    const dataChannel = responseGetChannel?.data.data || [];
                    self.dataChannel = dataChannel;

                    const dataProduct = responseGetProduct?.data.data || [];
                    self.dataProduct = dataProduct;

                    // เรียก API ที่สามแยกต่างหาก
                    const responseGetEditStars = await services.getEditStars(); // สมมติว่า API นี้มีอยู่
                    const dataEditStars = responseGetEditStars?.data.data || [];
                    self.dataEditStars = dataEditStars;

                } catch (error) {
                    console.warn('🌦 ~ loadData ~ error:', error);
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
                    dateFormat: "Y-m-d",
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
                if (!this.form.nameTT) {
                    this.errors.nameTT = 'กรุณากรอกลิ้งค์ชื่อTTลูกค้า';
                }
                if (!this.form.phone_number) {
                    this.errors.phone_number = 'กรุณากรอกเบอร์โทรลูกค้า';
                }
                if (!this.form.note) {
                    this.errors.note = 'กรุณากรอกหมายเหตุ';
                }

                if (!this.form.editstars) {
                    this.errors.editstars = 'กรุณาเลือกสินค้าติดตามแก้ไขดาว';
                }

                // If there are no errors, return true
                return Object.keys(this.errors).length === 0;
            },

            handleInputNumber(field) {
                if (field === 'phone_number') {
                    // จำกัดเฉพาะตัวเลขและจำนวนตัวเลขไม่เกิน 10 ตัว
                    this.form.phone_number = this.form.phone_number.replace(/\D/g, '').slice(0, 10);
                }
                delete this.errors[field]; // Remove the error message for this field
                // อาจจะเพิ่ม logic สำหรับตรวจสอบ errors ที่นี่
            },

            handleInput(field) {
                delete this.errors[field]; // Remove the error message for this field
            },
            async handleSubmit(event) {
                event.preventDefault();

                if (this.validateForm()) {
                    console.log("กรอกข้อมูล สำเร็จ!");

                    try {

                        // Create a data object with the correct field names as expected by the backend
                        let data = {
                            customer_name: this.form.nameTT || "",
                            phone_no: this.form.phone_number || "",
                            case_detail: this.form.additional_notes || "",
                            channel: this.form.channel || "", // Use 'chanel' instead of 'channel' to match backend
                            product: this.form.product || "",
                            note: this.form.note || "",
                            action: this.form.editstars || "",
                            date: this.form.date || ""
                        };


                        // Log data and headers for debugging
                        console.log("Sending data:", data);
                        console.log("Token header:", this.token_header);

                        // Send the data using your service
                        const responseGetDailyHandler = await services.getInsertReviewDailyHandler(data, this.token_header);
                        const response = responseGetDailyHandler?.data || {};
                        this.dataDailyHandler = response.data || [];

                        const totalItems = response.total || 0;
                        this.totalPages = Math.ceil(totalItems / +this.perPage);

                        // Clear the form after submission
                        this.form = {
                            date: "",
                            channel: "",
                            product: "",
                            nameTT: "",
                            phone_number: "",
                            note: "",
                            editstars: "",
                            additional_notes: ""
                        };

                        // Clear errors and any flatpickr values
                        this.errors = {};
                        this.flatpickr_dp_from_date.clear();

                        Msg("บันทึกสำเร็จ", 'success');
                        setTimeout(function () {
                            window.location.reload();
                        }, 2000)

                    } catch (error) {
                        console.warn("Error loading data:", error.response ? error.response.data : error.message);

                    }
                } else {
                    console.log("กรุณากรอกข้อมูลให้ครบถ้วน");

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
