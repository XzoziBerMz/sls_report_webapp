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
                currentPage: 'key-order',
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
                data_edit: [],
                dataMatterUpdate: [],
                dataUpdateAction: [],
                dataDailySum: {},
                totalItems: 0,
                perPage: 10,
                // totalPagesreview: 0,
                // totalPagesreview2: 0,
                column_order_by_r: 0,
                totalItemsreview: 0,
                totalItemsreview2: 0,
                currentPages: 1,
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
                column_order_by_r2: '',
                order_sort: "desc",
                order_sort_r: "desc",
                order_sort_r2: "desc",
                startDate: null,
                endDate: null,
                selectedAction: '',
                date_show: currentDateShow,
                dataEditStars: [
                    {
                        id: 1,
                        name: "ติดตามดาว",
                    },
                    {
                        id: 2,
                        name: "รอติดต้อเบอร์",
                    },
                    {
                        id: 3,
                        name: "ติดต่อไม่ได้/ไม่ได้รัยสาย",
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

            }
        },
        computed: {
            totalPages() {
                return Math.ceil(this.totalItems / this.perPage);
            },
            totalPagesreview() {
                return Math.ceil(this.totalItemsreview / this.itemsPerPagereview);
            },
            totalPagesreview2() {
                console.log("🚀 ~ totalPagesreview2 ~ Math.ceil(this.totalItemsreview2 / this.itemsPerPagereview2):", Math.ceil(this.totalItemsreview2 / this.itemsPerPagereview2))
                return Math.ceil(this.totalItemsreview2 / this.itemsPerPagereview2);
            },
            visiblePages() {
                let start = Math.max(1, this.currentPages - 2);
                let end = Math.min(this.totalPages, this.currentPages + 2);

                // Adjust start and end if there are fewer than 5 pages
                if (end - start + 1 < this.maxVisiblePages) {
                    if (this.currentPages <= 2) {
                        end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);
                    } else if (this.currentPages >= this.totalPages - 2) {
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
        },
        methods: {
            ...window.webUtils.method || {},
            async init() {
                let self = this

                $('#page_size_select_review_script').on("change.custom", async function () {
                    const selectedValue = $(this).val(); // Get the selected value
                    self.itemsPerPageScript = selectedValue || 10
                    await self.loadDataClip();
                })

                $('#page_size_select_review').on("change.custom", async function () {
                    const selectedValue = $(this).val(); // Get the selected value
                    self.itemsPerPage = selectedValue || 10
                    await self.loadDataReview();
                })

                $('#page_size_select_review2').on("change.custom", async function () {
                    const selectedValue = $(this).val(); // Get the selected value
                    self.itemsPerPage2 = selectedValue || 10
                    await self.loadDataReviewTb2();
                })

                self.flatpickr_dp_from_date = $("#kt_td_picker_basic_input").flatpickr({
                    static: true,
                    enableTime: false,
                    disableMobile: "true",
                    dateFormat: "Y-m-d",
                    maxDate: 'today',
                    onChange: async function (selectedDates, dateStr, instance) {
                        if (selectedDates.length) {
                            // Assign the start and end dates based on the selected date range
                            const selectedDate = selectedDates[0];

                            // Format the date to YYYY-MM-DD in local time zone
                            const year = selectedDate.getFullYear();
                            const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                            const day = String(selectedDate.getDate()).padStart(2, '0');

                            self.startDate = `${year}-${month}-${day}`;
                            console.log("🚀 ~ self.startDate:", self.startDate);
                            await self.DefaultData()

                        }
                    },
                });
                const currentDate = new Date();
                const formattedDate = currentDate.toISOString().slice(0, 10).replace('T', ' ');
                self.startDate = formattedDate
            },

            

            async loadDataClip(page = 1, per_page = 10) {
                const self = this;
                try {

                    const currentDate = new Date();
                    const formattedDate = currentDate.toISOString().slice(0, 10).replace('T', ' ') + ' 00:00:00';
                    const formattedDateEnd = currentDate.toISOString().slice(0, 10) + ' 23:59:59';

                    let formattedDatestart = self.startDate || new Date().toISOString().slice(0, 10); // Ensure you have a default value
                    let formattedStartDate = `${formattedDatestart} 00:00:00`;

                    let data = {
                        "search": "",
                        "start_at": formattedStartDate || formattedDate,
                        "end_at": formattedDateEnd,
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
                    self.currentPages = page; // Set the current page

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

                    const currentDate = new Date();
                    const formattedDate = currentDate.toISOString().slice(0, 10).replace('T', ' ') + ' 00:00:00';
                    const formattedDateEnd = currentDate.toISOString().slice(0, 10) + ' 23:59:59';

                    let formattedDatestart = self.startDate || new Date().toISOString().slice(0, 10); // Ensure you have a default value
                    let formattedStartDate = `${formattedDatestart} 00:00:00`;

                    let data = {

                        "start_at": formattedStartDate || formattedDate,
                        "end_at": formattedDateEnd,
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


                    const currentDate = new Date();
                    const formattedDate = currentDate.toISOString().slice(0, 10).replace('T', ' ') + ' 00:00:00';
                    const formattedDateEnd = currentDate.toISOString().slice(0, 10) + ' 23:59:59';

                    let formattedDatestart = self.startDate || new Date().toISOString().slice(0, 10); // Ensure you have a default value
                    let formattedStartDate = `${formattedDatestart} 00:00:00`;

                    let data = {

                        "start_at": formattedStartDate || formattedDate,
                        "end_at": formattedDateEnd,

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
                    // this.totalItemsreview2
                    self.totalPagesreview2 = responsegetTb2.data.total;

                } catch (error) {
                    console.warn(`🌦️ ~ loaddataReview ~ error:`, error);
                }
            },

            async loadDailySum() {
                try {
                    showLoading();

                    const currentDate = new Date().toISOString().slice(0, 10);
                    const startDateFormatted = new Date(this.startDate || currentDate).toISOString().slice(0, 10);
                    let data = {
                        "start_at": startDateFormatted,
                        "end_at": currentDate
                    };

                    const responseGetDailySum = await services.getDailySum(data, this.token_header);
                    const response = responseGetDailySum?.data || {};
                    this.dataDailySum = response.data || {};
                    console.log("🚀 ~ loadDailySum ~ this.dataDailySum:", this.dataDailySum)

                    closeLoading()
                } catch (error) {
                    console.warn("Error loading data:", error);
                    closeLoading()
                }
            },

            formatDate(date) {
                // แปลงวันที่เป็นรูปแบบที่ต้องการ: ปี-เดือน-วัน
                return new Date(date).toISOString().split('T')[0];
            },

            formatNumber(amount) {
                return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },

            modalEdit(data) {
                $('#staticBackdrop').modal('show');
                this.data_edit = { ...data };
            },

            async onSaveModal() {
                try {
                    let data = {
                        "id": this.data_edit.id || '',
                        "action": this.selectedAction || ""
                    };
                    let response = await services.getUpdateActionReviewNegativeHandler(data, this.token_header);
                    console.log("🚀 ~ onSaveModal ~ response.code:", response.data.code);
                    
                    if (response.data.code === 200) {
                        // เรียกใช้ loadDataReviewTb2 หลังจากบันทึกข้อมูลสำเร็จ
                        await this.loadDataReviewTb2(); // ใช้ this แทน self
                    }
                    
                    console.log("🚀 ~ onSaveModal ~ data:", data);
                } catch (error) {
                    console.log("🚀 ~ onSaveModal ~ error:", error);
                }
                
                console.log("🚀 ~ onSaveModal ~ this.data_edit:", this.data_edit);
                
                // ปิดโมดัล
                $('#staticBackdrop').modal('hide');
            }
            ,

            async DefaultData() {
                const self = this;
                try {
                    await self.loadDataClip()
                    await self.loadDataProductChannel()
                    await self.loadDataReview()
                    await self.loadDataReviewTb2()
                    // await self.loadDataApp()
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
