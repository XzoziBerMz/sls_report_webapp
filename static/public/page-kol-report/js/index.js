(function ($, window, Vue, axios) {
    'use strict';
    const token_header = getCookie('token');

    const app = Vue.createApp({
        data: function () {
            return {
                ...window.webUtils.data || {},
                user: window.user || "",
                currentPage: 'kol_report',
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
                serach_value: "",
                startFormDate: null,
                endFormDate: null,
                modal_titles: "",
                modal_titles_sub: "",
                column_order_by: "p_date",
                order_sort: "desc",
                token_header: token_header || '',
                SelectTotalItems: 0,
                datLog: [],
                totallog: 0,
                currentPagelog: 1,
                perPagelog: 10,
                itemsPerPageLog: 10,
                id_log: '',
                data_edit: {},
                data_users: [],
                data_products: [],
                data_contact: [],
                filter_products: [],
                filter_contact: [],
                filter_users: [],
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
            totalPageLog() {
                return Math.ceil(this.totallog / this.itemsPerPageLog);
            },
            pagesLog() {
                const pages = [];
                const maxPages = 5;
                const startPage = Math.max(
                    1,
                    this.currentPagelog - Math.floor(maxPages / 2)
                );
                const endPage = Math.min(this.totalPageLog, startPage + maxPages - 1);
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

                        self.currentPages = 1
                        await self.loadData();
                        // $('#page_size_select').val(10).trigger('change');
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
                        self.currentPages = 1
                        await self.loadData();
                        // $('#page_size_select').val(10).trigger('change');
                    }
                });

                $('#page_size_select').on("change.custom", async function () {
                    const selectedValue = $(this).val(); // Get the selected value
                    self.perPage = selectedValue || 10
                    self.currentPages = 1
                    await self.loadData();
                })

                $("#page_size_log").on("change.custom", async function () {
                    const selectedValue = $(this).val(); // Get the selected value
                    self.itemsPerPageLog = selectedValue || 10;
                    self.currentPagelog = 1;
                    await self.loadDataLog(self.id_log);
                });

            },
            formatNumber(number) {
                if (typeof number === "number") {
                    return number.toLocaleString(); // Format number with commas
                }
                return number; // Return as is if not a number
            },
            displayContactStatus(status) {
                const statusMapping = {
                    contacted: 'ติดต่อได้',
                    not_contacted: 'ติดต่อไม่ได้',
                    reject: 'ปฏิเสธ'
                };
                return statusMapping[status] || '';
            },
            getContactStatusClass(status) {
                return {
                    'text-success': status === 'contacted',
                    'text-warning': status === 'not_contacted',
                    'text-danger': status === 'reject'
                };
            },
            getStatusClass(status) {
                return {
                    'text-success': status === 'clip_done',
                    'text-warning': ['wait_clip', 'wait_rate'].includes(status),
                    'text-info': status === 'wait_address',
                    'text-primary': ['wait_gen_code', 'wait_gen_new_code'].includes(status),
                    'text-danger': status === 'new_clip'
                };
            },
            displayProductStatus(status) {
                const statusMapping = {
                    clip_done: 'ทำคลิปแล้ว',
                    wait_clip: 'รอทำคลิป',
                    wait_address: 'รอที่อยู่',
                    wait_rate: 'รอเรท',
                    wait_gen_code: 'รอเจนโค้ด',
                    wait_gen_new_code: 'รอเจนใหม่',
                    new_clip: 'ทำคลิปใหม่'
                };
                return statusMapping[status] || '';
            },

            async loadData() {
                const self = this;
                try {
                    showLoading();

                    const productNames = self.filter_products.map((item) => item.name);
                    const contactNames = self.filter_contact.map((item) => item.name);
                    const usersNames = self.filter_users.map((item) => item.name);

                    let data = {
                        "kol_status": [],
                        "product_status": productNames || [],
                        "contact_status": contactNames || [],
                        "user": usersNames || [],
                        "start_at": self.startFormDate,
                        "end_at": self.endFormDate,
                        "search": self.serach_value,
                        "page": self.currentPages,
                        "per_page": parseInt(self.perPage),
                        "order": self.column_order_by,
                        "order_by": self.order_sort
                    };
                    const responseGetOrderManual = await services.getOrderManual(data, self.token_header);
                    const response = responseGetOrderManual?.data || {};
                    self.dataOrderManual = response.data || [];
                    const totalItems = response.total || 0;
                    self.SelectTotalItems = response.total || 0;
                    self.totalPages = Math.ceil(totalItems / +self.perPage);
                    closeLoading();
                } catch (error) {
                    console.warn("Error loading data:", error);
                    closeLoading();
                }
            },
            async handleSearch() {
                this.currentPages = 1;
                await this.loadData();
            },
            handleBlur() {
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

            onEditData(item) {
                const self = this;
                self.data_edit = { ...item }
                $("#kt_modal_edit").modal("show");
                $('#select_status').on("change.custom", async function () {
                    const selectedValue = $(this).val();
                    self.data_edit.contact_status = selectedValue
                }).val(self.data_edit.contact_status).trigger('change');
                $('#select_product').on("change.custom", async function () {
                    const selectedValue = $(this).val();
                    self.data_edit.product_status = selectedValue
                }).val(self.data_edit.product_status).trigger('change');
            },
            async onSaveEdit() {
                const self = this;
                let validator = self.validateForm();
                validator.validate().then(async function (status) {
                    if (status === 'Valid') {
                        showLoading();
                        try {
                            let data = {
                                "id": self.data_edit.id || '',
                                "date": self.data_edit.date,
                                "name_kol": self.data_edit.name_kol || "",
                                "tiktok_channel_url": self.data_edit.tiktok_channel_url || "",
                                "kol_status": self.data_edit.kol_status || "",
                                "address": self.data_edit.address || "",
                                "contact_number": self.data_edit.contact_number || "",
                                "video_link": self.data_edit.video_link || "",
                                "gen_code": self.data_edit.gen_code || "",
                                "vd_code": self.data_edit.vd_code || "",
                                "contact_status": self.data_edit.contact_status || "",
                                "product_status": self.data_edit.product_status || "",
                                "note": self.data_edit.note || "",
                                // "user": "example_user"
                            }
                            const req = await services.updateData(data, self.token_header)
                            if (req.status === 200) {
                                Swal.fire({
                                    title: 'บันทึกสำเร็จ',
                                    icon: 'success',
                                    confirmButtonText: 'ตกลง'
                                }).then(async (result) => {
                                    if (result.isConfirmed) {
                                        $("#kt_modal_edit").modal("hide");
                                        self.data_edit = {}
                                        await self.loadData();
                                    }
                                });
                            }
                        } catch (error) {
                            console.log("🚀 ~ error:", error)
                            closeLoading();
                        }
                    } else {
                        console.log("Form is not valid, please correct the errors.");
                        closeLoading();
                    }
                }).catch(function (error) {
                    console.error("Validation error:", error);
                });

                self.validator = validator;

            },
            async onLogData(item) {
                $("#kt_modal_log").modal("show");
                const id = item
                this.id_log = id

                $('#page_size_log').val(10).trigger('change');
                // await self.loadDataLog(id)

            },
            async loadDataLog(value) {
                try {
                    let data = {
                        service: "sls_kol",
                        id_ref: this.id_log,
                        page: this.currentPagelog,
                        per_page: Number(this.itemsPerPageLog),
                    };

                    const responseGetLog = await services.getlog(data, this.token_header);
                    this.datLog = responseGetLog.data.data || {};

                    this.totallog = responseGetLog.data.total;
                } catch (error) {
                    console.warn("Error loading data:", error);
                }
            },
            changePageLog(page) {
                if (
                    page !== this.currentPagelog &&
                    page > 0 &&
                    page <= this.totalPageLog
                ) {
                    this.currentPagelog = page;
                    this.loadDataLog(this.id_log);
                }
            },
            validateForm() {
                const form = document.getElementById('kt_docs_formvalidation_text');
                if (this.validator) {
                    this.validator.resetForm();
                    // this.validator.destroy();
                }
                const validator = FormValidation.formValidation(
                    form,
                    {
                        fields: {
                            'select_status': {
                                validators: {
                                    notEmpty: {
                                        message: 'สถานะการ ต้องมีข้อมูล'
                                    }
                                }
                            },
                            'select_product': {
                                validators: {
                                    notEmpty: {
                                        message: 'รับสินค้าแล้ว ต้องมีข้อมูล'
                                    }
                                }
                            }
                        },
                        plugins: {
                            trigger: new FormValidation.plugins.Trigger(),
                            bootstrap: new FormValidation.plugins.Bootstrap5({
                                rowSelector: '.fv-row',
                                eleInvalidClass: '',
                                eleValidClass: ''
                            })
                        }
                    }
                );
                
                return validator;
            },

            async filterModal(value, title) {
                const self = this;
                self.modal_titles = value
                self.modal_titles_sub = title
                $('#filter_model').modal('show')
                if (value === "contact_status") {
                    try {
                        const req = await services.getStatus(self.token_header);
                        self.data_contact = req.data.data.map((item) => {
                            const existingProduct = self.filter_contact.find(
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
                } else if (value === "product_status") {
                    try {
                        const req = await services.getProduct(self.token_header);
                        self.data_products = req.data.data.map((item) => {
                            const existingProduct = self.filter_products.find(
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
                        const req = await services.getUsers(self.token_header);
                        self.data_users = req.data.data.map((item) => {
                            const existingProduct = self.filter_users.find(
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

                if (self.modal_titles === "contact_status") {
                    this.data_contact.forEach((item) => (item.check_value = false));
                } else if (self.modal_titles === "product_status") {
                    this.data_products.forEach((item) => (item.check_value = false));
                } else {
                    this.data_users.forEach((item) => (item.check_value = false));
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
                if (self.modal_titles === "contact_status") {
                    self.data_contact.forEach((item) =>
                        addOrRemoveItem(self.filter_contact, item)
                    );
                } else if (self.modal_titles === "product_status") {
                    self.data_products.forEach((item) =>
                        addOrRemoveItem(self.filter_products, item)
                    );
                } else {
                    self.data_users.forEach((item) =>
                        addOrRemoveItem(self.filter_users, item)
                    );
                }
                self.data_products = [];
                self.data_contact = [];
                self.data_users = [];
                $("#filter_model").modal("hide");

                $('#page_size_select').val(10).trigger('change');
                // await self.loadData();

            },
            closeModalFilter() {
                $('#filter_model').modal('hide')
                this.data_contact = [];
                this.data_products = [];
                this.data_users = [];
            }

        },
        mounted: async function () {
            const self = this

            await self.init();
            await self.loadData();

            console.log("Component mounted and data loaded");
        }
    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
