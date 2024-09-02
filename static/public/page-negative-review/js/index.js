(function ($, window, Vue, axios) {
    'use strict';

    const app = Vue.createApp({
        data() {
            return {
                user: window.user || "",
                currentPage: window.currentPage,
                authstatus: window.authstatus,
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                dataMatterViolation: [],
                dataInputChannel: [],

                
            };
        },
        methods: {
            async init() {
                let self = this;
            },
            async loadData() {
                try {
                    const responseGetMatterViolation = await services.getMatterViolation();
                    const dataMatterViolation = responseGetMatterViolation?.data.data || [];
                    this.dataMatterViolation = dataMatterViolation;
                } catch (error) {
                    console.warn(`🌦️ ~ loadDataSelect ~ error:`, error);
                }
                try {
                    const responseGetInputChannel = await services.getInputChannel();
                    const dataInputChannel = responseGetInputChannel?.data.data || [];
                    this.dataInputChannel = dataInputChannel;
                } catch (error) {
                    console.warn(`🌦️ ~ loadDataSelect ~ error:`, error);
                }
            },
            
            validateForm() {
                const form = document.getElementById('kt_docs_formvalidation_text');
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
            
                const submitButton = document.getElementById('kt_docs_formvalidation_text_submit');
                submitButton.addEventListener('click', function (e) {
                    e.preventDefault();
                    const radioInputs = document.querySelectorAll('input[type="radio"]');
                    const radioError = document.getElementById('radio_input_error');
            
                    const radioSelected = Array.from(radioInputs).find(radio => radio.checked) ? true : false;
                    if (!radioSelected) {
                        radioError.style.display = 'block';
                    } else {
                        radioError.style.display = 'none';
                    }
            
                    validator.validate().then(function (status) {
                        if (status === 'Valid' && radioSelected) {
                            // Show loading indication
                            submitButton.setAttribute('data-kt-indicator', 'on');
                            submitButton.disabled = true;
            
                            // Simulate form submission
                            setTimeout(function () {
                                // Remove loading indication
                                submitButton.removeAttribute('data-kt-indicator');
                                submitButton.disabled = false;
            
                                // Show success popup
                                Swal.fire({
                                    text: "กรอกข้อมูล สำเร็จ!",
                                    icon: "success",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it!",
                                    customClass: {
                                        confirmButton: "btn btn-primary"
                                    }
                                }).then(() => {
                                    // Reset form fields
                                    form.reset();
            
                                    // Uncheck all radio buttons
                                    radioInputs.forEach(radio => radio.checked = false);
            
                                    // Hide radio error message
                                    radioError.style.display = 'none';
                                });
            
                                // Uncomment the following line to actually submit the form
                                // form.submit();
                            }, 1000);
                        } else {
                           
                            Swal.fire({
                                text: "กรุณากรอกข้อมูลให้ครบถ้วน",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn btn-danger"
                                }
                            });
                        }
                    });
                });
            }


        },
        mounted() {
            let self = this;
            self.loadData();
            self.$nextTick(() => {
                self.validateForm();
            });
        }
    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
