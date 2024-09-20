(function ($, window, Vue, axios) {
    'use strict';

    const token_header = getCookie('token');

    const app = Vue.createApp({
        data: function () {
            return {
                ...window.webUtils.data || {},
                user: window.user || "",
                currentPage: 'ads_form',
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
                    name: '',
                    total_cost: '',
                    budget: '',
                    total_income: '',
                    cost_per_purchase: '',
                    purchase: '',
                    note: '',
                },
                errors: {},
                start_date_time: null,
                end_date_time: null,
                data_status: [
                    { id: 'active', name: 'เปิดใช้งาน' },
                    { id: 'inactive', name: 'ปิดใช้งาน' },
                ]
            }
        },
        computed: {




        },
        methods: {
            ...window.webUtils.method || {},
            async init() {
                let self = this

                try {
                    await self.created()
                    await self.loadData()

                    self.dataAds.forEach((item, index) => {
                        const selectorPayment = '#kt_td_picker_start_input_' + index;
                        self.set_date_time = $("#kt_td_picker_start_input_" + index).flatpickr({
                            altInput: true,
                            altFormat: "d/m/Y",
                            dateFormat: "Y-m-d",
                            onChange: async function (selectedDates, dateStr, instance) {
                                item.date = instance.formatDate(selectedDates[0], "Y-m-d"); // Update date in form data
                            },
                        });
                        self.set_date_time.setDate(item.date)
                    })

                    try {
                        const req = await services.getProduct(self.token_header)
                        self.dataProduct = req.data.data || []
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
                    $("#kt_td_picker_start_input").flatpickr({
                        altInput: true,
                        altFormat: "d/m/Y",
                        dateFormat: "Y-m-d",
                        onChange: async function (selectedDates, dateStr, instance) {
                            self.start_date_time = instance.formatDate(selectedDates[0], "Y-m-d"); // Update date in form data
                            self.end_date_time = instance.formatDate(selectedDates[0], "Y-m-d"); // Update date in form data

                            self.dataAds = [];
                            await self.loadData()

                            self.$nextTick(() => {

                                self.dataAds.forEach((item, index) => {
                                    const selectorPayment = '#kt_td_picker_start_input_' + index;
                                    self.set_date_time = $("#kt_td_picker_start_input_" + index).flatpickr({
                                        altInput: true,
                                        altFormat: "d/m/Y",
                                        dateFormat: "Y-m-d",
                                        onChange: async function (selectedDates, dateStr, instance) {
                                            item.date = instance.formatDate(selectedDates[0], "Y-m-d"); // Update date in form data
                                        },
                                    });
                                    self.set_date_time.setDate(item.date)
                                })

                                self.dataAds.forEach((item, index) => {
                                    const selectorPayment = '#select_status_' + index;
                                    if (!$(selectorPayment).data('select2')) {
                                        $(selectorPayment).select2({
                                            placeholder: "Select Status",
                                            width: '100%',
                                            data: self.data_status.map(
                                                (item) => ({ id: item.id, text: item.name })
                                            ),
                                        });
                                    }
                                    $(selectorPayment).on("change.custom", async function () {
                                        const selectedValue = $(this).val(); // Get the selected value
                                        console.log("🚀 ~ selectedValue:", self.dataAds)
                                        item.status = selectedValue || 10
                                    })
                                })
                            })
                        },
                    });

                    $("#kt_td_picker_date_input").flatpickr({
                        altInput: true,
                        altFormat: "d/m/Y",
                        dateFormat: "Y-m-d",
                        onChange: async function (selectedDates, dateStr, instance) {

                            self.dataAds.forEach((item, index) => {
                                const selectedDate = selectedDates[0];
                                const currentTime = new Date();

                                const year = instance.formatDate(selectedDate, "Y");
                                const month = instance.formatDate(selectedDate, "m");
                                const day = instance.formatDate(selectedDate, "d");

                                const hours = currentTime.getHours().toString().padStart(2, '0');
                                const minutes = currentTime.getMinutes().toString().padStart(2, '0');
                                const seconds = currentTime.getSeconds().toString().padStart(2, '0');

                                const formattedDateTime = `${year}-${month}-${day}`;

                                item.date = formattedDateTime;
                                self.valueDate_time = formattedDateTime
                            });

                            console.log("🚀 ~ self.dataAds.forEach ~ self.valueDate_time:", self.valueDate_time)
                        }
                    });



                    self.$nextTick(() => {

                        self.dataAds.forEach((item, index) => {
                            const selectorPayment = '#select_status_' + index;
                            if (!$(selectorPayment).data('select2')) {
                                $(selectorPayment).select2({
                                    placeholder: "Select Status",
                                    width: '100%',
                                    data: self.data_status.map(
                                        (item) => ({ id: item.id, text: item.name })
                                    ),
                                });
                            }
                            $(selectorPayment).on("change.custom", async function () {
                                const selectedValue = $(this).val(); // Get the selected value
                                item.status = selectedValue || 10
                            })
                        })
                    })
                }
            },
            handleInputN(value, index, field) {
                let formattedValue = `${value}`.replace(/[^0-9.]/g, ""); // ลบอักขระที่ไม่ต้องการ

                // แยกทศนิยมออก
                const decimalParts = formattedValue.split('.');

                // ตรวจสอบว่าแยกได้มากกว่าสองส่วนหรือไม่ (มากกว่า 1 จุดทศนิยม)
                if (decimalParts.length > 2) {
                    formattedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
                }

                // กำหนดค่าที่ถูกต้องกลับไปที่ฟิลด์
                this.dataAds[index][field] = formattedValue;
            },
            created() {
                // Set start_at to one day before the current date
                const currentDate = new Date();
                currentDate.setDate(currentDate.getDate());
                const formattedDate = currentDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
                this.start_date_time = formattedDate;
                this.end_date_time = formattedDate;
                console.log("🚀 ~ created ~ this.searchData.start_at:", this.start_date_time)
            },
            focusNext(column, nextIndex) {
                const nextInput = this.$refs[column + '_' + nextIndex];
                if (nextInput && nextInput[0]) { // ตรวจสอบว่าถ้าเป็น array
                    nextInput[0].focus(); // เข้าถึง element จริงถ้าเป็น array
                } else if (nextInput) {
                    nextInput.focus(); // ถ้าเป็น element เดียว
                }
            },
            addAds() {
                const self = this;
                let data = {
                    "new_ads": true,
                    "shop_name": "Test",
                    "name": "",
                    "product": "",
                    "total_cost": "",
                    "budget": "",
                    "total_shop_income": "",
                    "cost_per_purchase": "",
                    "purchase": "",
                    "note": "",
                    "ref_default": 1,
                    "date": self.valueDate_time
                }
                self.dataAds.push(data)

                self.$nextTick(() => {

                    self.dataAds.forEach((item, index) => {
                        const selectorPayment = '#select_status_' + index;
                        if (!$(selectorPayment).data('select2')) {
                            $(selectorPayment).select2({
                                placeholder: "Select Status",
                                width: '100%',
                                data: self.data_status.map(
                                    (item) => ({ id: item.id, text: item.name })
                                ),
                            });
                        }
                        $(selectorPayment).on("change.custom", async function () {
                            const selectedValue = $(this).val(); // Get the selected value
                            item.status = selectedValue || 10
                        })

                        const selectorDate = '#kt_td_picker_start_input_' + index;
                        $(selectorDate).flatpickr({
                            altInput: true,
                            altFormat: "d/m/Y",
                            dateFormat: "Y-m-d",
                            onChange: async function (selectedDates, dateStr, instance) {
                                item.date = instance.formatDate(selectedDates[0], "Y-m-d"); // Update date in form data
                            },
                        });
                    })
                })
            },
            formatNumber(number) {
                if (typeof number === 'number') {
                    return number.toLocaleString(); // Format number with commas
                }
                return number; // Return as is if not a number
            },
            async loadData() {
                const self = this;
                try {
                    showLoading();
                    let data = {
                        "search": "",
                        // "ref_default": 1,
                        "page": 1,
                        "per_page": 50,
                        "start_at": self.start_date_time,
                        "end_at": self.end_date_time,
                        "order": "",
                        "order_by": "desc"
                    }
                    const currentDate = new Date();
                    currentDate.setDate(currentDate.getDate());
                    const formattedDate = currentDate.toISOString().split('T')[0];
                    const req = await services.getAds(data, self.token_header)
                    if (req.data.code === 200) {
                        closeLoading();
                        self.errors = {};
                        self.dataAds = req.data.data || [];
                        self.dataAds.forEach(item => {
                            item.date = formattedDate;  // แก้ไขค่า date ใน item โดยตรง
                        });
                    }
                } catch (error) {
                    closeLoading();
                    console.log("🚀 ~ loadData ~ error:", error)
                }
            },
            validateForm() {
                this.errors = {};
                this.errors_date = {};
                let isValid = true;

                this.dataAds.forEach((item, index) => {
                    let error = {};
                    let error_date = {};

                    if (!item.name) {
                        error.name = true;
                        isValid = false;
                    }

                    if (!item.product) {
                        error.product = true;
                        isValid = false;
                    }

                    if (!item.name) {
                        error.name = true;
                        isValid = false;
                    }
                    if (!item.total_cost) {
                        error.total_cost = true;
                        isValid = false;
                    }
                    if (!item.budget) {
                        error.budget = true;
                        isValid = false;
                    }
                    if (!item.product) {
                        error.product = true;
                        isValid = false;
                    }
                    if (!item.total_shop_income) {
                        error.total_shop_income = true;
                        isValid = false;
                    }
                    if (!item.cost_per_purchase) {
                        error.cost_per_purchase = true;
                        isValid = false;
                    }
                    if (!item.purchase) {
                        error.purchase = true;
                        isValid = false;
                    }
                    if (!item.note) {
                        error.note = true;
                        isValid = false;
                    }
                    if (!this.valueDate_time) {
                        error_date.date = "กรุณาเลือก วันที่";
                        isValid = false;
                    }
                    if (!item.status) {
                        error.status = "กรุณาเลือก สถานะ"
                        isValid = false;
                    }

                    this.errors[index] = error;
                    this.errors_date = error_date;
                });

                return isValid;
            },
            async savePage() {
                const self = this;
                if (self.validateForm()) {
                    showLoading();
                    const currentDate = new Date();
                    currentDate.setDate(currentDate.getDate() + 1);
                    const formattedDate = currentDate.toISOString().split('T')[0];

                    for (const ad of self.dataAds) {
                        ad.total_cost = Number(ad.total_cost) || 0;
                        ad.budget = Number(ad.budget) || 0;
                        ad.total_shop_income = Number(ad.total_shop_income) || 0;
                        ad.cost_per_purchase = Number(ad.cost_per_purchase) || 0;
                        // ad.date = formattedDate || '';
                        try {
                            const req = await services.insertData(ad, self.token_header);
                        } catch (error) {
                            console.log("Error saving ad:", ad, error);
                            return 
                            // จัดการข้อผิดพลาด
                        }
                    }
                    
                    closeLoading();
                    Msg("บันทึกสำเร็จ", 'success');
                    setTimeout(function () {
                        window.location.reload();
                    }, 2000);

                } else {
                    console.log("Form validation failed.");
                    closeLoading()
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
            "form.budget"(newValue) {
                let formattedValue = `${newValue}`.replace(/[^0-9.]/g, "");
                const decimalParts = formattedValue.split('.');
                if (decimalParts.length > 2) {
                    formattedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
                }
                this.form.budget = formattedValue;
            },
            "form.total_income"(newValue) {
                let formattedValue = `${newValue}`.replace(/[^0-9.]/g, "");
                const decimalParts = formattedValue.split('.');
                if (decimalParts.length > 2) {
                    formattedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
                }
                this.form.total_income = formattedValue;
            },
            "form.cost_per_purchase"(newValue) {
                let formattedValue = `${newValue}`.replace(/[^0-9.]/g, "");
                const decimalParts = formattedValue.split('.');
                if (decimalParts.length > 2) {
                    formattedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
                }
                this.form.cost_per_purchase = formattedValue;
            },
            // "form.purchase"(newValue) {
            //     let formattedValue = `${newValue}`.replace(/[^0-9.]/g, "");
            //     const decimalParts = formattedValue.split('.');
            //     if (decimalParts.length > 2) {
            //         formattedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
            //     }
            //     this.form.purchase = formattedValue;
            // },
        },

        mounted: async function () {
            let self = this

            await self.init();
            console.log("ok")
        }


    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
