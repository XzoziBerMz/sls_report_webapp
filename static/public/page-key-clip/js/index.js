(function ($, window, Vue, axios) {
    'use strict';
    const token_header = getCookie('token');
    const app = Vue.createApp({
        data: function () {
            return {
                user: window.user || "",
                currentPage: window.currentPage,
                authstatus: window.authstatus,
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                dataChannel: [],
                dataVdo: [],
                dataInsertVdoHandler: [],
                token_header: token_header || '',
                form: {
                    channel: "",
                    product: "",
                    vdo: "",
                },
                errors: {}
            }
        },
        methods: {
            async init() {
                let self = this;
            },
            async loadData() {
                showLoading();
                try {
                    // Make parallel API calls to fetch channel and video data
                    const [responseChannel, responseVdo] = await Promise.all([
                        services.getChannel(this.token_header),
                        services.getvdo(this.token_header)
                    ]);
            
                    // Assign the response data to the respective variables
                    this.dataChannel = responseChannel?.data?.data || [];
                    this.dataVdo = responseVdo?.data?.data || [];
                } catch (error) {
                    console.warn('🌦️ ~ loadData ~ error:', error);
                } finally {
                    closeLoading();
                }
            },
            

            async DefaultData() {
                const self = this;
                self.flatpickr_dp_from_date = $("#kt_td_picker_basic_input").flatpickr({
                    static: true,
                    enableTime: true,
                    disableMobile: "true",
                    dateFormat: "Y-m-d",
                    onChange: function (selectedDates, dateStr, instance) {
                        self.form.date = dateStr; // Update date in form data
                        delete self.errors.date; // Remove validation error for date field
                    },
                });
            },

            validateForm() {
                this.errors = {};

                if (!this.form.channel) {
                    this.errors.channel = 'กรุณาเลือกชื่อช่องทาง';
                }
                if (!this.form.product) {
                    this.errors.product = 'กรุณาเลือกสินค้า';
                }

                return Object.keys(this.errors).length === 0;
            },

            handleInput(field) {
                delete this.errors[field];
            },
            async handleSubmit(event) {
                event.preventDefault();
            
                if (this.validateForm()) {
                    try {
                        showLoading();
                        let data = {
                            "product": this.form.product || "",  
                            "note": this.form.remark || "", 
                            "link_vdo": this.form.vdo || "",
                            "approved": "", 
                            "approve_date": "", 
                            "chanel": this.form.channel || "",  
                            "date": this.form.date || ""  
                        };
            
                        console.log("Submitting data:", data); 
            
                        // Call the service to handle the form submission
                        const responsegetInsertVdoHandler = await services.getInsertVdoHandler(data, this.token_header);
                        const response = responsegetInsertVdoHandler?.data || {};
            
                        if (response?.error) {
                            console.error("API Error:", response.error);
                        } else {
                            // Update the dataInsertVdoHandler with response data
                            this.dataInsertVdoHandler = response.data || [];
            
                            // Reset the form and validation errors
                            this.resetForm();
            
                            console.log("Form submitted successfully!");
                        }
                        closeLoading()
                    } catch (error) {
                        console.warn("Error submitting form:", error.response?.data || error.message);
                        closeLoading()
                    }
                } else {
                    console.log("Form validation failed.");
                    closeLoading()
                }
            },
            
          
             
                resetForm() {
                    this.form = {
                        channel: "",
                        product: "",
                        vdo: "",
                        remark: "",
                        date: ""
                    };
            
                    this.errors = {};
            
                    if (this.flatpickr_dp_from_date) {
                        this.flatpickr_dp_from_date.clear();
                    }
            
                }
            
            
            


        },

        mounted: function () {
            let self = this;
            self.DefaultData();
            self.loadData();
            console.log("ok");
        }
    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
