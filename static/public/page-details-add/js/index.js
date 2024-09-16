(function ($, window, Vue, axios) {
    'use strict';


    const token_header = getCookie('token');
    const app = Vue.createApp({
        data: function () {
            return {
                ...window.webUtils.data || {},
                user: window.user || "",
                currentPage: 'details-add',
                authstatus: window.authstatus,
                token_header: token_header || '',
                datas: [],
                inventoryDetail: [],
                search: "",
                serach_value: "",
                filtered: [],
                dataDataAdd: [],
                itemsPerPage: 10,
                totalItems: 0,
                currentPages: 1,
                column_order_by: "p_timestamp",
                order_sort: "desc",

            }
        },
        computed: {
            totalPages() {
                return Math.ceil(this.totalItems / this.itemsPerPage);
            },
            pages() {
                const pages = [];
                const maxPages = 5;
                const startPage = Math.max(1, this.currentPages - Math.floor(maxPages / 2));
                const endPage = Math.min(this.totalPages, startPage + maxPages - 1);

                for (let page = startPage; page <= endPage; page++) {
                    pages.push(page);
                }
                return pages;
            },

            AdsFee() {
                return this.dataDataAdd.reduce((sum, item) => sum + parseFloat(item.ads_fee || 0), 0);
            },

            AdsIncome() {
                return this.dataDataAdd.reduce((sum, item) => sum + parseFloat(item.ads_income || 0), 0);
            },
            totalAdsIncome() {
                return this.dataDataAdd.reduce((sum, item) => sum + parseFloat(item.ads_total_income || 0), 0);
            },


        },
        methods: {
            ...window.webUtils.method || {},
            async init() {
                let self = this

                $('#page_size_add').on("change.custom", async function () {
                    const selectedValue = $(this).val(); // Get the selected value
                    self.itemsPerPage = selectedValue || 10
                    await self.loadDataAdd();
                })

                self.flatpickr_dp_from_date = $("#kt_td_picker_start_input").flatpickr({
                    static: true,
                    enableTime: false,
                    disableMobile: "true",
                    dateFormat: "Y-m-d",
                    altFormat: "d/m/Y",
                    altInput: true,
                    maxDate: 'today',
                    onChange: async function (selectedDates, dateStr, instance) {
                        if (selectedDates.length) {
                            const selectedDate = selectedDates[0];

                            // Format the date to YYYY-MM-DD in local time zone
                            const year = selectedDate.getFullYear();
                            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                            const day = String(selectedDate.getDate()).padStart(2, '0');

                            self.startDate = `${year}-${month}-${day}`;
                            console.log("🚀 ~ self.startDate:", self.startDate);
                            self.startDate_status = true;

                            // Set minDate for the end date picker to prevent selecting earlier dates
                            self.flatpickr_dp_end_date.set("minDate", self.startDate);

                            await self.loadDataAdd();
                        }
                    },
                });

                self.flatpickr_dp_end_date = $("#kt_td_picker_end_input").flatpickr({
                    static: true,
                    enableTime: false,
                    disableMobile: "true",
                    dateFormat: "Y-m-d",
                    altFormat: "d/m/Y",
                    altInput: true,
                    maxDate: 'today',
                    onChange: async function (selectedDates, dateStr, instance) {
                        if (selectedDates.length) {
                            const selectedDate = selectedDates[0];

                            // Format the date to YYYY-MM-DD in local time zone
                            const year = selectedDate.getFullYear();
                            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                            const day = String(selectedDate.getDate()).padStart(2, '0');

                            self.endDate = `${year}-${month}-${day}`;
                            console.log("🚀 ~ self.endDate:", self.endDate);
                            self.endDate_status = true;

                            await self.loadDataAdd();
                        }
                    },
                });

            },
            changePage(page) {
                if (page < 1 || page > this.totalPages) return;
                this.currentPages = page;
                this.loadDataAdd();
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
            async sortTable(column) {
                if (this.column_order_by === column) {
                    // สลับทิศทางการเรียงลำดับ
                    this.order_sort = this.order_sort === 'asc' ? 'desc' : 'asc';
                } else {
                    // กำหนดคอลัมน์ใหม่และตั้งค่าเรียงลำดับเป็น 'asc'
                    this.column_order_by = column;
                    this.order_sort = 'asc';
                }
                // เรียกฟังก์ชันเพื่อดึงข้อมูลหรืออัปเดตตาราง
                await this.loadDataAdd();
            },
            getSortIcon(column) {
                const self = this;
                if (self.column_order_by !== column) {
                    return "bi-chevron-down";  // Default down icon
                }
                return self.order_sort === "asc" ? "bi-chevron-up" : "bi-chevron-down";
            },

            searchData(event) {
                this.isEnterPressed = true;
                this.loadDataAdd();
                event.target.blur();
            },
            handleBlur() {
                if (!this.isEnterPressed) {
                    this.loadDataAdd();
                }
                this.isEnterPressed = false;
            },

            async loadDataAdd() {
                const self = this;
                try {
                    showLoading();
                    let data = {
                        "start_at": self.startDate,
                        "end_at": self.endDate,
                        "search": self.serach_value,
                        "page": self.currentPages,
                        "per_page": parseInt(self.itemsPerPage || 10),
                        "order": self.column_order_by,
                        "order_by": self.order_sort
                    }
                    let responseGetAdd = await services.getAdsCost(data, self.token_header);
                    const dataAdd = responseGetAdd?.data.data || [];
                    self.dataDataAdd = dataAdd
                    self.totalItems = responseGetAdd.data.total;
                    closeLoading()

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                    closeLoading()
                }
            },

            formatNumber(number) {
                if (typeof number === 'number') {
                    return number.toLocaleString(); // Format number with commas
                }
                return number; // Return as is if not a number
            },
            formatPercentage(fee, totalIncome) {
                if (totalIncome === 0) return '0.00%';
                const percentage = (fee / totalIncome) * 100;
                return percentage.toFixed(2) + '%';
            },


        },
        watch: {
            itemsPerPage: {
                deep: true,
                async handler(newValue) {
                    console.log("🚀 ~ handler ~ newValue:", newValue)
                    this.currentPages = 1

                    await this.loadDataOrder();
                }
            }
        },
        mounted: function () {
            let self = this
            self.init()
            //    self.getPokemon()
            self.loadDataAdd()
            console.log("ok")
        }


    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
