(function ($, window, Vue, axios) {
    'use strict';
    const token_header = getCookie('token');
    const app = Vue.createApp({
        data: function () {
            return {
                user: window.user || "",
                // currentPage: window.currentPage,
                currentPage: 'negative-details',
                authstatus: window.authstatus,
                datas: [],
                token_header: token_header || '',
                inventoryDetail: [],
                search: "",
                filtered: [],
                dataChannel: [],
                dataProduct: [],
                dataDailyHandler: [],
                dataStars: [],

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
                        name: "รอติดต่อเบอร์",
                    },
                    {
                        id: 3,
                        name: "ติดต่อไม่ได้/ไม่ได้รับสาย",
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
                        name: "แก้ไขดาวแล้ว",
                    },
                    {
                        id: 7,
                        name: "ยังไม่ได้แก้ไข",
                    },
                    {
                        id: 8,
                        name: "ไม่รับสายครั้งที่1",
                    },
                    {
                        id: 9,
                        name: "ไม่รับสายครั้งที่2",
                    },
                    {
                        id: 10,
                        name: "ไม่รับสายครั้งที่3",
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
                    let data = {
                        "channel_id": "CHANNEL_TIKTOK"
                    }
                    const [responseGetChannel, responseGetProduct] = await Promise.all([
                        services.getChannel(data, self.token_header),
                        services.getProduct(self.token_header)
                    ]);

                    const dataChannel = responseGetChannel?.data.data || [];
                    self.dataChannel = dataChannel;

                    const dataProduct = responseGetProduct?.data.data || [];
                    self.dataProduct = dataProduct;

                } catch (error) {
                    console.warn('🌦 ~ loadData ~ error:', error);
                } finally {
                    closeLoading();
                }
            },


            async loadStars() {
                const self = this;
                try {
                    let responseStars = await services.getdataEditStars(self.token_header);
                    self.dataStars = responseStars?.data.data || []; // เก็บข้อมูลลงใน dataStars
                } catch (error) {
                    console.warn(`🌦️ ~ loaddataReview ~ error:`, error);
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
                        self.form.date = instance.formatDate(selectedDates[0], "Y-m-d") + ' 00:00:00'; // Update date in form data
                        console.log("🚀 ~ DefaultData ~ self.form.date:", self.form.date)
                        delete self.errors.date;
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
                        console.log("🚀 ~ DefaultData ~ self.form.date:", this.form.date)
                        let date = new Date(this.form.date); // Convert to Date object
                        let formattedDate = date.toISOString().split('T')[0];
                        // Create a data object with the correct field names as expected by the backend
                        let data = {
                            customer_name: this.form.nameTT || "",
                            phone_no: this.form.phone_number || "",
                            case_detail: this.form.additional_notes || "",
                            channel: this.form.channel || "", // Use 'chanel' instead of 'channel' to match backend
                            product: this.form.product || "",
                            note: this.form.note || "",
                            action: this.form.editstars || "",
                            date: formattedDate || ""
                        };


                        // Log data and headers for debugging
                        console.log("Sending data:", data);
                        console.log("Token header:", this.token_header);

                        // Send the data using your service
                        const responseGetDailyHandler = await services.getInsertReviewDailyHandler(data, this.token_header);
                        const response = responseGetDailyHandler?.data || {};

                        Msg("บันทึกสำเร็จ", 'success');
                        setTimeout(function () {
                            window.location.reload();
                        }, 2000)

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
            self.loadStars();
            console.log("ok");
        }
    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
