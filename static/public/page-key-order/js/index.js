(function ($, window, Vue, axios) {
    'use strict';

    const app = Vue.createApp({
        data: function () {
            return {
                user: window.user || "",
                currentPage: 1,
                authstatus: window.authstatus,
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                dataOrder: [],
                dataOrderManual: [],
                perPage: 10,
                totalPages: 1,
                sortField: 'user', // Default sort field
                sortOrder: 'asc'   // Default sort order
            }
        },
        methods: {
            async loadData() {
                try {
                    let data = {
                        search: this.search,
                        customer: '',
                        product: '',
                        order_no: '',
                        chanel: '',
                        note: '',
                        user: '',
                        page: this.currentPage,
                        per_page: +this.perPage,
                        order: this.sortField,
                        order_by: this.sortOrder
                    };

                    // Make API call to fetch order data
                    const responseGetOrderManual = await services.getOrderManual(data);
                    const response = responseGetOrderManual?.data || {};
                    this.dataOrderManual = response.data || [];

                    // Calculate total pages based on the total items returned by the API
                    const totalItems = response.total || 0;
                    this.totalPages = Math.ceil(totalItems / +this.perPage);
                } catch (error) {
                    console.warn("Error loading data:", error);
                }
            },
            onSearchInput() {
                console.log("Search input changed to:", this.search); // Debugging line
                this.currentPage = 1; // Reset to the first page on new search
                this.loadData();
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
            console.log("Component mounted and data loaded");
        }
    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
