(function ($, window, Vue, axios) {
    'use strict';

    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const currentDateShow = new Date().toLocaleDateString('en-GB', options);

    const token_header = getCookie('token');
    const app = Vue.createApp({
        data: function () {
            return {
                ...window.webUtils.data || {},
                user: window.user || "",
                currentPage: 'dashboard',
                authstatus: window.authstatus,
                token_header: token_header || '',
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                datLog: [],
                dataReview: [],
                dataCaretaker: [],
                dataClip: [],
                dataProductChannel: [],
                dataReviewTb2: [],
                dataEditStars: [],
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
                data_edit: {},
                dataMatterUpdate: [],
                dataUpdateAction: [],
                dataOrderManual: [],
                dataDailySum: {},
                totalItems: 0,
                perPage: 10,
                // totalPagesreview: 0,
                // totalPagesreview2: 0,
                column_order_by_r: 0,
                column_order_order: 0,
                totalItemsreview: 0,
                totalItemsreview2: 0,
                totalItemsreorder: 0,
                totallog: 0,
                currentPages: 1,
                currentPagereview2: 1,
                currentPagelog: 1,
                currentPagereview: 1,
                currentPagereorder: 1,
                perPagereview: 10,
                perPagereorder: 10,
                perPagereview2: 10,
                perPagelog: 10,
                itemsPerPage: 10,
                itemsPerPageScript: 10,
                itemsPerPage2: 10,
                itemsPerPageLog: 10,
                itemsPerPageorder: 10,
                itemsPerPagereview: 10,
                itemsPerPagereview2: 10,
                itemsPerPagereorder: 10,
                itemsPerPagelog: 10,
                maxVisiblePages: 5,
                column_order_by: '',
                column_order_by_r: '',
                column_order_by_r2: '',
                column_order_order: '',
                order_sort: "desc",
                order_sort_r: "desc",
                order_sort_order: "desc",
                order_sort_r2: "desc",
                startDate: null,
                endDate: null,
                startDate_status: false,
                endDate_status: false,
                selectedAction: '',
                dataNameChannel: [],
                unmatchedItems: [],
                // date_show: currentDateShow,
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
                    {
                        id: 11,
                        name: "ติดตามเคสมากกว่า 3ครั้ง",
                    },
                    {
                        id: 12,
                        name: "ติดตามเคส",
                    },
                ],
                matter_story: [
                    {
                        id: 1,
                        name: "พบการละเมิด",
                    },
                    {
                        id: 2,
                        name: "ไม่พบการละเมิด",
                    },

                ],

                modal_titles: '',
                modal_session: '',
                data_products: [],
                data_products_2: [],
                data_products_3: [],
                data_products_4: [],
                data_channel: [],
                data_channel_2: [],
                data_channel_3: [],
                data_channel_4: [],
                data_users: [],
                data_users_2: [],
                data_users_3: [],
                data_users_4: [],
                filter_products: [],
                filter_products_2: [],
                filter_products_3: [],
                filter_products_4: [],
                filter_channel: [],
                filter_channel_2: [],
                filter_channel_3: [],
                filter_channel_4: [],
                filter_users: [],
                filter_users_2: [],
                filter_users_3: [],
                filter_users_4: [],
                filter_star_4: [],

            }
        },
        computed: {
            totalPages() {
                return Math.ceil(this.totalItems / this.itemsPerPageScript);
            },
            totalPagesreview() {
                return Math.ceil(this.totalItemsreview / this.itemsPerPagereview);
            },
            totalPagesreorder() {
                return Math.ceil(this.totalItemsreorder / this.itemsPerPagereorder);
            },
            totalPagesreview2() {
                return Math.ceil(this.totalItemsreview2 / this.itemsPerPagereview2);
            },
            totalPageLog() {
                return Math.ceil(this.totallog / this.itemsPerPagelog);
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
            pagesorder() {
                const pages = [];
                const maxPages = 5;
                const startPage = Math.max(1, this.currentPagereorder - Math.floor(maxPages / 2));
                const endPage = Math.min(this.totalPagesreorder, startPage + maxPages - 1);

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

            pagesLog() {
                const pages = [];
                const maxPages = 5;
                const startPage = Math.max(1, this.currentPagelog - Math.floor(maxPages / 2));
                const endPage = Math.min(this.totalPageLog, startPage + maxPages - 1);
                for (let page = startPage; page <= endPage; page++) {
                    pages.push(page);
                }
                return pages;
            },
            startItem() {
                return (this.currentPages - 1) * this.itemsPerPageScript + 1;
            },
            endItem() {
                const end = this.currentPages * this.itemsPerPageScript;
                return end > this.totalItems ? this.totalItems : end;
            },

            startItemorder() {
                return (this.currentPagereorder - 1) * this.itemsPerPagereorder + 1;
            },
            endItemorder() {
                const end = this.currentPagereorder * this.itemsPerPagereorder;
                return end > this.totalItemsreorder ? this.totalItemsreorder : end;
            },

            startItemreview() {
                return (this.currentPagereview - 1) * this.itemsPerPagereview + 1;
            },
            endItemreview() {
                const end = this.currentPagereview * this.itemsPerPagereview;
                return end > this.totalItemsreview ? this.totalItemsreview : end;
            },

            startItemreviewT2() {
                return (this.currentPagereview2 - 1) * this.itemsPerPagereview2 + 1;
            },
            endItemreviewT2() {
                const end = this.currentPagereview2 * this.itemsPerPagereview2;
                return end > this.totalItemsreview2 ? this.totalItemsreview2 : end;
            },
        },
        methods: {
            ...window.webUtils.method || {},
            async init() {
                let self = this

                $('#page_size_select_review_script').on("change.custom", async function () {
                    const selectedValue = $(this).val(); // Get the selected value
                    self.itemsPerPageScript = selectedValue || 10
                    self.currentPages = 1
                    await self.loadDataClip();
                })

                $('#page_size_select_review').on("change.custom", async function () {
                    const selectedValue = $(this).val(); // Get the selected value
                    self.itemsPerPagereview = selectedValue || 10
                    self.currentPagereview = 1
                    await self.loadDataReview();
                })

                $('#page_size_select_review2').on("change.custom", async function () {
                    const selectedValue = $(this).val(); // Get the selected value
                    self.itemsPerPagereview2 = selectedValue || 10
                    self.currentPagereview2 = 1
                    await self.loadDataReviewTb2();
                })
                $('#page_size_log').on("change.custom", async function () {
                    const selectedValue = $(this).val(); // Get the selected value
                    self.itemsPerPageLog = selectedValue || 10
                    self.currentPagelog = 1
                    await self.editinghistory(this.data_edit);
                })
                $('#page_size_select_order').on("change.custom", async function () {
                    const selectedValue = $(this).val(); // Get the selected value
                    self.itemsPerPagereorder = selectedValue || 10
                    self.page_size_select_order = 1
                    await self.loadDataProductChannel();
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
                            self.startDate_status = true;

                            // Set minDate for the end date picker to prevent selecting earlier dates
                            self.flatpickr_dp_end_date.set("minDate", self.startDate);
                            if (self.endDate && new Date(self.startDate) > new Date(self.endDate)) {
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
                    maxDate: 'today',
                    onChange: async function (selectedDates, dateStr, instance) {
                        if (selectedDates.length) {
                            const selectedDate = selectedDates[0];

                            // Format the date to YYYY-MM-DD in local time zone
                            const year = selectedDate.getFullYear();
                            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                            const day = String(selectedDate.getDate()).padStart(2, '0');

                            self.endDate = `${year}-${month}-${day}`;
                            self.endDate_status = true;

                            await self.DefaultData();
                        }
                    },
                });

                const currentDate = new Date();
                const formattedDate = currentDate.toISOString().slice(0, 10).replace('T', ' ');
                self.startDate = formattedDate
                self.endDate = formattedDate
            },

            async loadDataClip(page = 1, per_page = 10) {
                const self = this;
                try {
                    showLoading();
                    const currentDate = new Date();
                    const formattedDate = currentDate.toISOString().slice(0, 10).replace('T', ' ') + ' 00:00:00';

                    let formattedDatestart = self.startDate || new Date().toISOString().slice(0, 10); // Ensure you have a default value
                    let formattedStartDate = `${formattedDatestart} 00:00:00`;
                    let formattedDateend = self.endDate || new Date().toISOString().slice(0, 10); // Ensure you have a default value
                    let formattedEndDate = `${formattedDateend} 23:59:59`;
                    const productNames = self.filter_products.map(item => item.name);
                    const channelNames = self.filter_channel.map(item => item.name);
                    const usersNames = self.filter_users.map(item => item.name);
                    let data = {
                        "search": "",
                        "start_at": formattedStartDate || formattedDate,
                        "end_at": formattedEndDate || formattedDate,
                        "product": productNames || [],
                        "chanel": channelNames || [],
                        "save_by": usersNames || [],
                        "page": page, // Pass the current page
                        "per_page": Number(this.itemsPerPageScript),
                        "order": this.column_order_by,
                        "order_by": this.order_sort
                    };
                    console.log("🚀 ~ loadDataClip ~ data:", data)

                    let responsegetClip = await services.getClip(data, self.token_header);
                    const dataClip = responsegetClip?.data.data || [];
                    self.dataClip = dataClip;
                    self.totalItems = responsegetClip.data.total;
                    self.perPage = per_page; // Update per_page value
                    self.currentPages = page; // Set the current page

                    closeLoading();
                } catch (error) {
                    console.warn(`🌦️ ~ loadDataClip ~ error:`, error);
                    closeLoading();
                }
            },

            async loadDataProductChannel() {
                const self = this;
                try {
                    showLoading();
                    const currentDate = new Date();
                    const formattedDate = currentDate.toISOString().slice(0, 10).replace('T', ' ') + ' 00:00:00';

                    let formattedDatestart = self.startDate || new Date().toISOString().slice(0, 10); // Ensure you have a default value
                    let formattedStartDate = `${formattedDatestart} 00:00:00`;

                    let formattedDateend = self.endDate || new Date().toISOString().slice(0, 10); // Ensure you have a default value
                    let formattedEndDate = `${formattedDateend} 23:59:59`;
                    const productNames = self.filter_products_2.map(item => item.name);
                    const channelNames = self.filter_channel_2.map(item => item.name);
                    const usersNames = self.filter_users_2.map(item => item.name);
                    let data = {
                        // search: this.search,
                        "product_multiple": productNames || [],
                        "channel_multiple": channelNames || [],
                        "user_multiple": usersNames || [],
                        customer: this.customer || '', // Bind the search fields
                        product: this.product || '',
                        order_no: this.order_no || '',
                        chanel: this.chanel || '',
                        note: this.note || '',
                        user: this.user || '',
                        "start_at": formattedStartDate || formattedDate,
                        "end_at": formattedEndDate || formattedDate,
                        page: this.currentPagereorder,
                        "per_page": Number(this.itemsPerPagereorder),
                        "order": this.column_order_order,
                        "order_by": this.order_sort_order
                    };

                    const responseGetOrderManual = await services.getOrderManual(data, this.token_header);
                    const response = responseGetOrderManual?.data || {};
                    this.dataOrderManual = response.data || [];

                    self.totalItemsreorder = responseGetOrderManual.data.total;
                    closeLoading()
                } catch (error) {
                    console.warn("Error loading data:", error);
                    closeLoading()
                }
            },

            async loadDataReview() {
                const self = this;
                try {
                    showLoading();

                    const currentDate = new Date();
                    const formattedDate = currentDate.toISOString().slice(0, 10).replace('T', ' ') + ' 00:00:00';

                    let formattedDatestart = self.startDate || new Date().toISOString().slice(0, 10); // Ensure you have a default value
                    let formattedStartDate = `${formattedDatestart} 00:00:00`;

                    let formattedDateend = self.endDate || new Date().toISOString().slice(0, 10); // Ensure you have a default value
                    let formattedEndDate = `${formattedDateend} 23:59:59`;

                    const productNames = self.filter_products_3.map(item => item.name);
                    const channelNames = self.filter_channel_3.map(item => item.name);
                    const usersNames = self.filter_users_3.map(item => item.name);

                    let data = {
                        "channel": productNames || [],
                        "infraction": channelNames || [],
                        "user": usersNames || [],

                        "start_at": formattedStartDate || formattedDate,
                        "end_at": formattedEndDate || formattedDate,
                        "search": "",
                        "page": self.currentPagereview,
                        "per_page": Number(this.itemsPerPagereview),
                        "order": this.column_order_by_r,
                        "order_by": this.order_sort_r
                    };
                    let responsegetClip = await services.getReview(data, self.token_header);
                    const dataReview = responsegetClip?.data.data || [];
                    self.dataReview = dataReview;
                    self.totalItemsreview = responsegetClip.data.total;

                    closeLoading()
                } catch (error) {
                    console.warn(`🌦️ ~ loaddataReview ~ error:`, error);
                    closeLoading()
                }
            },

            async loadDataReviewTb2() {
                const self = this;
                try {
                    showLoading();
                    const currentDate = new Date();
                    const formattedDate = currentDate.toISOString().slice(0, 10)

                    let formattedDatestart = self.startDate || new Date().toISOString().slice(0, 10); // Ensure you have a default value
                    let formattedStartDate = `${formattedDatestart}`;

                    let formattedDateend = self.endDate || new Date().toISOString().slice(0, 10); // Ensure you have a default value
                    let formattedEndDate = `${formattedDateend}`;

                    const productNames = self.filter_products_4.map(item => item.name);
                    const channelNames = self.filter_channel_4.map(item => item.name);
                    const usersNames = self.filter_users_4.map(item => item.name);
                    const star = self.filter_star_4.map(item => item.name);
                    let data = {
                        "by": usersNames || [],
                        "product": productNames || [],
                        "channel": channelNames || [],
                        "action": star || [],

                        "start_at": formattedStartDate || formattedDate,
                        "end_at": formattedEndDate || formattedDate,
                        "search": "",
                        "page": self.currentPagereview2,
                        "per_page": Number(this.itemsPerPagereview2),
                        "order": this.column_order_by_r2,
                        "order_by": this.order_sort_r2
                    };
                    let responsegetTb2 = await services.getReviewTb2(data, self.token_header);
                    const dataReviewTb2 = responsegetTb2?.data.data || [];
                    self.dataReviewTb2 = dataReviewTb2;

                    self.totalItemsreview2 = responsegetTb2.data.total;
                    closeLoading()

                } catch (error) {
                    console.warn(`🌦️ ~ loaddataReview ~ error:`, error);
                    closeLoading()
                }
            },

            async loadDailySum() {
                try {
                    showLoading();

                    const currentDate = new Date().toISOString().slice(0, 10);

                    let formattedDatestart = this.startDate || new Date().toISOString().slice(0, 10); // Ensure you have a default value

                    let formattedDateend = this.endDate || new Date().toISOString().slice(0, 10); // Ensure you have a default value
                    let data = {
                        "start_at": formattedDatestart,
                        "end_at": formattedDateend
                    };
                    const responseGetDailySum = await services.getDailySum(data, this.token_header);
                    const response = responseGetDailySum?.data || {};
                    this.dataDailySum = response.data || {};
                    const matchedNames = this.dataNameChannel.map(item => item.channel_name);
                    this.unmatchedItems = this.dataDailySum.filter(item =>
                        !matchedNames.includes(item.channel_name)
                    );
                    closeLoading()
                } catch (error) {
                    console.warn("Error loading data:", error);
                    closeLoading()
                }
            },

            formatDate(date) {
                const d = new Date(date);
                const day = String(d.getDate()).padStart(2, '0');

                const englishMonthsAbbrev = [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ];

                const month = englishMonthsAbbrev[d.getMonth()];
                const year = d.getFullYear();

                return `${day} ${month} ${year}`;
            },

            async sortTable(column) {
                if (this.column_order_by === column) {
                    this.order_sort = this.order_sort === 'asc' ? 'desc' : 'asc';
                } else {
                    this.column_order_by = column;
                    this.order_sort = 'asc';
                }
                await this.loadDataClip();
            },
            async sortTableR(column) {
                if (this.column_order_by_r === column) {
                    this.order_sort_r = this.order_sort_r === 'asc' ? 'desc' : 'asc';
                } else {
                    this.column_order_by_r = column;
                    this.order_sort_r = 'asc';
                }
                await this.loadDataReview();
            },
            async sortTableOrder(column) {
                if (this.column_order_order === column) {
                    this.order_sort_order = this.order_sort_order === 'asc' ? 'desc' : 'asc';
                } else {
                    this.column_order_order = column;
                    this.order_sort_order = 'asc';
                }
                await this.loadDataProductChannel();
            },

            async sortTableR2(column) {
                if (this.column_order_by_r2 === column) {
                    this.order_sort_r2 = this.order_sort_r2 === 'asc' ? 'desc' : 'asc';
                } else {
                    this.column_order_by_r2 = column;
                    this.order_sort_r2 = 'asc';
                }
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
            getSortIconorder(column) {
                const self = this;
                if (self.column_order_order !== column) {
                    return "bi-chevron-down";  // Default down icon
                }
                return self.order_sort_order === "asc" ? "bi-chevron-up" : "bi-chevron-down";
            },

            getSortIconR2(column) {
                const self = this;
                if (self.column_order_by_r2 !== column) {
                    return "bi-chevron-down";  // Default down icon
                }
                return self.order_sort_r2 === "asc" ? "bi-chevron-up" : "bi-chevron-down";
            },

            changePage(page) {
                if (page !== this.currentPages && page > 0 && page <= this.totalPages) {
                    this.loadDataClip(page, this.perPage);
                }
            },
            changePagereview2(page) {
                if (page !== this.currentPagereview2 && page > 0 && page <= this.totalPagesreview2) {
                    this.currentPagereview2 = page;
                    this.loadDataReviewTb2(page, this.perPagereview2);
                }
            },
            changePageLog(page) {
                if (page !== this.currentPagelog && page > 0 && page <= this.totalPageLog) {
                    this.currentPagelog = page;
                    this.editinghistory(this.data_edit);
                }
            },
            changePagereview(page) {
                if (page !== this.currentPagereview && page > 0 && page <= this.totalPagesreview) {
                    this.currentPagereview = page;
                    this.loadDataReview(page, this.perPagereview);
                }
            },
            changePagereorder(page) {
                if (page !== this.currentPagereorder && page > 0 && page <= this.totalPagesreorder) {
                    this.currentPagereorder = page;
                    this.loadDataProductChannel(page, this.perPagereorder);
                }
            },
            updatePerPage(event) {
                this.loadDataClip(1, parseInt(event.target.value)); // Reset to page 1 when per-page changes
            },

            async loadChannel() {
                const self = this
                try {
                    const req = await services.listChannel(self.token_header)
                    self.dataNameChannel = req.data.data || []
                    console.log("🚀 ~ loadChannel ~ req:", req)
                } catch (error) {
                    console.log("🚀 ~ loadChannel ~ error:", error)
                }
            },

            formatNumber(amount) {
                return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            filteredData(channelName) {
                if (!Array.isArray(this.dataDailySum)) {
                    return [];
                }
                return this.dataDailySum.filter(list => list.channel_name === channelName);
            },

            modalEdit(data) {
                $('#staticBackdrop').modal('show');
                this.data_edit = data;
            },
            async editinghistory(data) {
                $('#editinghistory').modal('show');
                this.data_edit = data || this.data_edit;
                try {
                    let data = {
                        "service": "sls_negative_detail",
                        "id_ref": this.data_edit.id || this.data_id,
                        "page": this.currentPagelog,
                        "per_page": Number(this.itemsPerPageLog),
                    };

                    const responseGetLog = await services.getlog(data, this.token_header);
                    this.datLog = responseGetLog.data.data || {};

                    this.totallog = responseGetLog.data.total;

                } catch (error) {
                    console.warn("Error loading data:", error);
                }
            },

            async filterModalVDO(value, tableSession) {
                console.log("🚀 ~ filterModalVDO ~ value:", value)
                const self = this;
                self.modal_titles = value
                self.modal_session = tableSession
                $('#filter_model').modal('show')

                if (tableSession === 1) {
                    if (value === 'สินค้า') {
                        try {
                            const req = await services.getProduct(self.token_header);
                            self.data_products = req.data.data.map(item => {
                                const existingProduct = self.filter_products.find(prod => prod.name === item);

                                return {
                                    check_value: existingProduct ? existingProduct.check_value : false,
                                    name: item
                                };
                            });
                        } catch (error) {
                            console.log("🚀 ~ filterModal ~ error:", error)
                        }
                    } else if (value === 'ช่องทาง') {
                        console.log("a;kasd")
                        try {
                            const req = await services.getChannel(self.token_header);
                            self.data_channel = req.data.data.map(item => {
                                const existingProduct = self.filter_channel.find(prod => prod.name === item);

                                return {
                                    check_value: existingProduct ? existingProduct.check_value : false,
                                    name: item
                                };
                            });
                        } catch (error) {
                            console.log("🚀 ~ filterModal ~ error:", error)
                        }
                    } else {
                        try {
                            const req = await services.getUser(self.token_header);
                            self.data_users = req.data.data.map(item => {
                                const existingProduct = self.filter_users.find(prod => prod.name === item);

                                return {
                                    check_value: existingProduct ? existingProduct.check_value : false,
                                    name: item
                                };
                            });
                        } catch (error) {
                            console.log("🚀 ~ filterModal ~ error:", error)
                        }
                    }
                } else if (tableSession === 2) {
                    if (value === 'ชื่อสินค้า') {
                        try {
                            const req = await services.getmanual(self.token_header);
                            self.data_products_2 = req.data.data.map(item => {
                                const existingProduct = self.filter_products_2.find(prod => prod.name === item);

                                return {
                                    check_value: existingProduct ? existingProduct.check_value : false,
                                    name: item
                                };
                            });
                        } catch (error) {
                            console.log("🚀 ~ filterModal ~ error:", error)
                        }
                    } else if (value === 'ช่องทาง') {
                        try {
                            const req = await services.getChannelAll(self.token_header);
                            self.data_channel_2 = req.data.data.map(item => {
                                const existingProduct = self.filter_channel_2.find(prod => prod.name === item.channel_name);

                                return {
                                    check_value: existingProduct ? existingProduct.check_value : false,
                                    name: item.channel_name
                                };
                            });
                        } catch (error) {
                            console.log("🚀 ~ filterModal ~ error:", error)
                        }
                    } else {
                        try {
                            const req = await services.getUser(self.token_header);
                            self.data_users_2 = req.data.data.map(item => {
                                const existingProduct = self.filter_users_2.find(prod => prod.name === item);

                                return {
                                    check_value: existingProduct ? existingProduct.check_value : false,
                                    name: item
                                };
                            });
                        } catch (error) {
                            console.log("🚀 ~ filterModal ~ error:", error)
                        }
                    }
                } else if (tableSession === 3) {
                    if (value === 'ร้าน') {
                        try {
                            let data = {}
                            const req = await services.getShopTT(data, self.token_header);
                            self.data_products_3 = req.data.data.map(item => {
                                const existingProduct = self.filter_products_3.find(prod => prod.name === item.shop_name);

                                return {
                                    check_value: existingProduct ? existingProduct.check_value : false,
                                    name: item.shop_name
                                };
                            });
                        } catch (error) {
                            console.log("🚀 ~ filterModal ~ error:", error)
                        }
                    } else if (value === 'เรื่องการละเมิด') {
                        try {
                            self.data_channel_3 = self.matter_story.map(item => {
                                const existingProduct = self.filter_channel_3.find(prod => prod.name === item.name);

                                return {
                                    check_value: existingProduct ? existingProduct.check_value : false,
                                    name: item.name
                                };
                            });
                        } catch (error) {
                            console.log("🚀 ~ filterModal ~ error:", error)
                        }
                    } else {
                        try {
                            const req = await services.getUser(self.token_header);
                            self.data_users_3 = req.data.data.map(item => {
                                const existingProduct = self.filter_users_3.find(prod => prod.name === item);

                                return {
                                    check_value: existingProduct ? existingProduct.check_value : false,
                                    name: item
                                };
                            });
                        } catch (error) {
                            console.log("🚀 ~ filterModal ~ error:", error)
                        }
                    }
                } else {
                     if (value === 'ช่องทาง') {
                        try {
                            let data = {}
                            const req = await services.getShopTT(data, self.token_header);
                            self.data_channel_4 = req.data.data.map(item => {
                                const existingProduct = self.filter_channel_4.find(prod => prod.name === item.shop_name);

                                return {
                                    check_value: existingProduct ? existingProduct.check_value : false,
                                    name: item.shop_name
                                };
                            });
                        } catch (error) {
                            console.log("🚀 ~ filterModal ~ error:", error)
                        }
                    } else if (value === 'สินค้า') {
                        try {
                            const req = await services.getProductAll(self.token_header);
                            self.data_products_4 = req.data.data.map(item => {
                                const existingProduct = self.filter_products_4.find(prod => prod.name === item.product_name);

                                return {
                                    check_value: existingProduct ? existingProduct.check_value : false,
                                    name: item.product_name
                                };
                            });
                        } catch (error) {
                            console.log("🚀 ~ filterModal ~ error:", error)
                        }
                    } else if (value === 'ผู้ดูแล') {
                        try {
                            const req = await services.getUser(self.token_header);
                            self.data_users_4 = req.data.data.map(item => {
                                const existingProduct = self.filter_users_4.find(prod => prod.name === item);

                                return {
                                    check_value: existingProduct ? existingProduct.check_value : false,
                                    name: item
                                };
                            });
                        } catch (error) {
                            console.log("🚀 ~ filterModal ~ error:", error)
                        }
                    } else {
                        try {
                            self.data_star_4 = self.dataEditStars.map(item => {
                                const existingProduct = self.filter_star_4.find(prod => prod.name === item.name);

                                return {
                                    check_value: existingProduct ? existingProduct.check_value : false,
                                    name: item.name
                                };
                            });      
                        } catch (error) {
                            console.log("🚀 ~ filterModalVDO ~ error:", error)
                        }
                    }
                }
            },
            closeModalFilter() {
                $('#filter_model').modal('hide')
                if (this.modal_session === 1) {
                    this.data_products = []
                    this.data_channel = []
                    this.data_users = []
                } else if (this.modal_session === 2) {
                    this.data_products_2 = []
                    this.data_channel_2 = []
                    this.data_users_2 = []
                } else if (this.modal_session === 3) {
                    this.data_products_3 = []
                    this.data_channel_3 = []
                    this.data_users_3 = []
                } else {
                    this.data_products_4 = []
                    this.data_channel_4 = []
                    this.data_users_4 = []
                    this.data_star_4 = []
                }

            },
            async saveFilter() {
                const self = this

                function addOrRemoveItem(filterArray, item) {
                    console.log("🚀 ~ addOrRemoveItem ~ filterArray:", filterArray)
                    const index = filterArray.findIndex(existingItem => existingItem.name === item.name);
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
                    if (self.modal_titles === 'สินค้า') {
                        self.data_products.forEach(item => addOrRemoveItem(self.filter_products, item));
                    } else if (self.modal_titles === 'ช่องทาง') {
                        self.data_channel.forEach(item => addOrRemoveItem(self.filter_channel, item));
                    } else {
                        self.data_users.forEach(item => addOrRemoveItem(self.filter_users, item));
                    }
                    self.data_products = []
                    self.data_channel = []
                    self.data_users = []
                    $('#filter_model').modal('hide')

                    await self.loadDataClip()
                } else if (self.modal_session === 2) {
                    if (self.modal_titles === 'ชื่อสินค้า') {
                        self.data_products_2.forEach(item => addOrRemoveItem(self.filter_products_2, item));
                    } else if (self.modal_titles === 'ช่องทาง') {
                        self.data_channel_2.forEach(item => addOrRemoveItem(self.filter_channel_2, item));
                    } else {
                        self.data_users_2.forEach(item => addOrRemoveItem(self.filter_users_2, item));
                    }
                    self.data_products_2 = []
                    self.data_channel_2 = []
                    self.data_users_2 = []
                    $('#filter_model').modal('hide')

                    await self.loadDataProductChannel()
                } else if (self.modal_session === 3) {
                    if (self.modal_titles === 'ร้าน') {
                        self.data_products_3.forEach(item => addOrRemoveItem(self.filter_products_3, item));
                    } else if (self.modal_titles === 'เรื่องการละเมิด') {
                        self.data_channel_3.forEach(item => addOrRemoveItem(self.filter_channel_3, item));
                    } else {
                        self.data_users_3.forEach(item => addOrRemoveItem(self.filter_users_3, item));
                    }
                    self.data_products_3 = []
                    self.data_channel_3 = []
                    self.data_users_3 = []
                    $('#filter_model').modal('hide')

                    await self.loadDataReview()
                } else {
                    if (self.modal_titles === 'ช่องทาง') {
                        self.data_channel_4.forEach(item => addOrRemoveItem(self.filter_channel_4, item));
                    } else if (self.modal_titles === 'สินค้า') {
                        self.data_products_4.forEach(item => addOrRemoveItem(self.filter_products_4, item));
                    } else if (self.modal_titles === 'ผู้ดูแล') {
                        self.data_users_4.forEach(item => addOrRemoveItem(self.filter_users_4, item));
                    } else {
                        self.data_star_4.forEach(item => addOrRemoveItem(self.filter_star_4, item));
                    }
                    self.data_products_4 = []
                    self.data_channel_4 = []
                    self.data_users_4 = []
                    self.data_star_4 = []
                    $('#filter_model').modal('hide')

                    await self.loadDataReviewTb2()
                }

            },


            async onSaveModal() {
                try {
                    let data = {
                        "id": this.data_edit.id || '',
                        "action": this.selectedAction || ""
                    };
                    let response = await services.getUpdateActionReviewNegativeHandler(data, this.token_header);
                    if (response.data.code === 200) {
                        await this.loadDataReviewTb2(); // ใช้ this แทน self
                    }
                } catch (error) {
                    console.log("🚀 ~ onSaveModal ~ error:", error);
                }
                $('#staticBackdrop').modal('hide');
            },

            resetCheckValue() {
                const self = this

                if (self.modal_session === 1) {
                    if (self.modal_titles === 'สินค้า') {
                        this.data_products.forEach(item => item.check_value = false);
                    } else if (self.modal_titles === 'ช่องทาง') {
                        this.data_channel.forEach(item => item.check_value = false);
                    } else {
                        this.data_users.forEach(item => item.check_value = false);
                    }
                } else if (self.modal_session === 2) {
                    if (self.modal_titles === 'ชื่อสินค้า') {
                        this.data_products_2.forEach(item => item.check_value = false);
                    } else if (self.modal_titles === 'ช่องทาง') {
                        this.data_channel_2.forEach(item => item.check_value = false);
                    } else {
                        this.data_users_2.forEach(item => item.check_value = false);
                    }
                } else if (self.modal_session === 3) {
                    if (self.modal_titles === 'ชื่อสินค้า') {
                        this.data_products_3.forEach(item => item.check_value = false);
                    } else if (self.modal_titles === 'ช่องทาง') {
                        this.data_channel_3.forEach(item => item.check_value = false);
                    } else {
                        this.data_users_3.forEach(item => item.check_value = false);
                    }
                } else {
                    if (self.modal_titles === 'ช่องทาง') {
                        this.data_channel_4.forEach(item => item.check_value = false);
                    } else if (self.modal_titles === 'สินค้า') {
                        this.data_products_4.forEach(item => item.check_value = false);
                    } else if (self.modal_titles === 'ผู้ดูแล') {
                        this.data_users_4.forEach(item => item.check_value = false);
                    } else {
                        this.data_star_4.forEach(item => item.check_value = false);
                    }
                }

            },

            async DefaultData() {
                const self = this;
                try {
                    await self.loadDataClip()
                    await self.loadDataReview()
                    await self.loadDataReviewTb2()
                    await self.loadDataProductChannel()
                    await self.loadChannel()
                    await self.loadDailySum()
                } catch (error) {
                    console.log("🚀 ~ DefaultData ~ error:", error)

                } finally {

                }
            }

        },

        mounted: function () {
            let self = this
            self.init()

            self.DefaultData()
            console.log("ok")
        }


    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
