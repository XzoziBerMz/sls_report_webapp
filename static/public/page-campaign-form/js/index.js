(function ($, window, Vue, axios) {
    'use strict';

    const token_header = getCookie('token');

    const app = Vue.createApp({
        data: function () {
            return {
                ...window.webUtils.data || {},
                user: window.user || "",
                currentPage: 'campaign_form',
                currentPageSub: 'campaign_tt',
                authstatus: window.authstatus,
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                dataProduct: [],
                dataShop: [],
                dataAds: [],
                token_header: token_header || '',
                errors: {},
                errors_date: {},
                errors_channel: {},
                start_date_time: null,
                end_date_time: null,
                valueDate_time: null,
                value_channel: "",
                value_channel_id: "",
            }
        },
        computed: {




        },
        methods: {
            ...window.webUtils.method || {},
            async init() {
                let self = this

                try {
                    // await self.created()
                    // await self.loadData()

                } catch (error) {
                    console.log("🚀 ~ init ~ error:", error)
                } finally {

                    $('#select_channel').on("change.custom", async function () {
                        showLoading();
                        const selectedValue = $(this).find("option:selected").text(); // Get the selected value
                        const selectedId = $(this).val();
                        self.value_channel = selectedValue || ''
                        self.value_channel_id = selectedId || ''

                        try {
                            let data = {
                                "channel_id": selectedId || ''
                            }
                            const req = await services.getShop(data, self.token_header)
                            self.dataAds = []
                            self.dataAds = [
                                {
                                    "new_ads": true,
                                    "campaign_name": "",
                                    "channel_id": selectedId,
                                    "details": [],
                                    "start_date": "",
                                    "end_date": "",
                                    "type": "",
                                    "remark": "",
                                }
                            ]
                            self.dataShop = req.data.data || []
                            self.dataAds = self.dataAds.map(ad => {
                                return {
                                    ...ad,
                                    details: self.dataShop.map(shop => ({
                                        shop_name: shop.shop_name,
                                        is_join: 'false',  // ตั้งค่า default สำหรับ status เป็นค่าว่างหรือค่าอื่น ๆ
                                    }))
                                };
                            });
                            // console.log("🚀 ~ self.dataAds:", self.dataAds)
                            await self.initSelectTable()
                            closeLoading()
                        } catch (error) {
                            console.log("🚀 ~ init ~ error:", error)
                            closeLoading()
                        }
                    })


                }
            },
            initSelectTable() {
                const self = this
                self.$nextTick(() => {

                    console.log(self.dataAds)
                    self.dataAds.forEach((item, index) => {
                        item.details.forEach((list, Idx) => {
                            const selectorPayment = '#select_status_shop_' + index + '_' + Idx;
                            if (!$(selectorPayment).data('select2')) {
                                $(selectorPayment).select2({
                                    placeholder: "Select Status",
                                    width: '100%',
                                    minimumResultsForSearch: Infinity,
                                });
                            }
                            $(selectorPayment).on("change.custom", async function () {
                                const selectedValue = $(this).val(); // Get the selected value
                                // item.details[Idx].is_join = selectedValue ? JSON.parse(selectedValue) : '';
                                item.details[Idx].is_join = selectedValue !== null ? selectedValue : false;
                            })
                            $(selectorPayment).val(item.details[Idx].is_join).trigger('change')
                        })
                        const selectorType = '#select_type_shop_' + index;

                        $(selectorType).select2({
                            placeholder: "Select Status",
                            width: '100%',
                            minimumResultsForSearch: Infinity,
                        });
                        $(selectorType).on("change.custom", async function () {
                            const selectedValue = $(this).val() // Get the selected value
                            item.type = selectedValue;
                        })
                        $(selectorType).val(item.type).trigger('change')

                        const selectorDateStart = '#kt_datepicker_start_' + index;
                        const selectorDateEnd = '#kt_datepicker_end_' + index;

                        let startDatePicker = $(selectorDateStart).flatpickr({
                            altInput: true,
                            altFormat: "d/m/Y",
                            dateFormat: "Y-m-d",
                            altFormat: "d/m/Y",
                            altInput: true,
                            onChange: async function (selectedDates, dateStr, instance) {

                                item.start_date = instance.formatDate(selectedDates[0], "Y-m-d");

                                endDatePicker.set('minDate', selectedDates[0]);
                                // $(selectorDateEnd).set('minDate', selectedDates[0]);
                                if (item.end_date && new Date(item.end_date) < new Date(item.start_date)) {
                                    item.end_date = ""; // Reset end_date if it is less than start_date
                                }
                            }
                        });
                        let endDatePicker = $(selectorDateEnd).flatpickr({
                            altInput: true,
                            altFormat: "d/m/Y",
                            dateFormat: "Y-m-d",
                            altFormat: "d/m/Y",
                            altInput: true,
                            onChange: async function (selectedDates, dateStr, instance) {

                                item.end_date = instance.formatDate(selectedDates[0], "Y-m-d");

                            }
                        });
                    })
                })
            },
            focusNext(column, nextIndex) {
                const nextInput = this.$refs[column + '_' + nextIndex];
                if (nextInput && nextInput[0]) { // ตรวจสอบว่าถ้าเป็น array
                    nextInput[0].focus(); // เข้าถึง element จริงถ้าเป็น array
                } else if (nextInput) {
                    nextInput.focus(); // ถ้าเป็น element เดียว
                }
            },
            async addAds() {
                const self = this;
                let data = {
                    "new_ads": true,
                    "campaign_name": "",
                    "channel_id": self.value_channel_id,
                    "details": self.dataShop.map(shop => ({
                        "shop_name": shop.shop_name,
                        "is_join": 'false'
                    })) || [],
                    "start_date": "",
                    "end_date": "",
                    "type": "",
                    "remark": "",
                }
                self.dataAds.push(data)
                await self.initSelectTable()


            },
            deleteAds(index) {
                this.dataAds.splice(index, 1);
            },
            formatNumber(number) {
                if (typeof number === 'number') {
                    return number.toLocaleString(); // Format number with commas
                }
                return number; // Return as is if not a number
            },
           
            validateForm() {
                this.errors = {};
                this.errors_date = {};
                this.errors_channel = {};
                let isValid = true;

                this.dataAds.forEach((item, index) => {
                    let error = {};
                    let error_date = {};
                    let error_channel = {};

                    if (!item.campaign_name) {
                        error.campaign_name = true;
                        isValid = false;
                    }

                    if (!item.type) {
                        error.type = "กรุณาเลือก Tyype";
                        isValid = false;
                    }
                    if (!item.start_date) {
                        error.start_date = "กรุณาเลือก วันที่";
                        isValid = false;
                    }
                    if (!item.end_date) {
                        error.end_date = "กรุณาเลือก วันที่";
                        isValid = false;
                    }

                    if (!this.value_channel) {
                        error_channel.error_channel = "กรุณาเลือก Channel";
                        isValid = false;
                    }
                    // if (!this.valueDate_time) {
                    //     error_date.date = "กรุณาเลือก วันที่";
                    //     isValid = false;
                    // }

                    this.errors[index] = error;
                    // this.errors_date = error_date;
                    this.errors_channel = error_channel;
                });

                return isValid;
            },
            async savePage() {
                const self = this;
                if (self.validateForm()) {
                   showLoading();
                    let dataAds = {
                        data: self.dataAds || []
                    }
                    dataAds.data.forEach((data, index) => {
                        data.details.forEach((list, Idx) => {
                            list.is_join = (list.is_join === "true")
                        })
                        data.total_cost = Number(data.total_cost) || 0;
                        data.budget = Number(data.budget) || 0;
                        data.total_shop_income = Number(data.total_shop_income) || 0;
                        data.cost_per_purchase = Number(data.cost_per_purchase) || 0;
                        data.date = data.p_date
                    })

                    const req = await services.insertData(dataAds, self.token_header);

                    if (req.data.code !== 200) {
                        // console.log("Insert failed for data:", data);
                        Msg("บันทึกไม่สำเร็จ", 'error');
                        return;
                    } else {
                        closeLoading();
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
