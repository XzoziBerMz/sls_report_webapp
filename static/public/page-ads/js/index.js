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
                data_tiktok_live: [],
                data_facebook: [],
                dataEddit: {},

                modal_titles: "",
                modal_session: "",

                data_ads_tt: [],
                data_cost_shop: [],
                data_shop_tt: [],
                data_ads_fb: [],

                startDate: null,
                endDate: null,
                startDate_status: false,
                endDate_status: false,

                currentPages: 1,
                itemsPerPage: 10,
                totalItems: 0,
                column_order_by: "p_date",
                order_sort: "desc",
                filter_ads_tt: [],

                currentCostPages: 1,
                itemsCostPerPage: 10,
                totalCostItems: 0,
                column_cost_order_by: "p_date",
                cost_order_sort: "desc",
                filter_cost_shop: [],

                currentTiktokPages: 1,
                itemsTiktokPerPage: 10,
                totalTiktokItems: 0,
                column_tiktok_order_by: "p_timestamp",
                tiktok_order_sort: "desc",
                filter_shop_tt: [],

                currentFacebookPages: 1,
                itemsFacebookPerPage: 10,
                totalFacebookItems: 0,
                column_facebook_order_by: "p_date",
                facebook_order_sort: "desc",
                filter_ads_fb: [],
            }
        },
        computed: {
            totalPages() {
                return Math.ceil(this.totalItems / this.itemsPerPage);
            },
            totalCostPages() {
                return Math.ceil(this.totalCostItems / this.itemsCostPerPage);
            },
            totalTiktokPages() {
                return Math.ceil(this.totalTiktokItems / this.itemsTiktokPerPage);
            },
            totalFacebookPages() {
                return Math.ceil(this.totalFacebookItems / this.itemsFacebookPerPage);
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
                const endPage = Math.min(this.totalCostPages, startPage + maxPages - 1);

                for (let page = startPage; page <= endPage; page++) {
                    pages.push(page);
                }

                return pages;
            },
            pagesTiktok() {
                const pages = [];
                const maxPages = 5;
                const startPage = Math.max(1, this.currentTiktokPages - Math.floor(maxPages / 2));
                const endPage = Math.min(this.totalTiktokPages, startPage + maxPages - 1);

                for (let page = startPage; page <= endPage; page++) {
                    pages.push(page);
                }

                return pages;
            },
            pagesFacebook() {
                const pages = [];
                const maxPages = 5;
                const startPage = Math.max(1, this.currentFacebookPages - Math.floor(maxPages / 2));
                const endPage = Math.min(this.totalFacebookPages, startPage + maxPages - 1);

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
            TTTotal() {
                return this.data_ads.reduce((sum, item) => sum + parseFloat(item.total_cost || 0), 0);
            },
            TTBudget() {
                return this.data_ads.reduce((sum, item) => sum + parseFloat(item.budget || 0), 0);
            },
            TTTotal_Incom() {
                return this.data_ads.reduce((sum, item) => sum + parseFloat(item.total_shop_income || 0), 0);
            },
            TTCost_Per() {
                return this.data_ads.reduce((sum, item) => sum + parseFloat(item.cost_per_purchase || 0), 0);
            },
            LiveTotal() {
                return this.data_tiktok_live.reduce((sum, item) => sum + parseFloat(item.total_cost || 0), 0);
            },
            LiveIncome() {
                return this.data_tiktok_live.reduce((sum, item) => sum + parseFloat(item.total_income || 0), 0);
            },
            FbTotal() {
                return this.data_facebook.reduce((sum, item) => sum + parseFloat(item.total_cost || 0), 0);
            },
            FbBudget() {
                return this.data_facebook.reduce((sum, item) => sum + parseFloat(item.budget || 0), 0);
            },
            FbTotal_Incom() {
                return this.data_facebook.reduce((sum, item) => sum + parseFloat(item.total_shop_income || 0), 0);
            },
            FbCost_Per() {
                return this.data_facebook.reduce((sum, item) => sum + parseFloat(item.cost_per_purchase || 0), 0);
            },
            tiktokStartItem() {
                return (this.currentPages - 1) * this.itemsPerPage + 1;
            },
            tiktokEndItem() {
                const end = this.currentPages * this.itemsPerPage;
                return end > this.totalItems ? this.totalItems : end;
            },
            costStartItem() {
                return (this.currentCostPages - 1) * this.itemsCostPerPage + 1;
            },
            costEndItem() {
                const end = this.currentCostPages * this.itemsCostPerPage;
                return end > this.totalCostItems ? this.totalCostItems : end;
            },
            liveStartItem() {
                return (this.currentTiktokPages - 1) * this.itemsTiktokPerPage + 1;
            },
            liveEndItem() {
                const end = this.currentTiktokPages * this.itemsTiktokPerPage;
                return end > this.totalTiktokItems ? this.totalTiktokItems : end;
            },
            fbStartItem() {
                return (this.currentFacebookPages - 1) * this.itemsFacebookPerPage + 1;
            },
            fbEndItem() {
                const end = this.currentFacebookPages * this.itemsFacebookPerPage;
                return end > this.totalFacebookItems ? this.totalFacebookItems : end;
            },

        },
        methods: {
            ...window.webUtils.method || {},
            async init() {
                let self = this

                try {
                    await self.getAds();
                    await self.getAdsCost();
                    await self.getTiktok();
                    await self.getFacebook();
                } catch (error) {
                    console.log("🚀 ~ init ~ error:", error)
                } finally {
                    $('#page_size_select').on("change.custom", async function () {
                        const selectedValue = $(this).val(); // Get the selected value
                        self.itemsPerPage = selectedValue || 10
                        self.currentPages = 1
                        await self.getAds();
                    })
                    $('#page_size_cost_select').on("change.custom", async function () {
                        const selectedValue = $(this).val(); // Get the selected value
                        self.itemsCostPerPage = selectedValue || 10
                        self.currentCostPages = 1
                        await self.getAdsCost();
                    })
                    $('#page_size_live_select').on("change.custom", async function () {
                        const selectedValue = $(this).val(); // Get the selected value
                        self.itemsTiktokPerPage = selectedValue || 10
                        self.currentTiktokPages = 1
                        await self.getTiktok();
                    })
                    $('#page_size_facebook_select').on("change.custom", async function () {
                        const selectedValue = $(this).val(); // Get the selected value
                        self.itemsFacebookPerPage = selectedValue || 10
                        self.currentFacebookPages = 1
                        await self.getFacebook();
                    })

                    self.flatpickr_dp_from_date = $("#kt_td_picker_start_input").flatpickr({
                        static: true,
                        enableTime: false,
                        disableMobile: "true",
                        dateFormat: "Y-m-d",
                        altFormat: "d/m/Y",
                        altInput: true,
                        maxDate: "today",
                        onChange: async function (selectedDates, dateStr, instance) {
                            if (selectedDates.length) {
                                const selectedDate = selectedDates[0];

                                // Format the date to YYYY-MM-DD in local time zone
                                const year = selectedDate.getFullYear();
                                const month = String(selectedDate.getMonth() + 1).padStart(
                                    2,
                                    "0"
                                );
                                const day = String(selectedDate.getDate()).padStart(2, "0");

                                self.startDate = `${year}-${month}-${day}`;
                                self.startDate_status = true;

                                // Set minDate for the end date picker to prevent selecting earlier dates
                                self.flatpickr_dp_end_date.set("minDate", self.startDate);
                                if (
                                    self.endDate &&
                                    new Date(self.startDate) > new Date(self.endDate)
                                ) {
                                    // Reset the input field for end date and clear the value
                                    self.flatpickr_dp_end_date.clear();
                                    self.endDate = ""; // Reset the variable holding end date
                                }

                                await self.DefaultData();
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
                        maxDate: "today",
                        onChange: async function (selectedDates, dateStr, instance) {
                            if (selectedDates.length) {
                                const selectedDate = selectedDates[0];

                                // Format the date to YYYY-MM-DD in local time zone
                                const year = selectedDate.getFullYear();
                                const month = String(selectedDate.getMonth() + 1).padStart(
                                    2,
                                    "0"
                                );
                                const day = String(selectedDate.getDate()).padStart(2, "0");

                                self.endDate = `${year}-${month}-${day}`;
                                self.endDate_status = true;

                                await self.DefaultData();
                            }
                        },
                    });

                    let currentDateStart = self.startDate ? new Date(self.startDate) : new Date();
                    currentDateStart.setDate(currentDateStart.getDate() - 1); // ย้อนวันที่ 1 วัน

                    let formattedDatestart = currentDateStart.toISOString().slice(0, 10); // ฟอร์แมต YYYY-MM-DD
                    let formattedStartDate = `${formattedDatestart} 00:00:00`;

                    // ถ้า endDate ไม่มีค่า ใช้วันที่ปัจจุบัน
                    let currentDateEnd = self.endDate ? new Date(self.endDate) : new Date();
                    currentDateEnd.setDate(currentDateEnd.getDate() - 1); // ย้อนวันที่ 1 วัน
                    let formattedDateend = currentDateEnd.toISOString().slice(0, 10); // ฟอร์แมต YYYY-MM-DD
                    let formattedEndDate = `${formattedDateend} 23:59:59`;

                    // const currentDate = new Date();
                    // currentDate.setDate(currentDate.getDate() - 1);
                    // const formattedDate = currentDate
                    //     .toISOString()
                    //     .slice(0, 10)
                    //     .replace("T", " ");
                    self.startDate = formattedStartDate;
                    self.endDate = formattedEndDate;
                }
            },
            async DefaultData() {
                const self = this;
                await self.getAds();
                await self.getAdsCost();
                await self.getTiktok();
                await self.getFacebook();
            },
            formatNumber(number) {
                if (isNaN(number) || !isFinite(number)) {
                    return "0"; // แสดงค่าเป็น 0
                }
                if (typeof number === 'number') {
                    return number.toLocaleString(); // จัดรูปแบบตัวเลขให้มีคอมม่า
                }
                return number; // Return as is if not a number
            },
            formatPercentage(fee, totalIncome) {
                if (totalIncome === 0) return '0.00%';
                const percentage = (fee / totalIncome) * 100;
                return percentage.toFixed(2) + '%';
            },
            formatDate(date) {
                const d = new Date(date);
                const day = String(d.getDate()).padStart(2, "0");

                const englishMonthsAbbrev = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ];

                const month = englishMonthsAbbrev[d.getMonth()];
                const year = d.getFullYear();

                return `${day} ${month} ${year}`;
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
            changeTiktokPage(page) {
                if (page < 1 || page > this.totalTiktokPages) return;
                this.currentTiktokPages = page;
                this.getTiktok();
            },
            changeFacebookPage(page) {
                if (page < 1 || page > this.totalFacebookPages) return;
                this.currentFacebookPages = page;
                this.getFacebook();
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
            async sortTiktokTable(column) {
                if (this.column_tiktok_order_by === column) {
                    // สลับทิศทางการเรียงลำดับ
                    this.tiktok_order_sort = this.tiktok_order_sort === 'asc' ? 'desc' : 'asc';
                } else {
                    // กำหนดคอลัมน์ใหม่และตั้งค่าเรียงลำดับเป็น 'asc'
                    this.column_tiktok_order_by = column;
                    this.tiktok_order_sort = 'asc';
                }
                // เรียกฟังก์ชันเพื่อดึงข้อมูลหรืออัปเดตตาราง
                await this.getTiktok();
            },
            getTiktokSortIcon(column) {
                const self = this;
                if (self.column_tiktok_order_by !== column) {
                    return "bi-chevron-down";  // Default down icon
                }
                return self.tiktok_order_sort === "asc" ? "bi-chevron-up" : "bi-chevron-down";
            },
            async sortFacebookTable(column) {
                if (this.column_facebook_order_by === column) {
                    // สลับทิศทางการเรียงลำดับ
                    this.facebook_order_sort = this.facebook_order_sort === 'asc' ? 'desc' : 'asc';
                } else {
                    // กำหนดคอลัมน์ใหม่และตั้งค่าเรียงลำดับเป็น 'asc'
                    this.column_facebook_order_by = column;
                    this.facebook_order_sort = 'asc';
                }
                // เรียกฟังก์ชันเพื่อดึงข้อมูลหรืออัปเดตตาราง
                await this.getFacebook();
            },
            getFacebookSortIcon(column) {
                const self = this;
                if (self.column_facebook_order_by !== column) {
                    return "bi-chevron-down";  // Default down icon
                }
                return self.facebook_order_sort === "asc" ? "bi-chevron-up" : "bi-chevron-down";
            },

            editAds(data) {
                const self = this;
                $('#kt_modal_1').modal('show');
                self.dataEddit = { ...data } || [];
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
            getAds: async function () {
                const self = this;
                try {
                    showLoading();
                    let formattedStartDate = null;
                    let formattedEndDate = null;

                    if (self.startDate_status === false) {
                        let currentDateStart = self.startDate ? new Date(self.startDate) : new Date();
                        currentDateStart.setDate(currentDateStart.getDate() - 1); // ย้อนวันที่ 1 วัน

                        let formattedDatestart = currentDateStart.toISOString().slice(0, 10); // ฟอร์แมต YYYY-MM-DD
                        formattedStartDate = `${formattedDatestart} 00:00:00`;

                        // ถ้า endDate ไม่มีค่า ใช้วันที่ปัจจุบัน
                        let currentDateEnd = self.endDate ? new Date(self.endDate) : new Date();
                        currentDateEnd.setDate(currentDateEnd.getDate() - 1); // ย้อนวันที่ 1 วัน
                        let formattedDateend = currentDateEnd.toISOString().slice(0, 10); // ฟอร์แมต YYYY-MM-DD
                        formattedEndDate = `${formattedDateend} 23:59:59`;
                    } else {
                        let currentDateStart = self.startDate ? new Date(self.startDate) : new Date();
                        let formattedDatestart = currentDateStart.toISOString().slice(0, 10); // ฟอร์แมต YYYY-MM-DD
                        formattedStartDate = `${formattedDatestart} 00:00:00`;

                        let currentDateEnd = self.endDate ? new Date(self.endDate) : new Date();
                        let formattedDateend = currentDateEnd.toISOString().slice(0, 10); // ฟอร์แมต YYYY-MM-DD
                        formattedEndDate = `${formattedDateend} 23:59:59`;
                    }

                    const statusName = self.filter_ads_tt.length > 0 ? self.filter_ads_tt[0].name : null;

                    let data = {
                        "search": "",
                        "start_at": formattedStartDate || self.startDate,
                        "end_at": formattedEndDate || self.endDate,
                        "status": statusName || "",
                        "page": self.currentPages,
                        "per_page": parseInt(self.itemsPerPage) || 10,
                        "order": self.column_order_by,
                        "order_by": self.order_sort
                    }

                    const response = await services.getAdsApi(data, self.token_header);

                    if (response.data.code === 200) {
                        self.data_ads = response.data.data || [];
                        self.totalItems = response.data.total;
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
                    let formattedStartDate = null;
                    let formattedEndDate = null;

                    if (self.startDate_status === false) {
                        let currentDateStart = self.startDate ? new Date(self.startDate) : new Date();
                        currentDateStart.setDate(currentDateStart.getDate() - 1); // ย้อนวันที่ 1 วัน

                        let formattedDatestart = currentDateStart.toISOString().slice(0, 10); // ฟอร์แมต YYYY-MM-DD
                        formattedStartDate = `${formattedDatestart} 00:00:00`;

                        // ถ้า endDate ไม่มีค่า ใช้วันที่ปัจจุบัน
                        let currentDateEnd = self.endDate ? new Date(self.endDate) : new Date();
                        currentDateEnd.setDate(currentDateEnd.getDate() - 1); // ย้อนวันที่ 1 วัน
                        let formattedDateend = currentDateEnd.toISOString().slice(0, 10); // ฟอร์แมต YYYY-MM-DD
                        formattedEndDate = `${formattedDateend} 23:59:59`;
                    } else {
                        let currentDateStart = self.startDate ? new Date(self.startDate) : new Date();
                        let formattedDatestart = currentDateStart.toISOString().slice(0, 10); // ฟอร์แมต YYYY-MM-DD
                        formattedStartDate = `${formattedDatestart} 00:00:00`;

                        let currentDateEnd = self.endDate ? new Date(self.endDate) : new Date();
                        let formattedDateend = currentDateEnd.toISOString().slice(0, 10); // ฟอร์แมต YYYY-MM-DD
                        formattedEndDate = `${formattedDateend} 23:59:59`;
                    }

                    const productNames = self.filter_cost_shop.map((item) => item.name);
                    let data = {
                        "search": "",
                        // "ref_default": 1,
                        "shops": productNames || [],
                        "start_at": formattedStartDate || self.startDate,
                        "end_at": formattedEndDate || self.endDate,
                        "page": self.currentCostPages,
                        "per_page": parseInt(self.itemsCostPerPage) || 10,
                        "order": self.column_cost_order_by,
                        "order_by": self.cost_order_sort
                    }
                    const response = await services.getAdsCost(data, self.token_header)
                    if (response.data.code === 200) {
                        self.data_ads_cost = response.data.data || [];
                        self.totalCostItems = response.data.total;
                        // console.log(response.data.data)
                        closeLoading();

                    }

                } catch (err) {
                    closeLoading();
                    Msg("errorMsg", 'error');

                } finally {

                }
            },
            getTiktok: async function () {
                const self = this;
                try {
                    showLoading();
                    let formattedStartDate = null;
                    let formattedEndDate = null;

                    if (self.startDate_status === false) {
                        let currentDateStart = self.startDate ? new Date(self.startDate) : new Date();
                        currentDateStart.setDate(currentDateStart.getDate() - 1); // ย้อนวันที่ 1 วัน

                        let formattedDatestart = currentDateStart.toISOString().slice(0, 10); // ฟอร์แมต YYYY-MM-DD
                        formattedStartDate = `${formattedDatestart} 00:00:00`;

                        // ถ้า endDate ไม่มีค่า ใช้วันที่ปัจจุบัน
                        let currentDateEnd = self.endDate ? new Date(self.endDate) : new Date();
                        currentDateEnd.setDate(currentDateEnd.getDate() - 1); // ย้อนวันที่ 1 วัน
                        let formattedDateend = currentDateEnd.toISOString().slice(0, 10); // ฟอร์แมต YYYY-MM-DD
                        formattedEndDate = `${formattedDateend} 23:59:59`;
                    } else {
                        let currentDateStart = self.startDate ? new Date(self.startDate) : new Date();
                        let formattedDatestart = currentDateStart.toISOString().slice(0, 10); // ฟอร์แมต YYYY-MM-DD
                        formattedStartDate = `${formattedDatestart} 00:00:00`;

                        let currentDateEnd = self.endDate ? new Date(self.endDate) : new Date();
                        let formattedDateend = currentDateEnd.toISOString().slice(0, 10); // ฟอร์แมต YYYY-MM-DD
                        formattedEndDate = `${formattedDateend} 23:59:59`;
                    }

                    const productNames = self.filter_shop_tt.map((item) => item.name);
                    let data = {
                        "search": "",
                        // "ref_default": 1,
                        "shops": productNames || [],
                        "start_at": formattedStartDate || self.startDate,
                        "end_at": formattedEndDate || self.endDate,
                        "page": self.currentTiktokPages,
                        "per_page": parseInt(self.itemsTiktokPerPage) || 10,
                        "order": self.column_tiktok_order_by,
                        "order_by": self.tiktok_order_sort
                    }
                    const response = await services.getTiktokLive(data, self.token_header)
                    if (response.data.code === 200) {
                        self.data_tiktok_live = response.data.data || [];
                        self.totalTiktokItems = response.data.total;
                        // console.log(response.data.data)
                        closeLoading();

                    }

                } catch (err) {
                    closeLoading();
                    Msg("errorMsg", 'error');

                } finally {

                }
            },
            getFacebook: async function () {
                const self = this;
                try {
                    showLoading();
                    let formattedStartDate = null;
                    let formattedEndDate = null;

                    if (self.startDate_status === false) {
                        let currentDateStart = self.startDate ? new Date(self.startDate) : new Date();
                        currentDateStart.setDate(currentDateStart.getDate() - 1); // ย้อนวันที่ 1 วัน

                        let formattedDatestart = currentDateStart.toISOString().slice(0, 10); // ฟอร์แมต YYYY-MM-DD
                        formattedStartDate = `${formattedDatestart} 00:00:00`;

                        // ถ้า endDate ไม่มีค่า ใช้วันที่ปัจจุบัน
                        let currentDateEnd = self.endDate ? new Date(self.endDate) : new Date();
                        currentDateEnd.setDate(currentDateEnd.getDate() - 1); // ย้อนวันที่ 1 วัน
                        let formattedDateend = currentDateEnd.toISOString().slice(0, 10); // ฟอร์แมต YYYY-MM-DD
                        formattedEndDate = `${formattedDateend} 23:59:59`;
                    } else {
                        let currentDateStart = self.startDate ? new Date(self.startDate) : new Date();
                        let formattedDatestart = currentDateStart.toISOString().slice(0, 10); // ฟอร์แมต YYYY-MM-DD
                        formattedStartDate = `${formattedDatestart} 00:00:00`;

                        let currentDateEnd = self.endDate ? new Date(self.endDate) : new Date();
                        let formattedDateend = currentDateEnd.toISOString().slice(0, 10); // ฟอร์แมต YYYY-MM-DD
                        formattedEndDate = `${formattedDateend} 23:59:59`;
                    }


                    const statusName = self.filter_ads_fb.length > 0 ? self.filter_ads_fb[0].name : null;
                    let data = {
                        "search": "",
                        // "ref_default": 1,
                        "status": statusName || "",
                        "start_at": formattedStartDate || self.startDate,
                        "end_at": formattedEndDate || self.endDate,
                        "page": self.currentFacebookPages,
                        "per_page": parseInt(self.itemsFacebookPerPage) || 10,
                        "order": self.column_facebook_order_by,
                        "order_by": self.facebook_order_sort
                    }
                    const response = await services.getFacebook(data, self.token_header)
                    if (response.data.code === 200) {
                        self.data_facebook = response.data.data || [];
                        self.totalFacebookItems = response.data.total;
                        // console.log(response.data.data)
                        closeLoading();

                    }

                } catch (err) {
                    closeLoading();
                    Msg("errorMsg", 'error');

                } finally {

                }
            },

            async filterModal(value, tableSession) {
                const self = this;
                self.modal_titles = value;
                self.modal_session = tableSession;
                $("#filter_model").modal("show");

                if (tableSession === 1) {
                    try {
                        // const req = await services.getProduct(self.token_header);
                        let data_status = [
                            "เปิดใช้งาน",
                            "ปิดใช้งาน"
                        ]
                        self.data_ads_tt = data_status.map((item) => {
                            const existingProduct = self.filter_ads_tt.find(
                                (prod) => prod.name === item
                            );

                            return {
                                check_value: existingProduct
                                    ? existingProduct.check_value
                                    : false,
                                name: item,
                            };
                        });
                    } catch (error) {
                        console.log("🚀 ~ filterModal ~ error:", error);
                    }
                } else if (tableSession === 2) {
                    try {
                        const req = await services.getShopCost(self.token_header);
                        self.data_cost_shop = req.data.data.map((item) => {
                            const existingProduct = self.filter_cost_shop.find(
                                (prod) => prod.name === item
                            );

                            return {
                                check_value: existingProduct
                                    ? existingProduct.check_value
                                    : false,
                                name: item,
                            };
                        });
                    } catch (error) {
                        console.log("🚀 ~ filterModal ~ error:", error);
                    }
                } else if (tableSession === 3) {
                    try {
                        let data = {};
                        const req = await services.getShopTT(self.token_header);
                        self.data_shop_tt = req.data.data.map((item) => {
                            const existingProduct = self.filter_shop_tt.find(
                                (prod) => prod.name === item
                            );
                            return {
                                check_value: existingProduct
                                    ? existingProduct.check_value
                                    : false,
                                name: item,
                            };
                        });
                    } catch (error) {
                        console.log("🚀 ~ filterModal ~ error:", error);
                    }
                } else if (tableSession === 4) {
                    try {
                        // const req = await services.getProduct(self.token_header);
                        let data_status = [
                            "เปิดใช้งาน",
                            "ปิดใช้งาน"
                        ]
                        self.data_ads_fb = data_status.map((item) => {
                            const existingProduct = self.filter_ads_fb.find(
                                (prod) => prod.name === item
                            );

                            return {
                                check_value: existingProduct
                                    ? existingProduct.check_value
                                    : false,
                                name: item,
                            };
                        });
                    } catch (error) {
                        console.log("🚀 ~ filterModal ~ error:", error);
                    }
                }
            },
            closeModalFilter() {
                $("#filter_model").modal("hide");
                if (this.modal_session === 1) {
                    this.data_ads_tt = [];
                } else if (this.modal_session === 2) {
                    this.data_cost_shop = [];
                } else if (this.modal_session === 3) {
                    this.data_shop_tt = [];
                } else if (this.modal_session === 4) {
                    this.data_ads_fb = [];
                }
            },
            resetCheckValue() {
                const self = this;

                if (self.modal_session === 1) {
                    this.data_ads_tt.forEach((item) => (item.check_value = false));
                } else if (self.modal_session === 2) {
                    this.data_cost_shop.forEach((item) => (item.check_value = false));
                } else if (self.modal_session === 3) {
                    this.data_shop_tt.forEach((item) => (item.check_value = false));
                } else if (self.modal_session === 4) {
                    this.data_ads_fb.forEach((item) => (item.check_value = false));
                }
            },
            async saveFilter() {
                const self = this;

                function addOrRemoveItem(filterArray, item) {
                    const index = filterArray.findIndex(
                        (existingItem) => existingItem.name === item.name
                    );
                    if (item.check_value) {
                        if (index === -1) {
                            filterArray.push(item);
                        }
                    } else {
                        if (index !== -1) {
                            filterArray.splice(index, 1);
                        }
                    }
                }

                if (self.modal_session === 1) {
                    self.data_ads_tt.forEach((item) =>
                        addOrRemoveItem(self.filter_ads_tt, item)
                    );
                    self.data_ads_tt = [];
                    $("#filter_model").modal("hide");

                    await self.getAds();
                } else if (self.modal_session === 2) {
                    self.data_cost_shop.forEach((item) =>
                        addOrRemoveItem(self.filter_cost_shop, item)
                    );
                    self.data_cost_shop = [];
                    $("#filter_model").modal("hide");

                    await self.getAdsCost();
                } else if (self.modal_session === 3) {
                    self.data_shop_tt.forEach((item) =>
                        addOrRemoveItem(self.filter_shop_tt, item)
                    );
                    self.data_shop_tt = [];
                    $("#filter_model").modal("hide");

                    await self.getTiktok();
                } else if (self.modal_session === 4) {
                    self.data_ads_fb.forEach((item) =>
                        addOrRemoveItem(self.filter_ads_fb, item)
                    );
                    self.data_ads_fb = [];
                    $("#filter_model").modal("hide");

                    await self.getFacebook();
                }
            },
            selectCheckValue(selectedIndex, sessionValue) {
                if (sessionValue === 'tt') {
                    this.data_ads_tt.forEach((item, index) => {
                        item.check_value = index === selectedIndex;
                    });
                } else {
                    this.data_ads_fb.forEach((item, index) => {
                        item.check_value = index === selectedIndex;
                    });
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
            // console.log("ok")
        }


    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
