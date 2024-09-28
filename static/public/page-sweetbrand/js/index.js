(function ($, window, Vue, axios) {
    'use strict';

    const token_header = getCookie('token');

    const app = Vue.createApp({
        data: function () {
            return {
                ...window.webUtils.data || {},
                user: window.user || "",
                currentPage: 'sweetbrand_form',
                authstatus: window.authstatus,
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                dataProduct: [],
                dataShop: [],
                dataAds: [
                    {
                        "p_date": "",
                        "product_id": "",
                        "ads_tiktok_cost": '',
                        "tiktok": '',
                        "ads_shopee_cost": '',
                        "shopee": '',
                        "ads_lazada_cost": '',
                        "lazada": ''
                    }
                ],
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
                errors_date: {},
                start_date_time: null,
                end_date_time: null,
                data_status: [
                    { id: 'เปิดใช้งาน', name: 'เปิดใช้งาน' },
                    { id: 'ปิดใช้งาน', name: 'ปิดใช้งาน' },
                ],
                valueDate_time: null,
            }
        },
        computed: {
            total_cost(index) {
                return this.dataAds.reduce((sum, item) => {
                    return sum +
                        (parseFloat(item.tiktok) || 0) +
                        (parseFloat(item.shopee) || 0) +
                        (parseFloat(item.lazada) || 0);
                }, 0);
            }



        },
        methods: {
            ...window.webUtils.method || {},
            async init() {
                let self = this

                try {
                    // await self.created()
                    // await self.loadData()
                    // self.dataAds = [
                    //     {
                    //         "p_date": "",
                    //         "ads_tiktok_cost": '',
                    //         "tiktok": '',
                    //         "ads_shopee_cost": '',
                    //         "shopee": '',
                    //         "ads_lazada_cost": '',
                    //         "lazada": ''
                    //     }
                    // ]
                    self.dataAds.forEach((item, index) => {
                        const selectorPayment = '#kt_td_picker_start_input_' + index;
                        self.set_date_time = $("#kt_td_picker_start_input_" + index).flatpickr({
                            altInput: true,
                            altFormat: "d/m/Y",
                            dateFormat: "Y-m-d",
                            onChange: async function (selectedDates, dateStr, instance) {
                                item.p_date = instance.formatDate(selectedDates[0], "Y-m-d"); // Update date in form data
                            },
                        });
                        // self.set_date_time.setDate(item.p_date)
                    })

                    try {
                        const req = await services.getProduct(self.token_header)
                        self.dataProduct = req.data.data || []
                    } catch (error) {
                        console.log("🚀 ~ init ~ error:", error)
                    }
                    // try {
                    //     let data = {}
                    //     const req = await services.getShop(data, self.token_header)
                    //     self.dataShop = req.data.data || []
                    // } catch (error) {
                    //     console.log("🚀 ~ init ~ error:", error)
                    // }

                } catch (error) {
                    console.log("🚀 ~ init ~ error:", error)
                } finally {
                    $("#kt_td_picker_date_input").flatpickr({
                        altInput: true,
                        altFormat: "d/m/Y",
                        dateFormat: "Y-m-d",
                        onChange: async function (selectedDates, dateStr, instance) {

                            const selectedDate = selectedDates[0];
                            const currentTime = new Date();

                            const year = instance.formatDate(selectedDate, "Y");
                            const month = instance.formatDate(selectedDate, "m");
                            const day = instance.formatDate(selectedDate, "d");

                            const formattedDateTime = `${year}-${month}-${day}`;

                            self.valueDate_time = formattedDateTime
                            self.dataAds.forEach((item, index) => {
                                item.p_date = formattedDateTime;
                            });

                        }
                    });

                    self.$nextTick(() => {
                        console.log('a;sldkasld', self.dataProduct)
                        self.dataAds.forEach((item, index) => {
                            const selectorPayment = '#select_product_' + index;
                            if (!$(selectorPayment).data('select2')) {
                                $(selectorPayment).select2({
                                    placeholder: "Select Product",
                                    width: '100%',
                                    data: self.dataProduct.map(
                                        (item) => ({ id: item.id, text: item.product_name })
                                    ),
                                });
                            }
                            $(selectorPayment).on("change.custom", async function () {
                                const selectedValue = $(this).val(); // Get the selected value
                                item.product_id = selectedValue || 10
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
                currentDate.setDate(currentDate.getDate() - 2);
                const formattedDate = currentDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
                this.start_date_time = formattedDate + ' 00:00:00';
                this.end_date_time = formattedDate + ' 23:59:59';
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
                    "p_date": self.valueDate_time,
                    "product_id": "",
                    "ads_tiktok_cost": "",
                    "tiktok": "",
                    "ads_shopee_cost": "",
                    "shopee": "",
                    "ads_lazada_cost": "",
                    "lazada": ""
                }
                self.dataAds.push(data)

                self.$nextTick(() => {

                    self.dataAds.forEach((item, index) => {
                        const selectorPayment = '#select_product_' + index;
                        if (!$(selectorPayment).data('select2')) {
                            $(selectorPayment).select2({
                                placeholder: "Select Product",
                                width: '100%',
                                data: self.dataProduct.map(
                                    (item) => ({ id: item.id, text: item.product_name })
                                ),
                            });
                        }
                        $(selectorPayment).on("change.custom", async function () {
                            const selectedValue = $(this).val(); // Get the selected value
                            item.product_id = selectedValue || 10
                        })

                        const selectorDate = '#kt_td_picker_start_input_' + index;
                        $(selectorDate).flatpickr({
                            altInput: true,
                            altFormat: "d/m/Y",
                            dateFormat: "Y-m-d",
                            onChange: async function (selectedDates, dateStr, instance) {
                                item.p_date = instance.formatDate(selectedDates[0], "Y-m-d" + ' 00:00:00'); // Update date in form data
                            },
                        });
                    })
                })
            },
            deleteAds(index) {
                this.dataAds.splice(index, 1);
            },
            calculateTotal(item) {
                return (parseFloat(item.tiktok) || 0) +
                    (parseFloat(item.shopee) || 0) +
                    (parseFloat(item.lazada) || 0);
            },
            formatNumber(number) {
                if (isNaN(number) || !isFinite(number)) {
                    return "0"; // แสดงค่าเป็น 0
                }
                if (typeof number === 'number') {
                    return number.toLocaleString(); // จัดรูปแบบตัวเลขให้มีคอมม่า
                }
                return number;
            },
            validateForm() {
                this.errors = {};
                this.errors_date = {};
                let isValid = true;

                this.dataAds.forEach((item, index) => {
                    let error = {};
                    let error_date = {};

                    if (item.product_id === "") {
                        error.product = 'กรุณาเลือก สินค้า';
                        isValid = false;
                    }
                    if (item.ads_tiktok_cost === "") {
                        error.ads_tiktok_cost = true;
                        isValid = false;
                    }
                    if (item.tiktok === "") {
                        error.tiktok = true;
                        isValid = false;
                    }
                    if (item.ads_shopee_cost === "") {
                        error.ads_shopee_cost = true;
                        isValid = false;
                    }
                    if (item.shopee === "") {
                        error.shopee = true;
                        isValid = false;
                    }
                    if (item.ads_lazada_cost === "") {
                        error.ads_lazada_cost = true;
                        isValid = false;
                    }
                    if (item.lazada === "") {
                        error.lazada = true;
                        isValid = false;
                    }
                    if (!this.valueDate_time) {
                        error_date.date = "กรุณาเลือก วันที่";
                        isValid = false;
                    }

                    this.errors[index] = error;
                    this.errors_date = error_date;
                });

                return isValid;
            },
            async savePage() {
                const self = this;
                console.log(self.dataAds)
                if (self.validateForm()) {
                    const currentDate = new Date();
                    currentDate.setDate(currentDate.getDate() + 1);
                    const formattedDate = currentDate.toISOString().split('T')[0];


                    let dataAds = {
                        data: self.dataAds || []
                    }
                    dataAds.data.forEach((data, index) => {
                        data.valueDate_time = self.valueDate_time;
                        data.ads_tiktok_cost = Number(data.ads_tiktok_cost) || 0;
                        data.tiktok = Number(data.tiktok) || 0;
                        data.ads_shopee_cost = Number(data.ads_shopee_cost) || 0;
                        data.shopee = Number(data.shopee) || 0;
                        data.ads_lazada_cost = Number(data.ads_lazada_cost) || 0;
                        data.lazada = Number(data.lazada) || 0;
                        data.p_date = data.p_date
                    })

                    const req = await services.insertData(dataAds, self.token_header);

                    if (req.data.code !== 200) {
                        // console.log("Insert failed for data:", data);
                        Msg("บันทึกไม่สำเร็จ", 'error');
                        return;
                    } else {
                        closeLoading();
                        // Msg("บันทึกสำเร็จ", 'success');
                        Swal.fire({
                            title: 'บันทึกสำเร็จ',
                            icon: 'success',
                            confirmButtonText: 'ตกลง'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload();
                            }
                        });
                    }


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
