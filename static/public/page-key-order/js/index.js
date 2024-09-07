(function ($, window, Vue, axios) {
    'use strict';
    const token_header = getCookie('token');

    const app = Vue.createApp({
        data: function () {
            return {
                user: window.user || "",
                currentPage: 1,
                authstatus: window.authstatus,
                datas: [],
                from_date: "",
                to_date: "",
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
        methods: {

            async DefaultData() {
                const self = this;
                self.flatpickr_dp_from_date = $("#kt_td_picker_basic_input").flatpickr({
                    static: true,
                    enableTime: true,
                    disableMobile: "true",
                    dateFormat: "Y-m-d",
                    onChange: function (selectedDates, dateStr, instance) {
                        self.from_date = dateStr; // Update from_date
                        self.loadData();           // Trigger data loading
                    },
                });
            },
            async DefaultDataTO() {
                const self = this;
                self.flatpickr_dp_to_date = $("#kt_td_picker_basic_input_to").flatpickr({
                    static: true,
                    enableTime: true,
                    disableMobile: "true",
                    dateFormat: "Y-m-d",
                    onChange: function (selectedDates, dateStr, instance) {
                        self.to_date = dateStr; // Update to_date
                        self.loadData();         // Trigger data loading
                    },
                });
            },
            async loadData() {
                try {
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
                        page: this.currentPage,
                        per_page: +this.perPage,
                        order: this.sortField,
                        order_by: this.sortOrder
                    };
        
                    const responseGetOrderManual = await services.getOrderManual(data, this.token_header);
                    const response = responseGetOrderManual?.data || {};
                    this.dataOrderManual = response.data || [];
        
                    const totalItems = response.total || 0;
                    this.totalPages = Math.ceil(totalItems / +this.perPage);
                } catch (error) {
                    console.warn("Error loading data:", error);
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
                this.currentPage = 1; // Reset to the first page on new search
                this.loadData();      // Load data based on search input
            },
            goToPage(page) {
                if (page < 1 || page > this.totalPages) return;
                this.currentPage = page;
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
