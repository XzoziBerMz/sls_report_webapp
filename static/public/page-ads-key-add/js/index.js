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
                form: {
                    product: "",
                    nameproduct: "",
                    orderNumber: "",
                    channel: "",
                  
                },
                flatpickr_dp_from_date: null, // ต้องมีการกำหนด flatpickr ก่อน
                errors: {}
            }
        },
        methods: {
            async init() {
                let self = this;
            },
        },
        async DefaultData() {
            const self = this;
            self.flatpickr_dp_from_date = flatpickr("#kt_td_picker_basic_input", {
              static: true,
              enableTime: true,
              disableMobile: "true",
              dateFormat: "d/m/Y",
              onChange: function (selectedDates, dateStr, instance) {
                self.form.date = instance.formatDate(selectedDates[0], "Y-m-d") + ' 00:00:00';
                delete self.errors.date;
              },
            });
          },
    
        
        handleInput(field) {
           
            this.errors[field] = ''; 
        },

        mounted: function () {
            let self = this;
            self.DefaultData();
            console.log("ok");
        }
    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
