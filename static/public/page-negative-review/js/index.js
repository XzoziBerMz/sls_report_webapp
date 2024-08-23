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
            }
        },
        methods: {
            async init() {
                let self = this;
            },

            validateForm() {
                // Define form element
                const form = document.getElementById('kt_docs_formvalidation_text');

                // Init form validation rules
                const validator = FormValidation.formValidation(
                    form,
                    {
                        fields: {
                            'radio_input': {
                                validators: {
                                    notEmpty: {
                                        message: 'ช่องทาง ต้องมีข้อมูล'
                                    }
                                }
                            },
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

                // Submit button handler
                const submitButton = document.getElementById('kt_docs_formvalidation_text_submit');
                submitButton.addEventListener('click', function (e) {
                    e.preventDefault();

                    // Validate form before submit
                    if (validator) {
                        validator.validate().then(function (status) {
                            if (status == 'Valid') {
                                // Show loading indication
                                submitButton.setAttribute('data-kt-indicator', 'on');

                                // Disable button to avoid multiple click
                                submitButton.disabled = true;

                                // Simulate form submission
                                setTimeout(function () {
                                    // Remove loading indication
                                    submitButton.removeAttribute('data-kt-indicator');

                                    // Enable button
                                    submitButton.disabled = false;

                                    // Show popup confirmation
                                    Swal.fire({
                                        text: "กรอกข้อมูล สำเร็จ!",
                                        icon: "success",
                                        buttonsStyling: false,
                                        confirmButtonText: "Ok, got it!",
                                        customClass: {
                                            confirmButton: "btn btn-primary"
                                        }
                                    });

                                    //form.submit(); // Submit form
                                }, 1000);
                            }
                        });
                    }
                });
            }
        },
        mounted() {
            let self = this;
            self.validateForm();
        }
    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);