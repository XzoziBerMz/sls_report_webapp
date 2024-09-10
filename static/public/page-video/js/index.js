(function ($, window, Vue, axios) {
    'use strict';

    const token_header = getCookie('token');
    const app = Vue.createApp({
        data: function () {
            return {
                ...window.webUtils.data || {},
                user: window.user || "",
                currentPage: 'video',
                authstatus: window.authstatus,
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                dataOrder: [],
                currentPages: 1,
                itemsPerPage: 10,
                totalItems: 0,
                column_order_by: "p_date",
                order_sort: "desc",
                serach_value: '',
                isEnterPressed: false,
                token_header: token_header || '',
                filter_products: [],
                filter_channel: [],
                filter_users: [],
                data_products: [],
                data_channel: [],
                data_users: [],
                modal_titles: '',
                startFormDate: null,
                endFormDate: null,
                formData: {
                    marwellsoy24: '',
                    lookjeab: '',
                    goodSup: '',
                    somchai: '',
                    kaopan: '',
                    meemong: '',
                    marwell224: '',
                    tt5: '',
                    littleCactus: '',
                    ketoFood: '',
                    supplement: '',
                    marineeY: '',
                    tt6: '',
                    myorder: '',
                    lineOa: '',
                },
                errors: {
                    marwellsoy24: '',
                    lookjeab: '',
                    goodSup: '',
                    somchai: '',
                    kaopan: '',
                    meemong: '',
                    marwell224: '',
                    tt5: '',
                    littleCactus: '',
                    ketoFood: '',
                    supplement: '',
                    marineeY: '',
                    tt6: '',
                    myorder: '',
                    lineOa: '',
                }
            }
        },
        computed: {
            iconClass() {
                return this.isExpanded ? 'bi-dash-lg' : 'bi-plus-lg';
            },
            totalPages() {
                return Math.ceil(this.totalItems / this.itemsPerPage);
            },
            pages() {
                const pages = [];
                const maxPages = 5;
                const startPage = Math.max(1, this.currentPages - Math.floor(maxPages / 2));
                const endPage = Math.min(this.totalPages, startPage + maxPages - 1);

                for (let page = startPage; page <= endPage; page++) {
                    pages.push(page);
                }

                // Add ellipsis for start
                // if (startPage > 1) {
                //   pages.unshift('...');
                // }

                // // Add ellipsis for end
                // if (endPage < this.totalPages) {
                //   pages.push('...');
                // }

                return pages;
            }
        },
        methods: {
            ...window.webUtils.method || {},
            async init() {
                let self = this
                try {
                    await self.loadDataOrder();

                    $('#page_size_select').on("change.custom", async function () {
                        const selectedValue = $(this).val(); // Get the selected value
                        self.itemsPerP1age = selectedValue || 10
                        await self.loadDataOrder();
                    })
                } catch (error) {
                    console.log("🚀 ~ init ~ error:", error)

                } finally {
                    const fromDatePicker = $("#floatingInputFrom").flatpickr({
                        dateFormat: "d/m/Y",
                        maxDate: "today",
                        onChange: async function (selectedDates, dateStr, instance) {
                            // Set the date in "Y-m-d" format for backend use, but not for input display
                            self.startFormDate = instance.formatDate(selectedDates[0], "Y-m-d") + ' 00:00:00';

                            // Update maxDate of the existing flatpickr instance for #floatingInputTo
                            toDatePicker.set('maxDate', selectedDates[0]);

                            if (self.endFormDate && new Date(self.startFormDate) > new Date(self.endFormDate)) {
                                // Reset the input field for end date and clear the value
                                toDatePicker.clear();
                                self.endFormDate = ""; // Reset the variable holding end date
                            }

                            await self.loadDataOrder();
                        }
                    });

                    // Initialize Flatpickr for the end date input
                    const toDatePicker = $("#floatingInputTo").flatpickr({
                        dateFormat: "d/m/Y", // Ensure this is set correctly
                        maxDate: "today",
                        onChange: async function (selectedDates, dateStr, instance) {
                            // Set the date in "Y-m-d" format for backend use, but not for input display
                            self.endFormDate = instance.formatDate(selectedDates[0], "Y-m-d") + ' 23:59:59';

                            await self.loadDataOrder();
                        }
                    });
                }
            },

            restrictToNumbers(field) {
                // กรองเฉพาะตัวเลข
                this.formData[field] = this.formData[field].replace(/[^0-9]/g, '');
                // ถ้ามีการกรอกข้อมูลแล้วให้ลบข้อความ error
                if (this.formData[field]) {
                    this.clearError(field);
                }
            },
            clearError(field) {
                this.errors[field] = '';
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
                await this.loadDataOrder();
            },
            getSortIcon(column) {
                const self = this;
                if (self.column_order_by !== column) {
                    return "bi-chevron-down";  // Default down icon
                }
                return self.order_sort === "asc" ? "bi-chevron-up" : "bi-chevron-down";
            },
            changePage(page) {
                if (page < 1 || page > this.totalPages) return;
                this.currentPages = page;
                this.loadDataOrder();
            },
            searchData(event) {
                this.isEnterPressed = true;
                this.loadDataOrder();
                event.target.blur();
            },
            handleBlur() {
                if (!this.isEnterPressed) {
                    this.loadDataOrder();
                }
                this.isEnterPressed = false;
            },
            async loadDataOrder() {
                const self = this;
                try {
                    showLoading();
                    const productNames = self.filter_products.map(item => item.name);
                    const channelNames = self.filter_channel.map(item => item.name);
                    const usersNames = self.filter_users.map(item => item.name);

                    let data = {
                        "search": self.serach_value,
                        "start_at": self.startFormDate,
                        "end_at": self.endFormDate,
                        "product": productNames || [],
                        "chanel": channelNames || [],
                        "save_by": usersNames || [],
                        "page": self.currentPages,
                        "per_page": parseInt(self.itemsPerPage || 10),
                        "order": self.column_order_by,
                        "order_by": self.order_sort
                    }
                    let responseGetOrder = await services.getOrder(data, self.token_header);
                    const dataOrder = responseGetOrder?.data.data || [];
                    self.dataOrder = dataOrder;
                    self.totalItems = responseGetOrder.data.total;
                    closeLoading()

                } catch (error) {
                    console.warn(`🌦️ ~ onClickSearch ~ error:`, error);
                    closeLoading()
                }
            },
            async filterModal(value) {
                const self = this;



                self.modal_titles = value
                $('#filter_model').modal('show')

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
            },

            resetCheckValue() {
                const self = this

                if (self.modal_titles === 'สินค้า') {
                    this.data_products.forEach(item => item.check_value = false);
                } else if (self.modal_titles === 'ช่องทาง') {
                    this.data_channel.forEach(item => item.check_value = false);
                } else {
                    this.data_users.forEach(item => item.check_value = false);
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

                await self.loadDataOrder()
            },
            closeModalFilter() {
                $('#filter_model').modal('hide')
                this.data_products = []
                this.data_channel = []
                this.data_users = []
            }

        },
        watch: {
            itemsPerPage: {
                deep: true,
                async handler(newValue) {
                    this.currentPages = 1

                    await this.loadDataOrder();
                }
            }
        },
        mounted: function () {
            let self = this
            self.init()
            //    self.getPokemon()
            console.log("ok")
        }


    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
