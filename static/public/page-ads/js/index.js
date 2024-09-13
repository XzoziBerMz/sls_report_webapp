(function ($, window, Vue, axios) {
    'use strict';

    const token_header = getCookie('token');

    const app = Vue.createApp({
        data: function () {
            return {
                ...window.webUtils.data || {},
                user: window.user || "",
                // currentPage: window.currentPage,
                authstatus: window.authstatus,
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                currentDate: '',
                currentPage: 'ads',
                token_header: token_header || '',
                data_ads: [],
                data_ads_cost: [],
                dataEddit: {},

                currentPages: 1,
                itemsPerPage: 10,
                totalItems: 0,
                column_order_by: "date",
                order_sort: "desc",

                currentCostPages: 1,
                itemsCostPerPage: 10,
                totalCostItems: 0,
                column_cost_order_by: "p_timestamp",
                cost_order_sort: "desc",
            }
        },
        computed: {
            totalPages() {
                return Math.ceil(this.totalItems / this.itemsPerPage);
            },
            totalCostPages() {
                return Math.ceil(this.totalCostItems / this.itemsCostPerPage);
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
            pagesCost() {
                const pages = [];
                const maxPages = 5;
                const startPage = Math.max(1, this.currentCostPages - Math.floor(maxPages / 2));
                const endPage = Math.min(this.totalPages, startPage + maxPages - 1);

                for (let page = startPage; page <= endPage; page++) {
                    pages.push(page);
                }

                return pages;
            },
            AdsFee() {
                return this.data_ads_cost.reduce((sum, item) => sum + parseFloat(item.ads_fee || 0), 0);
            },
            AdsIncome() {
                return this.data_ads_cost.reduce((sum, item) => sum + parseFloat(item.ads_income || 0), 0);
            },
            totalAdsIncome() {
                return this.data_ads_cost.reduce((sum, item) => sum + parseFloat(item.ads_total_income || 0), 0);
            },

        },
        methods: {
            ...window.webUtils.method || {},
            async init() {
                let self = this

                try {
                    await self.getAds();
                    await self.getAdsCost();
                } catch (error) {
                    console.log("🚀 ~ init ~ error:", error)
                } finally {
                    $('#page_size_select').on("change.custom", async function () {
                        const selectedValue = $(this).val(); // Get the selected value
                        self.itemsPerPage = selectedValue || 10
                        await self.getAds();
                    })
                    $('#page_size_cost_select').on("change.custom", async function () {
                        const selectedValue = $(this).val(); // Get the selected value
                        self.itemsCostPerPage = selectedValue || 10
                        await self.getAdsCost();
                    })
                }
            },
            
            formatDate(date) {
                const options = { day: '2-digit', month: 'short', year: 'numeric' };
                return date.toLocaleDateString('en-US', options);
            },
            changePage(page) {
                if (page < 1 || page > this.totalPages) return;
                this.currentPages = page;
                this.getAds();
            },
            changeCostPage(page) {
                if (page < 1 || page > this.totalCostPages) return;
                this.currentCostPages = page;
                this.getAdsCost();
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
                await this.getAds();
            },
            getSortIcon(column) {
                const self = this;
                if (self.column_order_by !== column) {
                    return "bi-chevron-down";  // Default down icon
                }
                return self.order_sort === "asc" ? "bi-chevron-up" : "bi-chevron-down";
            },
            async sortCostTable(column) {
                if (this.column_cost_order_by === column) {
                    // สลับทิศทางการเรียงลำดับ
                    this.cost_order_sort = this.cost_order_sort === 'asc' ? 'desc' : 'asc';
                } else {
                    // กำหนดคอลัมน์ใหม่และตั้งค่าเรียงลำดับเป็น 'asc'
                    this.column_cost_order_by = column;
                    this.cost_order_sort = 'asc';
                }
                // เรียกฟังก์ชันเพื่อดึงข้อมูลหรืออัปเดตตาราง
                await this.getAdsCost();
            },
            getCostSortIcon(column) {
                const self = this;
                if (self.column_cost_order_by !== column) {
                    return "bi-chevron-down";  // Default down icon
                }
                return self.cost_order_sort === "asc" ? "bi-chevron-up" : "bi-chevron-down";
            },

            editAds(data) {
                const self = this;
                $('#kt_modal_1').modal('show');
                self.dataEddit = { ...data} || [];
                $('#status-select').val(self.dataEddit.status).trigger('change')
                self.date_time = $("#kt_datepicker_1").flatpickr({
                    dateFormat: "Y-m-d",
                    altFormat: "d/m/Y",
                    altInput: true,
                    onChange: function (selectedDates, dateStr, instance) {
                        self.dataEddit.date = instance.formatDate(selectedDates[0], "Y-m-d"); // Update date in form data
                    },
                });
                self.date_time.setDate(self.dataEddit.date);
            },
            async updateData() {
                const self = this;
              
                try {
                    showLoading();
                    let data = self.dataEddit
                    data.budget = parseFloat(data.budget);
                    data.cost_per_purchase = parseFloat(data.cost_per_purchase);
                    data.total_shop_income = parseFloat(data.total_shop_income);
                    data.total_cost = parseFloat(data.total_cost);
                    const response = await services.updateData(data, self.token_header);

                    if (response.data.code === 200) {
                        await self.getAds();
                        $('#kt_modal_1').modal('hide');
                    }
                } catch (error) {
                    closeLoading();
                    console.log("🚀 ~ updateData ~ error:", error)
                }
            },
            getAds: async function () {
                const self = this;
                try {
                    showLoading();
                    let data = {
                        "search": "",
                        // "ref_default": 1,
                        "page": self.currentPages,
                        "per_page": parseInt(self.itemsPerPage) || 10,
                        "order": self.column_order_by,
                        "order_by": self.order_sort
                    }
                    const response = await services.getAdsApi(data, self.token_header)
                    if (response.data.code === 200) {
                        self.data_ads = response.data.data || [];
                        self.totalItems = response.data.total;
                        console.log(response.data.data)
                        closeLoading();

                    }

                } catch (err) {
                    closeLoading();
                    Msg("errorMsg", 'error');

                } finally {

                }
            },
            getAdsCost: async function () {
                const self = this;
                try {
                    showLoading();
                    let data = {
                        "search": "",
                        // "ref_default": 1,
                        "page": self.currentCostPages,
                        "per_page": parseInt(self.itemsCostPerPage) || 10,
                        "order": self.column_cost_order_by,
                        "order_by": self.cost_order_sort
                    }
                    const response = await services.getAdsCost(data, self.token_header)
                    if (response.data.code === 200) {
                        self.data_ads_cost = response.data.data || [];
                        self.totalCostItems = response.data.total;
                        console.log(response.data.data)
                        closeLoading();

                    }

                } catch (err) {
                    closeLoading();
                    Msg("errorMsg", 'error');

                } finally {

                }
            }

        },
        watch: {
            "dataEddit.total_cost"(newValue) {
                let formattedValue = `${newValue}`.replace(/[^0-9.]/g, "");
                const decimalParts = formattedValue.split('.');
                if (decimalParts.length > 2) {
                    formattedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
                }
                this.dataEddit.total_cost = formattedValue;
            },
            "dataEddit.budget"(newValue) {
                let formattedValue = `${newValue}`.replace(/[^0-9.]/g, "");
                const decimalParts = formattedValue.split('.');
                if (decimalParts.length > 2) {
                    formattedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
                }
                this.dataEddit.budget = formattedValue;
            },
            "dataEddit.total_shop_income"(newValue) {
                let formattedValue = `${newValue}`.replace(/[^0-9.]/g, "");
                const decimalParts = formattedValue.split('.');
                if (decimalParts.length > 2) {
                    formattedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
                }
                this.dataEddit.total_shop_income = formattedValue;
            },
            "dataEddit.cost_per_purchase"(newValue) {
                let formattedValue = `${newValue}`.replace(/[^0-9.]/g, "");
                const decimalParts = formattedValue.split('.');
                if (decimalParts.length > 2) {
                    formattedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
                }
                this.dataEddit.cost_per_purchase = formattedValue;
            },
        },
        mounted: async function () {
            let self = this
            this.currentDate = this.formatDate(new Date());
            //    self.getPokemon()
            await self.init()
            console.log("ok")
        }


    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
