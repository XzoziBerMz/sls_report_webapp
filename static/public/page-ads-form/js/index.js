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

                    // $('#select_product').html(`<option></option>`).select2({
                    //     allowInput: false,
                    //     // dropdownParent: $('#select_product').closest('.fv-row'),
                    //     data: [..._.cloneDeep(self.dataProduct) || []]
                    //         .map(item => ({ ...item, id: item.product_id, text: item.product_name })),
                    // });
                    // $('#select_product').on("change.custom", async function () {
                    //     const values = $(this).select2("data") || [];
                    //     const name = values?.[0]?.text || "";
                    //     self.product_value = name;
                    // });
                    // $('#select_status').val('active').trigger('change');

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
            addAds() {
                const self = this;
                let data = {
                    "new_ads": true,
                    "shop_name": "",
                    "name": "",
                    "product": "",
                    "total_cost": "",
                    "budget": "",
                    "total_shop_income": "",
                    "cost_per_purchase": "",
                    "purchase": "",
                    "note": "",
                    "ref_default": 1,
                    "date": self.start_date_time
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
                    const req = await services.getAds(data, self.token_header)
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

                    if (!item.name) {
                        error.name = true;
                        isValid = false;
                    }

                    if (!item.product) {
                        error.product = true;
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
                    if (!item.total_shop_income) {
                        error.total_shop_income = true;
                        isValid = false;
                    }
                    if (!item.cost_per_purchase) {
                        error.cost_per_purchase = true;
                        isValid = false;
                    }
                    // if (!item.purchase) {
                    //     error.purchase = true;
                    //     isValid = false;
                    // }
                    if (!item.status) {
                        error.status = "กรุณาเลือก สถานะ"
                        isValid = false;
                    }

                    this.errors[index] = error;
                });

                return isValid;
            },
            async savePage() {
                const self = this;
                if (self.validateForm()) {
                    const currentDate = new Date();
                    currentDate.setDate(currentDate.getDate() + 1);
                    const formattedDate = currentDate.toISOString().split('T')[0];

                    if (self.start_date_time === formattedDate) {
                        const newAds = self.dataAds.filter(item => item.new_ads);
                        const existingAds = self.dataAds.filter(item => !item.new_ads);

                        if (newAds.length) {
                            for (const ad of newAds) {
                                ad.total_cost = Number(ad.total_cost) || 0;
                                ad.budget = Number(ad.budget) || 0;
                                ad.total_shop_income = Number(ad.total_shop_income) || 0;
                                ad.cost_per_purchase = Number(ad.cost_per_purchase) || 0;
                                ad.date = formattedDate || '';
                                try {
                                    const req = await services.insertData(ad, self.token_header);
                                    if (req.data.code === 200) {
                                        console.log("Save successful for:", ad);
                                        // ดำเนินการหลังจากบันทึกสำเร็จ (เช่น แจ้งเตือน)
                                    } else {
                                        Msg("อัพเดทไม่สำเร็จ", 'error');
                                        return;
                                        // จัดการกรณีที่การบันทึกล้มเหลว
                                    }
                                } catch (error) {
                                    console.log("Error saving ad:", ad, error);
                                    // จัดการข้อผิดพลาด
                                }
                            }
                        }

                        if (existingAds.length) {
                            for (const ad of existingAds) {
                                ad.total_cost = Number(ad.total_cost) || 0;
                                ad.budget = Number(ad.budget) || 0;
                                ad.total_shop_income = Number(ad.total_shop_income) || 0;
                                ad.cost_per_purchase = Number(ad.cost_per_purchase) || 0;
                                ad.date = formattedDate || '';
                                ad.ref_default = 0;
                                try {
                                    const req = await services.updateData(ad, self.token_header);
                                    if (req.data.code === 200) {
                                        console.log("Update successful for:", ad);
                                        // ดำเนินการหลังจากอัพเดทสำเร็จ (เช่น แจ้งเตือน)
                                    } else {
                                        Msg("อัพเดทไม่สำเร็จ", 'error');
                                        return;
                                    }
                                } catch (error) {
                                    console.log("Error updating ad:", ad, error);
                                    // จัดการข้อผิดพลาด
                                }
                            }
                        }
                        console.log("Update")
                    } else {
                        let dataAds = self.dataAds || []

                        for (const data of dataAds) {
                            data.total_cost = Number(data.total_cost) || 0;
                            data.budget = Number(data.budget) || 0;
                            data.total_shop_income = Number(data.total_shop_income) || 0;
                            data.cost_per_purchase = Number(data.cost_per_purchase) || 0;
                            data.date = formattedDate || '';
                            const req = await services.insertData(data, self.token_header);

                            // ถ้าต้องการเช็คผลลัพธ์การบันทึกของแต่ละอัน
                            if (req.data.code !== 200) {
                                console.log("Insert failed for data:", data);
                                Msg("บันทึกไม่สำเร็จ", 'error');
                                return;
                            }
                        }
                    }
                   
                    closeLoading();
                    Msg("บันทึกสำเร็จ", 'success');
                    // setTimeout(function () {
                    //     window.location.reload();
                    // }, 2000);
                    
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
