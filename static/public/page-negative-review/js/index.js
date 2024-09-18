(function ($, window, Vue, axios) {
    'use strict';
    const token_header = getCookie('token');

    const app = Vue.createApp({
        data() {
            return {
                user: window.user || "",
                // currentPage: window.currentPage,
                currentPage: 'negativ-review',
                authstatus: window.authstatus,
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                dataMatterViolation: [],
                dataInputChannel: [],
                dataKeyReview: [],
                token_header: token_header || '',
                valueCheck: false,

                review_negative: '',
                review_independent: '',
                reply_message: '',
                reply_creator: '',
                notification: '',
                approve_request: '',
                
            };
        },
        methods: {
            async init() {
                let self = this;
            },

            async loadData() {
                const self = this;
                try {
                    const responseGetMatterViolation = await services.getMatterViolation(self.token_header);
                    const dataMatterViolation = responseGetMatterViolation?.data.data || [];
                    this.dataMatterViolation = dataMatterViolation.map((item, index) => ({
                        code: index, // or any unique value if available
                        name: item
                    }));
                    console.log(this.dataMatterViolation); // Debugging line
                } catch (error) {
                    console.warn(`🌦️ ~ loadDataSelect ~ error:`, error);
                }

                try {
                    let data = {
                         "channel_id": "CHANNEL_TIKTOK"
                    }
                    const responseGetInputChannel = await services.getInputChannel(data,self.token_header);
                    const dataInputChannel = responseGetInputChannel?.data.data || [];
                    this.dataInputChannel = dataInputChannel;
                } catch (error) {
                    console.warn('🌦️ ~ loadDataSelect ~ error:', error);
                }

            },

           async onSave() {
                const self = this;

                // Initialize validator once, if it hasn't been created
                let validator = self.validator || self.validateForm();

                // Reset and validate the form
                // validator.resetForm(true);
                validator.validate().then(async function (status) {
                    if (status === 'Valid') {
                        try {
                            let data = {
                                "chanel": self.valueCheck,
                                "review_negative": self.review_negative,
                                "review_independent": self.review_independent,
                                "reply_message": self.reply_message,
                                "reply_creator": self.reply_creator,
                                "infraction": $('#select_input option:selected').text(),
                                "notification": self.notification,
                                "approve_request": self.approve_request
                            }
                            const req = await services.createData(data, self.token_header)
                            if (req.status === 200) {
                                Msg("บันทึกสำเร็จ", 'success');
                                setTimeout(function () {
                                    window.location.reload();
                                }, 2000)
                            }
                        } catch (error) {
                            console.log("🚀 ~ error:", error)
                        }
                    } else {
                        // Form is not valid
                        console.log("Form is not valid, please correct the errors.");
                    }
                }).catch(function (error) {
                    console.error("Validation error:", error);
                });

                // Store the validator reference for future use
                self.validator = validator;
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
                            'text_input1': {
                                validators: {
                                    notEmpty: {
                                        message: 'เรื่องอัพเดทรีวิวเชิงลบ ต้องมีข้อมูล'
                                    }
                                }
                            },
                            'text_input2': {
                                validators: {
                                    notEmpty: {
                                        message: 'เรื่องอัพเดทรีวิวที่เป็นกลาง ต้องมีข้อมูล'
                                    }
                                }
                            },
                            'text_input3': {
                                validators: {
                                    notEmpty: {
                                        message: 'เรื่องการตอบกลับกล่องข้อความ ต้องมีข้อมูล'
                                    }
                                }
                            },
                            'text_input4': {
                                validators: {
                                    notEmpty: {
                                        message: 'เรื่องการตอบกลับแชทครีเอเตอร์ ต้องมีข้อมูล'
                                    }
                                }
                            },
                            'select_input': {
                                validators: {
                                    notEmpty: {
                                        message: 'เรื่องการละเมิด ต้องมีข้อมูล'
                                    }
                                }
                            },
                            'text_input5': {
                                validators: {
                                    notEmpty: {
                                        message: 'เรื่องการแจ้งเตือน ต้องมีข้อมูล'
                                    }
                                }
                            },
                            'text_input6': {
                                validators: {
                                    notEmpty: {
                                        message: 'เรื่องคำขออนุมัติสินค้า ต้องมีข้อมูล'
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
                const radioInputs = document.querySelectorAll('input[type="radio"]');
                const radioError = document.getElementById('radio_input_error');

                const radioSelected = Array.from(radioInputs).find(radio => radio.checked) ? true : false;
                if (!radioSelected) {
                    radioError.style.display = 'block';
                } else {
                    radioError.style.display = 'none';
                }
                return validator;
            }

        },
        mounted() {
            let self = this;
            self.loadData();
            // self.loadDataPost();
            self.$nextTick(() => {
                // self.validateForm();
            });
        }
    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
