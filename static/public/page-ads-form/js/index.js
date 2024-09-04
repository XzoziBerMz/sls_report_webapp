(function ($, window, Vue, axios) {
    'use strict';



    const app = Vue.createApp({
        data: function () {
            const _page_settings = {
                // activeTab: null,
                // is_pending: false,
                // view_mode: window.view_mode || "",
                // edit_mode: window.edit_mode || "",
                // back_redirect: "./xxxx.html",
                validator_form: null,

                // page settings
            }
            return {
                user: window.user || "",
                currentPage: window.currentPage,
                authstatus: window.authstatus,
                datas: [],
                inventoryDetail: [],
                search: "",
                filtered: [],
                validator_form: null,
                ..._page_settings,
                dataList: [
                    {id: 1, name: "1"},
                    {id: 2, name: "2"},
                    {id: 3, name: "3"},
                ],

            }
        },
        computed: {




        },
        methods: {
            async init() {
                let self = this
                $("#kt_datepicker_start").flatpickr();
                $("#kt_datepicker_end").flatpickr();
            },
            async savePage() {
                const self = this;
                try {
                    let validate = await self.onValidateForm().validate();
                    if (validate === "Valid") {
                        console.log("save")
                    }
                } catch (error) {
                    console.log("🚀 ~ savePage ~ error:", error)
                }
            },

            onValidateForm: function () {
                const self = this;
                const key_validator = "validator_form";
                if (self[key_validator]) {
                    self[key_validator]?.resetForm();
                    self[key_validator].destroy();
                }
                const field_name_validate = self.dataList.map((item) => ({
                    type: 'INPUT',
                    case: ["required"],
                    // name: "amount_" + item.name,
                    name: item.name,
                }));

                let map_validates = {};
                let error_keys = [];
                self.tab_validate_errors = [];
                field_name_validate.forEach((item) => {
                    let error_message = {};
                    item.case.forEach((feitem) => {
                        error_message = {
                            ...error_message,
                            [feitem]: getLabelMessageError(`ข้อมูล ${item.name} ต้องมี`),
                            // [feitem]: getLabelMessageError(`ข้อมูล ${item.name} ต้องมี ${feitem}`),
                        };
                    });

                    let cases = {};
                    if (item.case.some((sitem) => sitem === "email_pattern")) {
                        cases = {
                            ...cases,
                            emailAddress: {
                                message: error_message["email_pattern"],
                            },
                        };
                    }
                    map_validates[item.name] = {
                        validators: {
                            validateMessage: {},
                            callback: {
                                message: error_message["required"],
                                callback: function (input) {
                                    if (item.case.some((sitem) => sitem === "required")) {
                                        if (`${input.value || ""}`.trim() === "") {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                            },
                            ...cases,
                        },
                    };
                    error_keys = [
                        ...error_keys,
                        ...Object.keys(error_message).map((key) => error_message[key]),
                    ];
                });

                // console.log(`🌦️ ~ onValidate ~ error_keys:`, error_keys);
                self[key_validator] = FormValidation.formValidation(
                    $(`[fv-id="${key_validator}"]`)[0],
                    {
                        fields: { ...map_validates },
                        plugins: {
                            ...ktFormValidationPlugins(),
                        },
                    }
                );

                if (!self[key_validator]) {
                    return Promise.resolve({
                        status: "Valid",
                    });
                }
                return self[key_validator];
            },

            getPokemon: async function () {
                const self = this;
                try {
                    showLoading();
                    const response = await services.getPokemon({})
                    if (response) {
                        console.log(response)
                        closeLoading();

                    }

                } catch (err) {
                    closeLoading();
                    Msg("errorMsg", 'error');

                } finally {

                }
            }

        },

        mounted:async function () {
            let self = this
            await self.init()
            //    self.getPokemon()
            console.log("ok")
        }


    });

    const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
