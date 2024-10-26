(function ($, window, Vue, axios) {
    'use strict';
    const token_header = getCookie('token');

    const app = Vue.createApp({
        data() {
            return {
                user: window.user || "",
                // currentPage: window.currentPage,
                currentPage: 'kol_form',
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

                actions_button: 'create',
                FormDate: null,
            };
        },
        methods: {
            async init() {
                let self = this;

                const fromDatePicker = $("#kt_datepicker_1").flatpickr({
                    dateFormat: "d/m/Y",
                    maxDate: "today",
                    onChange: async function (selectedDates, dateStr, instance) {
                        self.FormDate = instance.formatDate(selectedDates[0], "Y-m-d");

                        // toDatePicker.set('minDate', selectedDates[0]);

                        // await self.loadData();
                    }
                });
            },

            async loadData() {

            },

            async onSave() {
                const self = this;

                // Initialize validator once, if it hasn't been created
                let validator = self.validateForm();

                // Reset and validate the form
                // validator.resetForm(true);
                validator.validate().then(async function (status) {
                    if (status === 'Valid') {
                        showLoading();
                        try {
                            let data = {
                                "date": self.FormDate,
                                "name_kol": $('#name_kol').val() || "",
                                "tiktok_channel_url": $('#channel').val() || "",
                            }
                            const req = await services.createData(data, self.token_header)
                            if (req.status === 200) {
                                $('#insert_btn').hide()
                                $('#update_btn').show()
                                $('#form-information').show()
                                self.actions_button = 'update'
                                self.id_kol = req.data.data || ''
                                // Msg("บันทึกสำเร็จ", 'success');
                                closeLoading();

                            }
                        } catch (error) {
                            closeLoading();
                        }
                    } else {
                        // Form is not valid
                        console.log("Form is not valid, please correct the errors.");
                        closeLoading();
                    }
                }).catch(function (error) {
                    console.error("Validation error:", error);
                });

                // self.validator = validator;
            },

            async onUpdate() {
                const self = this;
                // Initialize validator once, if it hasn't been created
                let validator =  self.validateForm();

                // Reset and validate the form
                // validator.resetForm(true);
                validator.validate().then(async function (status) {
                    console.log("🚀 ~ status:", status)
                    if (status === 'Valid') {
                        showLoading();
                        try {
                            let data = {
                                "id": self.id_kol || '',
                                "date": self.FormDate,
                                "name_kol": $('#name_kol').val() || "",
                                "tiktok_channel_url": $('#channel').val() || "",
                                "kol_status": $('#text_free').val() || "",
                                "address": $('#address').val() || "",
                                "contact_number": $('#phone_number').val() || "",
                                "video_link": $('#vdo_1').val() || "",
                                "gen_code": $('#gen_code').val() || "",
                                "vd_code": $('#vd_text').val() || "",
                                "contact_status": $('#select_status').val() || "",
                                "product_status": $('#select_product').val() || "",
                                "note": $('#remark').val() || "",
                                // "user": "example_user"
                            }
                            const req = await services.updateData(data, self.token_header)
                            if (req.status === 200) {
                                Swal.fire({
                                    title: 'บันทึกสำเร็จ',
                                    icon: 'success',
                                    confirmButtonText: 'ตกลง'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        window.location.reload();
                                    }
                                });
                            }
                        } catch (error) {
                            console.log("🚀 ~ error:", error)
                        }
                        console.log("🚀 ~ data:", data)
                        // self.actions_button = 'create'

                    } else {
                        console.log("Form is not valid, please correct the errors.");
                        closeLoading();
                    }
                }).catch(function (error) {
                    console.error("Validation error:", error);
                });
            },

            restrictToNumbers() {
                const field = document.getElementById('phone_number');
                field.value = field.value.replace(/[^0-9]/g, "");
            },

            validateForm() {
                const form = document.getElementById('kt_docs_formvalidation_text');

                if (this.validator) {
                    this.validator.resetForm();
                }

                const fieldsConfig = {
                    'kt_datepicker_1': {
                        validators: {
                            notEmpty: {
                                message: 'วันที่ ต้องมีข้อมูล'
                            }
                        }
                    },
                    'name_kol': {
                        validators: {
                            notEmpty: {
                                message: 'ชื่อ KOL ต้องมีข้อมูล'
                            }
                        }
                    },
                    'channel': {
                        validators: {
                            notEmpty: {
                                message: 'ช่องทาง TikTok ต้องมีข้อมูล'
                            }
                        }
                    }
                };

                // ตรวจสอบว่า action_btn เป็น 'update' เพื่อเพิ่ม validation
                if (this.actions_button === 'update') {
                    fieldsConfig['select_status'] = {
                        validators: {
                            notEmpty: {
                                message: 'สถานะการ ต้องมีข้อมูล'
                            }
                        }
                    };
                    fieldsConfig['select_product'] = {
                        validators: {
                            notEmpty: {
                                message: 'รับสินค้าแล้ว ต้องมีข้อมูล'
                            }
                        }
                    };
                }

                const validator = FormValidation.formValidation(
                    form,
                    {
                        fields: fieldsConfig,
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
            }


        },
        async mounted() {
            let self = this;
            await self.init()
        }
    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
