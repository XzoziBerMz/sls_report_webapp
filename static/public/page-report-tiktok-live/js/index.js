(function ($, window, Vue, axios) {
    'use strict';
    const token_header = getCookie('token');

    const app = Vue.createApp({
        data: function () {
            return {
                ...window.webUtils.data || {},
                user: window.user || "",
                currentPage: 'report-tiktoklive',
                currentPages: 1,
                authstatus: window.authstatus,
                datas: [],
                from_date: null,
                to_date: null,
                inventoryDetail: [],
                search: "",
                filtered: [],
                dataOrder: [],
                dataOrderManual: [],
                perPage: 10,
                totalPages: 1,
                sortField: 'user',
                sortOrder: 'asc',
                user: "",
                customer: "",
                product: "",
                order_no: "",
                chanel: "",
                note: "",
                serach_value: '',
                modal_titles: "",
                column_order_by: "shop_name",
                order_sort: "desc",
                token_header: token_header || '',
                data_users_2: [],
                data_products_2: [],
                data_channel_2: [],
                filter_products_2: [],
                filter_channel_2: [],
                filter_users_2: [],
            }
        },

        computed: {
            paginationRange() {
                let startPage, endPage;
                const maxPages = 5; // Number of pages to show

                if (this.totalPages <= maxPages) {
                    // If total pages are less than or equal to maxPages, show all pages
                    startPage = 1;
                    endPage = this.totalPages;
                } else {
                    // Calculate the start and end page numbers
                    const halfMaxPages = Math.floor(maxPages / 2);
                    if (this.currentPages <= halfMaxPages) {
                        startPage = 1;
                        endPage = maxPages;
                    } else if (this.currentPages + halfMaxPages >= this.totalPages) {
                        startPage = this.totalPages - maxPages + 1;
                        endPage = this.totalPages;
                    } else {
                        startPage = this.currentPages - halfMaxPages;
                        endPage = this.currentPages + halfMaxPages;
                    }
                }

                // Generate an array of pages to be displayed
                return Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i);
            }
        },
        methods: {
            ...window.webUtils.method || {},
            async init() {
                let self = this

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

                            await self.loadData();
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

                            await self.loadData();
                        }
                    },
                });

            },
            async DefaultData() {
                const self = this;

                const fromDatePicker = $("#kt_td_picker_basic_input").flatpickr({
                    dateFormat: "d/m/Y",
                    maxDate: "today",
                    placeholder: "Select a date",
                    onChange: async function (selectedDates, dateStr, instance) {
                        // Set the date in "Y-m-d" format for backend use, but not for input display
                        self.from_date = instance.formatDate(selectedDates[0], "Y-m-d") + ' 00:00:00';

                        // Update maxDate of the existing flatpickr instance for #floatingInputTo
                        toDatePicker.set('minDate', selectedDates[0]);

                        if (self.to_date && new Date(self.from_date) > new Date(self.to_date)) {
                            // Reset the input field for end date and clear the value
                            toDatePicker.clear();
                            self.to_date = ""; // Reset the variable holding end date
                        }
                        await self.loadData();
                    }
                });
                const toDatePicker = $("#kt_td_picker_basic_input_to").flatpickr({
                    dateFormat: "d/m/Y", // Ensure this is set correctly
                    maxDate: "today",
                    onChange: async function (selectedDates, dateStr, instance) {
                        // Set the date in "Y-m-d" format for backend use, but not for input display
                        self.to_date = instance.formatDate(selectedDates[0], "Y-m-d") + ' 23:59:59';

                        if (self.from_date && new Date(self.to_date) < new Date(self.from_date)) {
                            // Reset the start date input field and clear the value
                            fromDatePicker.clear();
                            self.from_date = ""; // Reset the variable holding start date
                        }

                        await self.loadData();
                    }
                });
            },

            async loadData() {
                const self = this;
                try {
                    showLoading();
                    const channelNames = self.filter_channel_2.map((item) => item.name);
                 
                    let data = {
                        shops: channelNames || [],
                        "start_at": self.startDate,
                        "end_at": self.endDate,
                        "search": self.serach_value,
                        "page": self.currentPages,
                        per_page: +self.perPage,
                        "order": self.column_order_by,
                        "order_by": self.order_sort
                    };
                    const responseGetOrderManual = await services.getOrderManual(data, self.token_header);
                    const response = responseGetOrderManual?.data || {};
                    self.dataOrderManual = response.data || [];
                    const totalItems = response.total || 0;
                    self.totalPages = Math.ceil(totalItems / +self.perPage);
                    closeLoading();
                } catch (error) {
                    console.warn("Error loading data:", error);
                    closeLoading();
                }
            },
            handleSearch() {
                // Reset pagination to the first page when a new search is triggered
                this.currentPages = 1;
                this.loadData();
            },
            handleBlur() {
                // Trigger search when the input loses focus
                this.handleSearch();
            },

            async sortTable(column) {
                if (this.column_order_by === column) {
                    this.order_sort = this.order_sort === 'asc' ? 'desc' : 'asc';
                } else {
                    this.column_order_by = column;
                    this.order_sort = 'asc';
                }
                await this.loadData();
            },
            getSortIcon(column) {
                const self = this;
                if (self.column_order_by !== column) {
                    return "bi-chevron-down";  // Default down icon
                }
                return self.order_sort === "asc" ? "bi-chevron-up" : "bi-chevron-down";
            },


            goToPage(page) {
                if (page < 1 || page > this.totalPages) return;
                this.currentPages = page;
                this.loadData();
            },



            async filterModal(value) {
                const self = this;
                self.modal_titles = value
                $('#filter_model').modal('show')
                if (value === "ชื่อสินค้า") {
                    try {
                        const req = await services.getmanual(self.token_header);
                        self.data_products_2 = req.data.data.map((item) => {
                            const existingProduct = self.filter_products_2.find(
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
                } else if (value === "ช่องทาง") {
                    try {
                        const req = await services.getChannelAll(self.token_header);
                        self.data_channel_2 = req.data.data.map((item) => {
                            const existingProduct = self.filter_channel_2.find(
                                (prod) => prod.name === item);

                            return {
                                check_value: existingProduct
                                    ? existingProduct.check_value
                                    : false,
                                name: item
                            };
                        });
                    } catch (error) {
                        console.log("🚀 ~ filterModal ~ error:", error);
                    }
                } else {
                    try {
                        const req = await services.getusermanual(self.token_header);
                        self.data_users_2 = req.data.data.map((item) => {
                            const existingProduct = self.filter_users_2.find(
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
            resetCheckValue() {
                const self = this

                if (self.modal_titles === "ชื่อสินค้า") {
                    this.data_products_2.forEach((item) => (item.check_value = false));
                } else if (self.modal_titles === "ช่องทาง") {
                    this.data_channel_2.forEach((item) => (item.check_value = false));
                } else {
                    this.data_users_2.forEach((item) => (item.check_value = false));
                }
            },
            async saveFilter() {
                const self = this

                function addOrRemoveItem(filterArray, item) {
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
                if (self.modal_titles === "ชื่อสินค้า") {
                    self.data_products_2.forEach((item) =>
                        addOrRemoveItem(self.filter_products_2, item)
                    );
                } else if (self.modal_titles === "ช่องทาง") {
                    self.data_channel_2.forEach((item) =>
                        addOrRemoveItem(self.filter_channel_2, item)
                    );
                } else {
                    self.data_users_2.forEach((item) =>
                        addOrRemoveItem(self.filter_users_2, item)
                    );
                }
                self.data_products_2 = [];
                self.data_channel_2 = [];
                self.data_users_2 = [];
                $("#filter_model").modal("hide");

                await self.loadData();

            },
            closeModalFilter() {
                $('#filter_model').modal('hide')
                this.data_products_2 = [];
                this.data_channel_2 = [];
                this.data_users_2 = [];
            }

        },
        mounted: function () {
            const self = this

            self.loadData();
            self.DefaultData();

            self.init();
            console.log("Component mounted and data loaded");
        }
    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
