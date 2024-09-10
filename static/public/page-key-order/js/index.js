(function ($, window, Vue, axios) {
    'use strict';
    const token_header = getCookie('token');

    const app = Vue.createApp({
        data: function () {
            return {
                ...window.webUtils.data || {},
                user: window.user || "",
                currentPage: 'key-order',
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
                token_header: token_header || '',
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
                        toDatePicker.set('maxDate', selectedDates[0]);

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

                        await self.loadData();
                    }
                });
                // self.flatpickr_dp_from_date = $("#kt_td_picker_basic_input").flatpickr({
                //     static: true,
                //     enableTime: true,
                //     disableMobile: "true",
                //     dateFormat: "d/m/Y",
                //     onChange: function (selectedDates, dateStr, instance) {
                //         self.from_date = dateStr; // Update from_date
                //         self.loadData();           // Trigger data loading
                //     },
                // });
            },
            async DefaultDataTO() {
                const self = this;
                // self.flatpickr_dp_to_date = $("#kt_td_picker_basic_input_to").flatpickr({
                //     static: true,
                //     enableTime: true,
                //     disableMobile: "true",
                //     dateFormat: "d/m/Y",
                //     onChange: function (selectedDates, dateStr, instance) {
                //         self.to_date = dateStr; // Update to_date
                //         self.loadData();         // Trigger data loading
                //     },
                // });
            },
            async loadData() {
                try {
                    showLoading();
                    let data = {
                        search: this.search,
                        customer: this.customer || '', // Bind the search fields
                        product: this.product || '',
                        order_no: this.order_no || '',
                        chanel: this.chanel || '',
                        note: this.note || '',
                        user: this.user || '',
                        "start_at": this.from_date ? this.from_date : null,
                        "end_at": this.to_date ? this.to_date : null,
                        page: this.currentPages,
                        per_page: +this.perPage,
                        order: this.sortField,
                        order_by: this.sortOrder
                    };
        
                    const responseGetOrderManual = await services.getOrderManual(data, this.token_header);
                    const response = responseGetOrderManual?.data || {};
                    this.dataOrderManual = response.data || [];
        
                    const totalItems = response.total || 0;
                    this.totalPages = Math.ceil(totalItems / +this.perPage);
                    closeLoading()
                } catch (error) {
                    console.warn("Error loading data:", error);
                    closeLoading()
                }
            },
            onSearchInput() {
                console.log("Search input changed:", {
                    search: this.search,
                    customer: this.customer,
                    product: this.product,
                    order_no: this.order_no,
                    chanel: this.chanel,
                    note: this.note,
                    user: this.user
                }); // Debugging
                this.currentPages = 1; // Reset to the first page on new search
                this.loadData();      // Load data based on search input
            },
            goToPage(page) {
                if (page < 1 || page > this.totalPages) return;
                this.currentPages = page;
                this.loadData();
            },
            sortData(field) {
                // Toggle sort order if the same field is clicked
                if (this.sortField === field) {
                    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortField = field;
                    this.sortOrder = 'asc';
                }
                this.loadData();
            },
            getSortIcon(field) {
                if (this.sortField !== field) return '';
                return this.sortOrder === 'asc' ? 'bi-chevron-up' : 'bi-chevron-down';
            }
        },
        mounted: function () {
            this.loadData();
            this.DefaultData();
            this.DefaultDataTO();
            console.log("Component mounted and data loaded");
        }
    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
