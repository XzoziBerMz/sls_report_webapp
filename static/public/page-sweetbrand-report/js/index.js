(function ($, window, Vue, axios) {
    'use strict';
    const token_header = getCookie('token');

    const app = Vue.createApp({
        data: function () {
            return {
                ...window.webUtils.data || {},
                user: window.user || "",
                currentPage: 'sweetbrand_report',
                currentPages: 1,
                authstatus: window.authstatus,
                datas: [],
                from_date: null,
                to_date: null,
                inventoryDetail: [],
                search: "",
                filtered: [],
                dataOrder: [],
                data_ads: [],
                dataProduct: [],
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
                startFormDate: null,
                endFormDate: null,
                modal_titles: "",
                column_order_by: "p_date",
                order_sort: "desc",
                token_header: token_header || '',
                data_products_2: [],
                filter_products_2: [],
                valueProduct: [],
                SelectTotalItems: 0
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
            },
            TotalAdsTiktok() {
                return this.data_ads.reduce((sum, item) => sum + parseFloat(item.ads_tiktok_cost || 0), 0);
            },
            TotalTiktok() {
                return this.data_ads.reduce((sum, item) => sum + parseFloat(item.tiktok || 0), 0);
            },
            TotalAdsShopee() {
                return this.data_ads.reduce((sum, item) => sum + parseFloat(item.ads_shopee_cost || 0), 0);
            },
            TotalShopee() {
                return this.data_ads.reduce((sum, item) => sum + parseFloat(item.shopee || 0), 0);
            },
            TotalAdsLazada() {
                return this.data_ads.reduce((sum, item) => sum + parseFloat(item.ads_lazada_cost || 0), 0);
            },
            TotalLazada() {
                return this.data_ads.reduce((sum, item) => sum + parseFloat(item.lazada || 0), 0);
            },
        },
        methods: {
            ...window.webUtils.method || {},
            async init() {
                let self = this
                try {
                    const req = await services.getProduct(self.token_header)
                    self.dataProduct = req.data.data || []
                } catch (error) {
                    console.log("🚀 ~ init ~ error:", error)
                }

                await self.loadData();

                const fromDatePicker = $("#kt_td_picker_start_input").flatpickr({
                    dateFormat: "d/m/Y",
                    maxDate: "today",
                    onChange: async function (selectedDates, dateStr, instance) {
                        // Set the date in "Y-m-d" format for backend use, but not for input display
                        self.startFormDate = instance.formatDate(selectedDates[0], "Y-m-d") + ' 00:00:00';

                        // Update maxDate of the existing flatpickr instance for #floatingInputTo
                        toDatePicker.set('minDate', selectedDates[0]);

                        if (self.endFormDate && new Date(self.startFormDate) > new Date(self.endFormDate)) {
                            // Reset the input field for end date and clear the value
                            toDatePicker.clear();
                            self.endFormDate = ""; // Reset the variable holding end date
                        }

                        $('#page_size_select').val(10).trigger('change');
                        // await self.loadData();
                    }
                });

                // Initialize Flatpickr for the end date input
                const toDatePicker = $("#kt_td_picker_end_input").flatpickr({
                    dateFormat: "d/m/Y", // Ensure this is set correctly
                    maxDate: "today",
                    onChange: async function (selectedDates, dateStr, instance) {
                        // Set the date in "Y-m-d" format for backend use, but not for input display
                        self.endFormDate = instance.formatDate(selectedDates[0], "Y-m-d") + ' 23:59:59';

                        if (self.startFormDate && new Date(self.endFormDate) < new Date(self.startFormDate)) {
                            // Reset the start date input field and clear the value
                            fromDatePicker.clear();
                            self.startFormDate = ""; // Reset the variable holding start date
                        }

                        $('#page_size_select').val(10).trigger('change');
                        // await self.loadData();
                    }
                });

                $('#select_product').on("change.custom", async function () {
                    const values = $(this).select2("data") || [];
                    const selectedNames = values.map((item) => item.id);
                    self.valueProduct = selectedNames || []
                    $('#page_size_select').val(10).trigger('change');
                    // await self.loadData();
                });

                $('#page_size_select').on("change.custom", async function () {
                    const selectedValue = $(this).val(); // Get the selected value
                    self.perPage = selectedValue || 10
                    self.currentPages = 1
                    await self.loadData();
                })
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
            formatPercentage(ads, total) {
                if (total === 0) return '0.00%';
                const percentage = (ads / total) * 100;
                return percentage.toFixed(2) + '%';
            },
            async DefaultData() {
                const self = this;

            },

            async loadData() {
                const self = this;
                try {
                    showLoading();
                    let data = {
                        "start_at": self.startFormDate,
                        "end_at": self.endFormDate,
                        "search": self.serach_value,
                        "product_ids": self.valueProduct || [],
                        "page": parseInt(self.currentPages),
                        "per_page": parseInt(self.perPage),
                        "order": self.column_order_by,
                        "order_by": self.order_sort
                    };
                    const responseGetOrderManual = await services.getOrderManual(data, self.token_header);
                    const response = responseGetOrderManual?.data || {};
                    self.data_ads = response.data || [];
                    const totalItems = response.total || 0;
                    self.SelectTotalItems = response.total || 0;
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
                $('#page_size_select').val(10).trigger('change');
                // this.loadData();
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

            selectCheckValue(selectedIndex) {
                this.data_products_2.forEach((item, index) => {
                    item.check_value = index === selectedIndex;
                });
            },

            async filterModal(value) {
                const self = this;
                self.modal_titles = value
                $('#filter_model').modal('show')
                try {
                    // const req = await services.getmanual(self.token_header);
                    let data_status = [
                        "เปิดใช้งาน",
                        "ปิดใช้งาน"
                    ]
                    self.data_products_2 = data_status.map((item) => {
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
            },
            resetCheckValue() {
                const self = this
                this.data_products_2.forEach((item) => (item.check_value = false));
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
                self.data_products_2.forEach((item) =>
                    addOrRemoveItem(self.filter_products_2, item)
                );
                self.data_products_2 = [];
                $("#filter_model").modal("hide");

                await self.loadData();

            },
            closeModalFilter() {
                $('#filter_model').modal('hide')
                this.data_products_2 = [];
            }

        },
        mounted: function () {
            const self = this

            // self.loadData();
            // self.DefaultData();

            self.init();
            console.log("Component mounted and data loaded");
        }
    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
