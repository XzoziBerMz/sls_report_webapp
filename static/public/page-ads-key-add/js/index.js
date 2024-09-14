(function ($, window, Vue, axios) {
    'use strict';
    const token_header = getCookie('token');
    const app = Vue.createApp({
        data: function () {
            return {
                user: window.user || "",
                // currentPage: window.currentPage,
                currentPage: 'key-ads',
                authstatus: window.authstatus,
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                data_channel: [],
                token_header: token_header || '',
                form: {
                    product: "",
                    shop_name: "",
                    add_fee: "",
                    added_income: "",

                },
                dataEditStars: [
                    {
                        id: 1,
                        shop_name: "ป้าวปั้น",
                        add_fee: "",
                        added_income: "",
                        total_income: "",

                    },
                    {
                        id: 2,
                        shop_name: "คีโด789",
                        add_fee: "",
                        added_income: "",
                        total_income: "",
                    },
                    {
                        id: 3,
                        shop_name: "ฟู๊ด",
                        add_fee: "",
                        added_income: "",
                        total_income: "",
                    },
                    {
                        id: 4,
                        shop_name: "มีมง",
                        add_fee: "",
                        added_income: "",
                        total_income: "",
                    },
                    {
                        id: 5,
                        shop_name: "ลิสเติ้ล",
                        add_fee: "",
                        added_income: "",
                        total_income: "",
                    },
                    {
                        id: 6,
                        shop_name: "somchai",
                        add_fee: "",
                        added_income: "",
                        total_income: "",
                    },
                    {
                        id: 7,
                        shop_name: "TT2",
                        add_fee: "",
                        added_income: "",
                        total_income: "",
                    },
                    {
                        id: 8,
                        shop_name: "TT4",
                        add_fee: "",
                        added_income: "",
                        total_income: "",
                    },
                    {
                        id: 9,
                        shop_name: "TT5",
                        add_fee: "",
                        added_income: "",
                        total_income: "",
                    },
                    {
                        id: 10,
                        shop_name: "TT6",
                        add_fee: "",
                        added_income: "",
                        total_income: "",
                    },
                ],
                flatpickr_dp_from_date: null,
                errors: [],
                dateDefault: null
            }
        },
        computed: {
            AddFee() {
                const sum = this.dataEditStars.reduce((sum, item) => sum + parseFloat(item.add_fee || 0), 0);
                return sum.toFixed(2);
            },
            AddIncome() {
                const sum = this.dataEditStars.reduce((sum, item) => sum + parseFloat(item.added_income || 0), 0);
                return sum.toFixed(2);
            },
            AddTotal() {
                const sum = this.dataEditStars.reduce((sum, item) => sum + parseFloat(item.total_income || 0), 0);
                return sum.toFixed(2);
            },
        },
        methods: {
            async init() {
                let self = this;
            },
            formatPercentage(addFee, totalIncome) {
                if (addFee == null || totalIncome == null || isNaN(addFee) || isNaN(totalIncome) || totalIncome === 0) {
                    return '0.00%';
                }
                const percentage = (addFee / totalIncome) * 100;
                // ตรวจสอบอีกครั้งหลังจากคำนวณ
                if (isNaN(percentage) || !isFinite(percentage)) {
                    return '0.00%';
                }
                return `${percentage.toFixed(2)}%`;
            },

            async DefaultData() {
                const self = this;
                self.dataEditStars.forEach((element, index) => {

                    flatpickr("#kt_td_picker_basic_input" + index, {
                        static: true,
                        enableTime: true,
                        disableMobile: "true",
                        dateFormat: "d/m/Y",
                        onChange: function (selectedDates, dateStr, instance) {
                            self.dataEditStars[index].timestamp = instance.formatDate(selectedDates[0], "Y-m-d");
                            console.log("🚀 ~ self.dataEditStars.forEach ~ self.dataEditStars[:", self.dataEditStars)
                            delete self.errors.date;
                        },
                    });
                });

                self.dateDefault = self.formatDate(new Date());
                try {
                    let data = {}
                    const req = await services.getShop(data, self.token_header)
                    if (req.data.code === 200) {
                        self.data_channel = req.data.data
                    }
                } catch (error) {
                    console.log("🚀 ~ DefaultData ~ error:", error)
                }
            },

            addAds() {
                const self = this;
                let data = {
                    "new_data": true,
                    shop_name: "",
                    add_fee: "",
                    added_income: "",
                    total_income: "",
                }

                self.dataEditStars.push(data)
                this.$nextTick(() => {

                    self.dataEditStars.forEach((item, index) => {
                        const selectorPayment = '#select_channel_' + index;
                        if (!$(selectorPayment).data('select2')) {
                            $(selectorPayment).select2({
                                placeholder: "Select Payment Method",
                                width: '100%',
                                data: self.data_channel.map(
                                    (item) => ({ id: item.shop_name, text: item.shop_name })
                                ),
                            });
                        }
                        $(selectorPayment).on("change.custom", async function () {
                            const selectedValue = $(this).val(); // Get the selected value
                            item.shop_name = selectedValue || 10
                        })
                    })
                })

            },
            deleteAds(index) {
                this.dataEditStars.splice(index, 1);
            },
            formatDate(date) {
                const day = String(date.getDate()).padStart(2, '0');  // วัน, เติม 0 ข้างหน้าให้เป็นสองหลัก
                const month = String(date.getMonth() + 1).padStart(2, '0');  // เดือน (getMonth() ให้ค่าตั้งแต่ 0-11), เติม 0 ข้างหน้า
                const year = date.getFullYear();  // ปี

                return `${day}/${month}/${year}`;
            },


            validateFields() {
                this.errors = [];
                let isValid = true;

                this.dataEditStars.forEach((item, index) => {
                    let error = {};

                    if (!item.add_fee) {
                        error.add_fee = true;
                        isValid = false;
                    }

                    if (!item.added_income) {
                        error.added_income = true;
                        isValid = false;
                    }

                    if (!item.total_income) {
                        error.total_income = true;
                        isValid = false;
                    }

                    if (item.new_data) {
                        if (!item.shop_name) {
                            error.shop_name = "กรุณาเลือก ร้าน"
                            isValid = false;
                        }
                    }

                    this.errors[index] = error;
                });
                console.log("🚀 ~ this.dataEditStars.forEach ~ this.errors:", this.errors)

                return isValid;
            },
            getCurrentDateFormatted() {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0
                const day = String(now.getDate()).padStart(2, '0');

                return `${year}-${month}-${day}`;
            },

            async handleSubmit(event) {
                if (this.validateFields() === false) {
                    const toastElement = document.getElementById('kt_docs_toast_toggle');
                    const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
                    toast.show();
                    return
                }
                try {
                    showLoading();
                    let data = {
                        "data": this.dataEditStars
                    }
                    console.log("🚀 ~ handleSubmit ~ data:", data)
                    data.data.forEach((item, index) => {
                        delete item.id
                        item.timestamp = this.getCurrentDateFormatted()
                        item.ads_fee = parseFloat(item.add_fee);
                        item.ads_income = parseFloat(item.added_income);
                        item.ads_total_income = parseFloat(item.total_income);
                    });
                    const response = await services.getInsertAsd(data, this.token_header);
                    if (response.data.code === 200) {
                        closeLoading()

                        Msg("บันทึกสำเร็จ", 'success');
                        setTimeout(function () {
                            window.location.reload();
                        }, 2000)
                    }
                } catch (error) {
                    console.warn("Error loading data:", error);
                    closeLoading()
                }
            },

            restrictToNumbers(index, field) {
                this.dataEditStars[index][field] = this.dataEditStars[index][field].replace(/[^0-9]/g, '');
                this.validateFields()
            },
            clearError(index, field) {
                // Clear the error for the specified field
                console.log("🚀 ~ clearError ~ this.errors:", this.errors)
                this.errors[index][field] = null;

            },
            // restrictToNumbers(index, field) {
            //     // อนุญาตให้กรอกตัวเลขและจุดทศนิยม โดยจะยอมให้มีเพียงจุดเดียว
            //     this.dataEditStars[index][field] = this.dataEditStars[index][field].replace(/[^0-9.]/g, '');
            
            //     // แบ่งข้อมูลตามจุดทศนิยม
            //     let parts = this.dataEditStars[index][field].split('.');
                
            //     // จัดรูปแบบส่วนที่เป็นจำนวนเต็มให้มีคอมม่า (1,000,000)
            //     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            
            //     // ถ้ามีจุดทศนิยม ให้จำกัดตัวเลขหลังจุดทศนิยมไม่เกิน 2 ตำแหน่ง
            //     if (parts.length > 1) {
            //         parts[1] = parts[1].substring(0, 2); // จำกัดให้มีทศนิยม 2 ตำแหน่ง
            //     }
            
            //     // รวมส่วนจำนวนเต็มกับทศนิยมกลับเข้าไป
            //     this.dataEditStars[index][field] = parts.join('.');
            
            //     // เรียกใช้ฟังก์ชัน validateFields
            //     this.validateFields();
            // },
            

            handleInput(index, field) {
                if (this.errors[index]) {
                    this.errors[index][field] = ''; // Clear the error for the specific item and field
                }
            },
            handleInputN(index, field) {

                let value = this.dataEditStars[index][field];

                // Clear the general error (optional)
                if (this.errors[field]) {
                    this.errors[field] = '';
                }

                // Regex to validate numeric or percentage input
                const regex = /^[0-9]*\.?[0-9]*%?$/;

                // If the value doesn't match the regex, slice off the last character
                if (!regex.test(value)) {
                    this.dataEditStars[index][field] = value.slice(0, -1);
                }
            },

        },




        mounted: function () {
            let self = this;
            // self.loadData();
            self.DefaultData();
            console.log("ok");
        }
    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
