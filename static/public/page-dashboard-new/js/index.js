(function ($, window, Vue, axios) {
    'use strict';


    const token_header = getCookie('token');
    const app = Vue.createApp({
        data: function () {
            return {
                user: window.user || "",
                currentPage: window.currentPage,
                authstatus: window.authstatus,
                token_header: token_header || '',
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                dataReview: [],
                dataCaretaker: [],
                dataClip: [],
                dataProductChannel: [],
                dataReviewTb2: [],
                dataChannel: [],
                dataProduct: [],
                dataBy: [],
                dataDao: [],
                dataTikTok: [],
                dataLaz: [],
                dataShopPee: [],
                dataFb: [],
                dataLine: [],
                dataOrder: [],
                dataClip: [],
                totalItems: 0,     // Total items returned by the API
                totalPagesreview: 0,     // Total items returned by the API
                totalPagesreview2: 0,     // Total items returned by the API
                column_order_by_r: 0,     // Total items returned by the API
                totalItemsreview: 0,     // Total items returned by the API
                totalItemsreview2: 0,     // Total items returned by the API
                currentPage: 1,
                currentPagereview2: 1,
                currentPagereview: 1,
                perPagereview: 10,
                perPagereview2: 10,
                itemsPerPage: 10,
                itemsPerPageScript: 10,
                itemsPerPage2: 10,
                itemsPerPagereview: 10,
                itemsPerPagereview2: 10,
                maxVisiblePages: 5,
                column_order_by: '',
                column_order_by_r: '',
                order_sort: "desc",
                order_sort_r: "desc",

            }
        },
        computed: {
            totalPages() {
                return Math.ceil(this.totalItems / this.perPage);
            },
            visiblePages() {
                let start = Math.max(1, this.currentPage - 2);
                let end = Math.min(this.totalPages, this.currentPage + 2);

                // Adjust start and end if there are fewer than 5 pages
                if (end - start + 1 < this.maxVisiblePages) {
                    if (this.currentPage <= 2) {
                        end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);
                    } else if (this.currentPage >= this.totalPages - 2) {
                        start = Math.max(1, end - this.maxVisiblePages + 1);
                    }
                }
                const pages = [];
                for (let i = start; i <= end; i++) {
                    pages.push(i);
                }
                return pages;
            },
            pages() {
                const pages = [];
                const maxPages = 5;
                const startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
                const endPage = Math.min(this.totalPages, startPage + maxPages - 1);

                for (let page = startPage; page <= endPage; page++) {
                    pages.push(page);
                }

                return pages;
            },
            pagesreview() {
                const pages = [];
                const maxPages = 5;
                const startPage = Math.max(1, this.currentPagereview - Math.floor(maxPages / 2));
                const endPage = Math.min(this.totalPagesreview, startPage + maxPages - 1);

                for (let page = startPage; page <= endPage; page++) {
                    pages.push(page);
                }
                return pages;
            },
            pagesreview2() {
                const pages = [];
                const maxPages = 5;
                const startPage = Math.max(1, this.currentPagereview2 - Math.floor(maxPages / 2));
                const endPage = Math.min(this.totalPagesreview2, startPage + maxPages - 1);
                for (let page = startPage; page <= endPage; page++) {
                    pages.push(page);
                }
                return pages;
            },

            totalPagesreview() {
                return Math.ceil(this.totalItemsreview / this.itemsPerPagereview);
            },
            totalPagesreview2() {
                return Math.ceil(this.totalItemsreview2 / this.itemsPerPagereview2);
            },
        },
        methods: {
            async init() {
                let self = this

            },
            async loadDataClip(page = 1, per_page = 10) {
                const self = this;
                try {

                    $('#page_size_select_review_script').on("change.custom", async function () {
                        const selectedValue = $(this).val(); // Get the selected value
                        self.itemsPerPageScript = selectedValue || 10
                        await self.loadDataClip();
                    })

                    let data = {
                        "search": "",
                        "product": [],
                        "chanel": [],
                        "save_by": [],
                        "page": page, // Pass the current page
                        "per_page": Number(this.itemsPerPageScript), 
                        "order": this.column_order_by,
                        "order_by": this.order_sort
                    };

                    let responsegetClip = await services.getClip(data, self.token_header);
                    const dataClip = responsegetClip?.data.data || [];
                    self.dataClip = dataClip;
                    self.totalItems = responsegetClip.data.total;
                    self.perPage = per_page; // Update per_page value
                    self.currentPage = page; // Set the current page

                    closeLoading();
                } catch (error) {
                    console.warn(`🌦️ ~ loadDataClip ~ error:`, error);
                    closeLoading();
                }
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
                await this.loadDataClip();
            },
            async sortTableR(column) {
                if (this.column_order_by_r === column) {
                    // สลับทิศทางการเรียงลำดับ
                    this.order_sort_r = this.order_sort_r === 'asc' ? 'desc' : 'asc';
                } else {
                    // กำหนดคอลัมน์ใหม่และตั้งค่าเรียงลำดับเป็น 'asc'
                    this.column_order_by_r = column;
                    this.order_sort_r = 'asc';
                }
                // เรียกฟังก์ชันเพื่อดึงข้อมูลหรืออัปเดตตาราง
                await this.loadDataReview();
            },
            async sortTableR2(column) {
                if (this.column_order_by_r2 === column) {
                    // สลับทิศทางการเรียงลำดับ
                    this.order_sort_r2 = this.order_sort_r2 === 'asc' ? 'desc' : 'asc';
                } else {
                    // กำหนดคอลัมน์ใหม่และตั้งค่าเรียงลำดับเป็น 'asc'
                    this.column_order_by_r2 = column;
                    this.order_sort_r2 = 'asc';
                }
                // เรียกฟังก์ชันเพื่อดึงข้อมูลหรืออัปเดตตาราง
                await this.loadDataReviewTb2();
            },

            getSortIcon(column) {
                const self = this;
                if (self.column_order_by !== column) {
                    return "bi-chevron-down";  // Default down icon
                }
                return self.order_sort === "asc" ? "bi-chevron-up" : "bi-chevron-down";
            },
            getSortIconR(column) {
                const self = this;
                if (self.column_order_by_r !== column) {
                    return "bi-chevron-down";  // Default down icon
                }
                return self.order_sort_r === "asc" ? "bi-chevron-up" : "bi-chevron-down";
            },
    
            getSortIconR2(column) {
                const self = this;
                if (self.column_order_by_r2 !== column) {
                    return "bi-chevron-down";  // Default down icon
                }
                return self.order_sort_r2 === "asc" ? "bi-chevron-up" : "bi-chevron-down";
            },

            changePage(page) {
                if (page !== this.currentPage && page > 0 && page <= this.totalPages) {
                    this.loadDataClip(page, this.perPage);
                }
            },
            changePagereview2(page) {
                if (page !== this.currentPagereview2 && page > 0 && page <= this.totalPagesreview2) {
                    this.currentPagereview2 = page;
                    this.loadDataReviewTb2(page, this.perPagereview2);
                }
            },
            changePagereview(page) {
                if (page !== this.currentPagereview && page > 0 && page <= this.totalPagesreview) {
                    this.currentPagereview = page;
                    this.loadDataReview(page, this.perPagereview);
                }
            },
            updatePerPage(event) {
                this.loadDataClip(1, parseInt(event.target.value)); // Reset to page 1 when per-page changes
            },

            async loadDataProductChannel() {
                const self = this;
                try {
                    let data = {
                        page: 1,
                        per_page: 100,
                    }
                    let responseGetProductChannel = await services.getProductChannel();
                    const dataProductChannel = responseGetProductChannel?.data.data || [];
                    self.dataProductChannel = dataProductChannel;

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
            },
            async loadDataReview() {
                const self = this;
                try {

                    $('#page_size_select_review').on("change.custom", async function () {
                        const selectedValue = $(this).val(); // Get the selected value
                        self.itemsPerPage = selectedValue || 10
                        await self.loadDataReview();
                    })

                    let data = {
                        "search": "",
                        "user": [],
                        "infraction": [],
                        "page": self.currentPagereview,
                        "per_page": Number(this.itemsPerPage),
                        "order": this.column_order_by_r,
                        "order_by": this.order_sort_r
                    };
                    let responsegetClip = await services.getReview(data, self.token_header);
                    const dataReview = responsegetClip?.data.data || [];
                    self.dataReview = dataReview;
                    console.log("🚀 ~ loadDataReview ~ self.dataReview:", self.dataReview)
                    self.totalPagesreview = responsegetClip.data.total;

                } catch (error) {
                    console.warn(`🌦️ ~ loaddataReview ~ error:`, error);
                }
            },

            async loadDataReviewTb2() {
                const self = this;
                try {

                    $('#page_size_select_review2').on("change.custom", async function () {
                        const selectedValue = $(this).val(); // Get the selected value
                        self.itemsPerPage2 = selectedValue || 10
                        await self.loadDataReviewTb2();
                    })

                    let data = {
                        "search": "",
                        "by": [],
                        "channel": [],
                        "action": [],
                        "page": self.currentPagereview2,
                        "per_page": Number(this.itemsPerPage2),
                        "order": this.column_order_by_r2,
                        "order_by": this.order_sort_r2
                    };
                    let responsegetTb2 = await services.getReviewTb2(data, self.token_header);
                    const dataReviewTb2 = responsegetTb2?.data.data || [];
                    self.dataReviewTb2 = dataReviewTb2;
                    console.log("🚀 ~ loadDataReview ~ self.dataReview:", self.dataReviewTb2)
                    self.totalPagesreview2 = responsegetTb2.data.total;

                } catch (error) {
                    console.warn(`🌦️ ~ loaddataReview ~ error:`, error);
                }
            },

            async loadDataApp() {
                const self = this;
                try {
                    let responseGetTikTok = await services.getTikTok();
                    const dataTikTok = responseGetTikTok?.data.data || [];
                    self.dataTikTok = dataTikTok;

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
                try {
                    let responseGetLaz = await services.getLaz();
                    const dataLaz = responseGetLaz?.data.data || [];
                    self.dataLaz = dataLaz;

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
                try {
                    let responseShoppee = await services.getShoppee();
                    const dataShopPee = responseShoppee?.data.data || [];
                    self.dataShopPee = dataShopPee;

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
                try {
                    let responseFb = await services.getFb();
                    const dataFb = responseFb?.data.data || [];
                    self.dataFb = dataFb;

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
                try {
                    let responseLine = await services.getLine();
                    const dataLine = responseLine?.data.data || [];
                    self.dataLine = dataLine;

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
                try {
                    let responseOrder = await services.getOrder();
                    const dataOrder = responseOrder?.data.data || [];
                    self.dataOrder = dataOrder;

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                }
            },
            formatNumber(amount) {
                return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },

            async DefaultData() {
                const self = this;
                try {
                    await self.loadDataClip()
                    await self.loadDataProductChannel()
                    await self.loadDataReview()
                    await self.loadDataReviewTb2()
                    await self.loadDataApp()
                } catch (error) {
                    console.log("🚀 ~ DefaultData ~ error:", error)

                } finally {
                    self.flatpickr_dp_from_date = $("#kt_td_picker_basic_input").flatpickr({
                        static: true,
                        enableTime: true,
                        disableMobile: "true",
                        dateFormat: "Y-m-d H:i",
                        onChange: function (selectedDates, dateStr, instance) {

                        },
                    });
                }
            }

        },

        mounted: function () {
            let self = this
            //    self.getPokemon()
            // self.loadDataClip()
            // self.loadDataProductChannel()
            // self.loadDataReview()
            // self.loadDataReviewTb2()
            // self.loadDataSelectAdmin()
            // self.loadDataSelectChannel()
            self.DefaultData()
            console.log("ok")
        }


    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
