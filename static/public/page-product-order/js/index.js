(function ($, window, Vue, axios) {
    'use strict';
    const token_header = getCookie('token');
    const app = Vue.createApp({
        data: function () {
            return {
                user: window.user || "",
                // currentPage: window.currentPage,
                currentPage: 'product-order',
                authstatus: window.authstatus,
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                token_header: token_header || '',
                dataInsertOrderManualHandler: [],
                form: {
                    // date: "",
                    product: "",
                    nameproduct: "",
                    orderNumber: "",
                    channel: "",
                  
                },
                errors: {}
            }
        },
        methods: {
            async init() {
                let self = this;
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
            }
            ,
        
            validateForm() {
                this.errors = {};
        
                // if (!this.form.date) {
                //     this.errors.date = 'กรุณาเลือกวันที่';
                // }
                if (!this.form.product) {
                    this.errors.product = 'กรุณากรอกสินค้า';
                }
                if (!this.form.nameproduct) {
                    this.errors.nameproduct = 'กรุณากรอกชื่อสินค้า';
                }
                if (!this.form.orderNumber) {
                    this.errors.orderNumber = 'กรุณากรอกหมายเลขคำสั่งซื้อ';
                }
                if (!this.form.channel) {
                    this.errors.channel = 'กรุณากรอกช่องทาง';
                }
                // if (!this.form.remark) {
                //     this.errors.remark = 'กรุณากรอกหมายเหตุ';
                // }
        
                return Object.keys(this.errors).length === 0;
            },
        
            async handleSubmit(event) {
                event.preventDefault();
                
                if (!this.validateForm()) {
                    console.error("กรุณากรอกข้อมูลให้ครบถ้วน");
                    return;
                }
            
                try {
                    // Log the form data
                    console.log('Form data:', this.form);
                    showLoading();
                    let data = {
                        "customer_name": this.form.nameproduct,
                        "product": this.form.product,
                        "order_no": this.form.orderNumber,
                        "user": this.form.nameproduct,  // Assuming 'user' is the same as 'nameproduct'
                        "p_date": this.form.date,
                        "chanel": this.form.channel,
                        "note": this.form.remark
                    };
            
                    // Log the data being sent
                    console.log('Data being sent:', data);
            
                    const response = await services.getInsertOrderManualHandler(data, this.token_header);
                    const responseData = response.data || {};
                    if (responseData.code === 200) {
                        this.dataInsertOrderManualHandler = responseData.data || [];
                    
                        const totalItems = responseData.total || 0;
                        this.totalPages = Math.ceil(totalItems / +this.perPage);
                        closeLoading()
                        // Form is valid
                        Msg("บันทึกสำเร็จ", 'success');
                        setTimeout(function () {
                            window.location.reload();
                        }, 2000)
                    }
                    
                    // Reset form fields and errors
                    // this.form = {
                    //     date: "",
                    //     product: "",
                    //     nameproduct: "",
                    //     orderNumber: "",
                    //     channel: "",
                    //     remark: ""
                    // };
                    // this.errors = {};
                    
                } catch (error) {
                    console.warn("Error loading data:", error);
                    closeLoading()
                }
            },
            
        
            handleInput(field) {
           
                this.errors[field] = ''; 
            }
        },
        

        mounted: function () {
            let self = this;
            self.DefaultData();
            console.log("ok");
        }
    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
