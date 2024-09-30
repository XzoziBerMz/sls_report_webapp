(function ($, window, Vue, axios) {
    'use strict';

    const token_header = getCookie('token');

    const app = Vue.createApp({
        data: function () {
            return {
                ...window.webUtils.data || {},
                user: window.user || "",
                currentPage: 'campaign_report',
                currentPageSub: 'campaign_tt',
                authstatus: window.authstatus,
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                dataProduct: [],
                dataShop: [],
                dataAds: [],
                token_header: token_header || '',
                errors: {},
                errors_date: {},
                errors_channel: {},
                start_date_time: null,
                end_date_time: null,
                valueDate_time: null,
                serach_value_name: [],
                value_channel: "Tiktok",
                value_channel_id: "CHANNEL_TIKTOK",
                dataName: [],
                startFormDate: null,
                endFormDate: null,

                currentPages: 1,
                itemsPerPage: 10,
                totalItems: 0,
            }
        },
        computed: {

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
                    // await self.created()
                    // await self.loadData()
                    try {
                        let data = {
                            "channel_id": self.value_channel_id || ''
                        }
                        const [req, req_name] = await Promise.all([
                            services.getShop(data, self.token_header),
                            services.getName(self.token_header)
                        ]);
                        self.dataShop = req.data.data || []
                        self.dataName = req_name.data.data.map(item => ({
                            id: item,
                            name: item
                        }));                        self.dataShop.sort((a, b) => a.shop_name.localeCompare(b.shop_name));
                        // self.dataAds.forEach(ad => {
                        //     ad.details.sort((a, b) => a.shop_name.localeCompare(b.shop_name));
                        // });
                        // await self.initSelectTable()
                        closeLoading()
                    } catch (error) {
                        console.log("🚀 ~ init ~ error:", error)
                        closeLoading()
                    }

                } catch (error) {
                    console.log("🚀 ~ init ~ error:", error)
                } finally {

                    $('#select_channel').on("change.custom", async function () {
                        showLoading();
                        const selectedValue = $(this).find("option:selected").text(); // Get the selected value
                        const selectedId = $(this).val();
                        self.value_channel = selectedValue || ''
                        self.value_channel_id = selectedId || ''

                        try {
                            let data = {
                                "channel_id": selectedId || ''
                            }
                            const req = await services.getShop(data, self.token_header)
                            self.dataShop = req.data.data || []
                            self.dataShop.sort((a, b) => a.shop_name.localeCompare(b.shop_name));
                            
                            // await self.initSelectTable()
                            await self.loadData()

                            self.dataAds.forEach(ad => {
                                ad.details.sort((a, b) => a.shop_name.localeCompare(b.shop_name));
                            });
                            closeLoading()
                        } catch (error) {
                            console.log("🚀 ~ init ~ error:", error)
                            closeLoading()
                        }
                    })
                    $('#select_name').on("change.custom", async function () {
                        // showLoading();
                        const values = $(this).select2("data") || [];
                        const selectedNames = values.map((item) => item.text);
                        self.serach_value_name = selectedNames;
                        await self.loadData()

                    })
                    $('#select_channel').val(self.value_channel_id).trigger('change')

                    $('#page_size_select').on("change.custom", async function () {
                        const selectedValue = $(this).val(); // Get the selected value
                        self.itemsPerPage = selectedValue || 10
                        self.currentPages = 1
                        await self.loadData();
                    })

                    const fromDatePicker = $("#kt_td_picker_start_input").flatpickr({
                        dateFormat: "d/m/Y",
                        maxDate: "today",
                        allowClear: true,
                        onChange: async function (selectedDates, dateStr, instance) {
                            // Set the date in "Y-m-d" format for backend use, but not for input display
                            self.startFormDate = instance.formatDate(selectedDates[0], "Y-m-d");

                            // Update maxDate of the existing flatpickr instance for #floatingInputTo
                            toDatePicker.set('minDate', selectedDates[0]);

                            if (self.endFormDate && new Date(self.startFormDate) > new Date(self.endFormDate)) {
                                // Reset the input field for end date and clear the value
                                toDatePicker.clear();
                                self.endFormDate = ""; // Reset the variable holding end date
                            }

                            await self.loadData();
                        }
                    });

                    new window.webUtils.event.FlatpickrClearable(
                        fromDatePicker,
                        function () { }
                    );

                    // Initialize Flatpickr for the end date input
                    const toDatePicker = $("#kt_td_picker_end_input").flatpickr({
                        dateFormat: "d/m/Y", // Ensure this is set correctly
                        maxDate: "today",
                        onChange: async function (selectedDates, dateStr, instance) {
                            // Set the date in "Y-m-d" format for backend use, but not for input display
                            self.endFormDate = instance.formatDate(selectedDates[0], "Y-m-d");

                            if (self.startFormDate && new Date(self.endFormDate) < new Date(self.startFormDate)) {
                                // Reset the start date input field and clear the value
                                fromDatePicker.clear();
                                self.startFormDate = ""; // Reset the variable holding start date
                            }

                            await self.loadData();
                        }
                    });
                }
            },
            async loadData() {
                const self = this
                showLoading()
                try {
                    let data = {
                        "search": "",
                        "campaign_names": self.serach_value_name || [],
                        "channel_ids": [self.value_channel_id],
                        "start_at": self.startFormDate,
                        "end_at": self.endFormDate,
                        "page": self.currentPages,
                        "per_page": parseInt(self.itemsPerPage || 10),
                        "order": "name",
                        "order_by": "desc"
                    }
                    const req = await services.getAds(data, self.token_header)

                    console.log("🚀 ~ loadData ~ req.data.code:", req.data.code)
                    if (req.data.code === 200) {
                        self.dataAds = req.data.data || []
                        self.totalItems = req.data.total;
                        self.dataShop.sort((a, b) => a.shop_name.localeCompare(b.shop_name));
                        self.dataAds.forEach(ad => {
                            ad.details.sort((a, b) => a.shop_name.localeCompare(b.shop_name));
                        });
                        closeLoading()
                    }
                } catch (error) {
                    closeLoading()
                    console.log("🚀 ~ loadData ~ error:", error)
                }
            },
            initSelectTable() {
                const self = this
                self.$nextTick(() => {

                    console.log(self.dataAds)
                    self.dataAds.forEach((item, index) => {
                        item.details.forEach((list, Idx) => {
                            const selectorPayment = '#select_status_shop_' + index + '_' + Idx;
                            if (!$(selectorPayment).data('select2')) {
                                $(selectorPayment).select2({
                                    placeholder: "Select Status",
                                    width: '100%',
                                    minimumResultsForSearch: Infinity,
                                });
                            }
                            $(selectorPayment).on("change.custom", async function () {
                                const selectedValue = $(this).val(); // Get the selected value
                                // item.details[Idx].is_join = selectedValue ? JSON.parse(selectedValue) : '';
                                item.details[Idx].is_join = selectedValue !== null ? selectedValue : false;
                            })
                            $(selectorPayment).val(item.details[Idx].is_join).trigger('change')
                        })
                        const selectorType = '#select_type_shop_' + index;

                        $(selectorType).select2({
                            placeholder: "Select Status",
                            width: '100%',
                            minimumResultsForSearch: Infinity,
                        });
                        $(selectorType).on("change.custom", async function () {
                            const selectedValue = $(this).val() // Get the selected value
                            item.type = selectedValue;
                        })
                        $(selectorType).val(item.type).trigger('change')

                        const selectorDateStart = '#kt_datepicker_start_' + index;
                        const selectorDateEnd = '#kt_datepicker_end_' + index;

                        let startDatePicker = $(selectorDateStart).flatpickr({
                            altInput: true,
                            altFormat: "d/m/Y",
                            dateFormat: "Y-m-d",
                            altFormat: "d/m/Y",
                            altInput: true,
                            onChange: async function (selectedDates, dateStr, instance) {

                                item.start_date = instance.formatDate(selectedDates[0], "Y-m-d");

                                endDatePicker.set('minDate', selectedDates[0]);
                                // $(selectorDateEnd).set('minDate', selectedDates[0]);
                                if (item.end_date && new Date(item.end_date) < new Date(item.start_date)) {
                                    item.end_date = ""; // Reset end_date if it is less than start_date
                                }
                            }
                        });
                        let endDatePicker = $(selectorDateEnd).flatpickr({
                            altInput: true,
                            altFormat: "d/m/Y",
                            dateFormat: "Y-m-d",
                            altFormat: "d/m/Y",
                            altInput: true,
                            onChange: async function (selectedDates, dateStr, instance) {

                                item.end_date = instance.formatDate(selectedDates[0], "Y-m-d");

                            }
                        });
                    })
                })
            },
            changePage(page) {
                if (page < 1 || page > this.totalPages) return;
                this.currentPages = page;
                this.loadDataOrder();
            },
            focusNext(column, nextIndex) {
                const nextInput = this.$refs[column + '_' + nextIndex];
                if (nextInput && nextInput[0]) { // ตรวจสอบว่าถ้าเป็น array
                    nextInput[0].focus(); // เข้าถึง element จริงถ้าเป็น array
                } else if (nextInput) {
                    nextInput.focus(); // ถ้าเป็น element เดียว
                }
            },

        },
      
        mounted: async function () {
            let self = this

            await self.init();
            console.log("ok")
        }


    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
