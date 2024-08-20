
window.i18n = [];
window.errorCodes = [];
window.eventLanguage = [];
window.isShowModalTimeout = false
window.isSelfLogout = false

function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}

const initialInputNumberOnly = (element) => {
    if (!element) return;
    setInputFilter(element, function (value) {
        return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
    });
}

function decrypt(ciphertextStr) {
    var ciphertext = CryptoJS.enc.Base64.parse(ciphertextStr);
    var iv = ciphertext.clone();
    iv.sigBytes = 16;
    iv.clamp();
    ciphertext.words.splice(0, 4); // delete 4 words = 16 bytes
    ciphertext.sigBytes -= 16;
    var decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, CryptoJS.enc.Utf8.parse(aesKey), {
    iv: iv
    }).toString(CryptoJS.enc.Utf8);
    return decrypted;
}

function showLoading() {
    Swal.fire({
        title: 'Loading',
        allowOutsideClick: false,
        allowEscapeKey: false,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
        },
    })
}

function closeLoading() {
    Swal.close()
}


function Msg(message,status) {
    Swal.fire({
        icon: status,
        text: message,
    })
}






function ModalMsg(status) {
    if(status=="save_success"){
        $("#modal_save_success").modal('show');
    }else if(status=="failed"){
        $("#modal_failed").modal('show');
    }else if(status=="transaction_change"){
        $("#modal_transaction_change").modal('show');
    }
}


function showErrorMessagePopup(message,timemilisec) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: timemilisec || 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    Toast.fire({
        icon: 'error',
        title: message
    })
}

function showWarningMessagePopup(message,timemilisec) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: timemilisec || 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    Toast.fire({
        icon: 'warning',
        title: message
    })
}

function showSuccessMessagePopup(message,timemilisec) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: timemilisec || 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    Toast.fire({
        icon: 'success',
        title: message
    })
}

function pad2(n) {
    return (n < 10 ? '0' : '') + n;
  }

function formatDateForSearchHeader(date){
    let month = pad2(date.getMonth()+1);
    let day = pad2(date.getDate());
    let year= date.getFullYear();
    return  day+"-"+month+"-"+year;
}

function formatDateForSearchHeaderSlash(date){
    let month = pad2(date.getMonth()+1);
    let day = pad2(date.getDate());
    let year= date.getFullYear();
    return  day+"/"+month+"/"+year;
}


function splitToMMDDYYY(dateStr){
    const split = dateStr.split("-");

    return  split[1]+"-"+split[0]+"-"+split[2];
}

function splitToDashMMDDYYYTODDMMYYY(dateStr){
    const split = dateStr.split("/");
    return  split[1]+"-"+split[0]+"-"+split[2];
}

function splitToDashDDMMYYYTOYYYDDMM(dateStr){
    const split = dateStr.split("/");
    return  split[2]+"-"+split[1]+"-"+split[0];
}


function convertDateUtil(epoch) {
    if (epoch && epoch > 0) {
        const dateFromEpoch = new Date(epoch)
        let month = ((dateFromEpoch.getMonth() ?? 0) + 1) < 10 ? "0" + ((dateFromEpoch.getMonth() ?? 0) + 1) : "" + ((dateFromEpoch.getMonth() ?? 0) + 1);
        let date = (dateFromEpoch.getDate() ?? 0) < 10 ? "0" + (dateFromEpoch.getDate() ?? 0) : "" + (dateFromEpoch.getDate() ?? 0);
        let year = (dateFromEpoch.getFullYear() ?? 0);
        let yearStr = (year).toString();

        return date + "/" + month + "/" + yearStr;
    }
}

function convertTimeUtil(epoch) {
    if (epoch && epoch > 0) {
        const dateFromEpoch = new Date(epoch)
        let hours = ((dateFromEpoch.getHours() ?? 0) < 10 ? "0" + (dateFromEpoch.getHours() ?? 0) : (dateFromEpoch.getHours() ?? 0));
        let minutes = ((dateFromEpoch.getMinutes() ?? 0) < 10 ? "0" + (dateFromEpoch.getMinutes() ?? 0) : (dateFromEpoch.getMinutes() ?? 0));
        return hours + ":" + minutes;
    }
}

function getDayName(epoch, locale){
    const dateFromEpoch = new Date(epoch)
    return dateFromEpoch.toLocaleDateString(locale, { weekday: 'long' });        
}


async function i18nLoader(url, langs) {
    try {
        if (Array.isArray(langs)) {
            for (const lang of langs) {
                const _i18nUrl = `${url}/${lang}.json`
                await fetch(_i18nUrl, {
                        cache: 'no-cache'
                    })
                    .then(response => response.json())
                    .then(response => {
                        window.i18n[lang] = mergeObji18n(((window.i18n || [])[lang] || {}), response);
                    })
                    .catch(error => console.log("", error));
            }
        } else {
            const lang = langs;
            const _i18nUrl = `${url}/${lang}.json`
            if (!window.i18n || !window.i18n[lang]) {
                await fetch(_i18nUrl, {
                        cache: 'no-cache'
                    })
                    .then(response => response.json())
                    .then(response => {
                        window.i18n[lang] = Object.assign(((window.i18n || [])[lang] || {}), response);
                    })
                    .catch(error => console.log("", error));
            }
        }
        function mergeObji18n(obj1 = {}, obj2 = {}) {
            let
                keyLabelObj = "labels",
                labelsObj1 = {...obj1[keyLabelObj] || {}},
                labelsObj2 = {...obj2[keyLabelObj] || {}};

            let
                keyClassObj = "classs",
                classsObj1 = {...obj1[keyClassObj] || {}},
                classsObj2 = {...obj2[keyClassObj] || {}};
    
            obj1 = {...obj1, ...obj2};
            obj1[keyLabelObj] = {...labelsObj1, ...labelsObj2};
            obj1[keyClassObj] = {...classsObj1, ...classsObj2};

            return obj1;
        };
    } catch (error) {
        console.error("i18nLoader", error)
        return Promise.resolve({init: "i18nLoader", success: false});
    } finally {
        return Promise.resolve({init: "i18nLoader", success: true});
    }
}

function bindI18n(lang = currentLang) {
    return new Promise(function (resolve) {
        ({ labels, placeholders, classs, sel_placeholders, sel_placeholders_no_search, kendoGridHeaders } = window.i18n[lang]);
        if (labels) {
            const elementIds = Object.keys(labels)
            for (const elementId of elementIds) {
                const element = document.getElementById(elementId);
                if (element) {
                    element.innerText = labels[elementId]
                }
            }
        }
        if(classs){
            const elementIds = Object.keys(classs)
            for (const elementId of elementIds) {
                let classElement = document.getElementsByClassName( elementId );
                if(classElement && classElement.length>0){
                    for(let i=0;i<classElement.length;i++){
                        classElement[i].innerHTML = classs[elementId]
                    }   
                }
                
            }
        }
        if (placeholders) {
            const elementIds = Object.keys(placeholders);
            for (const elementId of elementIds) {
                const element = document.getElementById(elementId);
                if (element) {
                    element.placeholder = placeholders[elementId]
                }
            }
        }
        if (sel_placeholders) {
            const elementIds = Object.keys(sel_placeholders);
            for (const elementId of elementIds) {
                const element = document.getElementById(elementId);
                if (element) {
                    $(`#select2-${elementId}-container .select2-selection__placeholder`).html(sel_placeholders[elementId]);
                }
            }
        }
        if (sel_placeholders_no_search) {
            const elementIds = Object.keys(sel_placeholders_no_search);
            for (const elementId of elementIds) {
                const element = document.getElementById(elementId);
                if (element) {
                    $(`#select2-${elementId}-container .select2-selection__placeholder`).html(sel_placeholders_no_search[elementId]);
                }
            }
        }
        if (kendoGridHeaders) {
            const gridIds = Object.keys(kendoGridHeaders);
            for (const gridId of gridIds) {
                const fieldNames = Object.keys(kendoGridHeaders[gridId]);
                for (const fieldName of fieldNames) {
                    const position = `#${gridId} thead [data-field=${fieldName}] .k-link`
                    const value = kendoGridHeaders[gridId][fieldName];
                    $(position).html(value);
                }
            }
        }
        showCurrentErrors(lang);
        compileEventLanguage(lang, "init");

        resolve({init: "bindI18n", success: true});
    });
}

function bindDropdownLanguage(lang) {
    return new Promise(function (resolve) {
        window.languageSelectionSetting = {
            "element_id": "dp_lang",
            "languages": {
              "en": {
                "element_id": "dp_lang-en",
                "element_text": "EN",
              },
              "th": {
                "element_id": "dp_lang-th",
                "element_text": "TH",
              }
            }
        }
        dropdownLangSelect(lang);
        bindDropdownLanguageEvent();

        resolve({init: "bindDropdownLanguage", success: true});
    })
}

function dropdownLangSelect(lang) {
    if (window.languageSelectionSetting && window.languageSelectionSetting.languages) {
        const dpElementId = window.languageSelectionSetting["element_id"];
        if (!dpElementId ) {
            console.log("not found require data for language selection setting");
            return;
        }

        for (const key in window.languageSelectionSetting.languages) {
            const choiceElementId = window.languageSelectionSetting.languages[key]["element_id"];
            const choiceElement = document.getElementById(choiceElementId);
            if (!choiceElementId || !choiceElement) {
                console.log("not found require data for language selection choice setting");
                return;
            }
            if (lang === key) {
                if (!$(choiceElement).closest(`[id="dropdown_select_langs"]`).length) {
                    $(`[ref-lang="select-language"]`).attr('current-lang', key);
                    $(`[id^=dp_lang]`).removeClass('lang-active');
                    $(choiceElement).addClass('lang-active');
                } else {
                    // language metronic
                    const currentLangLabel = $(choiceElement).find(`.lang-label`).text();
                    const currentLangFlag = $(choiceElement).find(`.lang-flag-icon`).attr("src");
                    $(`[id="val_lang_lbl"]`).text(currentLangLabel);
                    $(`[id="val_lang_flag"]`).attr("src", currentLangFlag);

                    $(`[id^="dp_lang"]`).removeClass('active');
                    $(choiceElement).addClass('active');
                }

                createCookie("current_language", key, 30);
            } else {
               
            }
        }
    }
}

function bindDropdownLanguageEvent() {
    if (window.languageSelectionSetting && window.languageSelectionSetting.languages) {
        for (const key in window.languageSelectionSetting.languages) {
            const choiceElementId = window.languageSelectionSetting.languages[key]["element_id"];
            const choiceElement = document.getElementById(choiceElementId);
            if (!choiceElementId || !choiceElementId || !choiceElement) {
                console.log("not found require data for event binding");
                return;
            }
            choiceElement.addEventListener("click", event => {
                event.preventDefault();
                dropdownLangSelect(key)
                bindI18n(key);
                currentLang = key;
                compileEventLanguage(key, "toggleLang");
            });
        }
    }
}

function eventLanguageRegister(idEvent = "", callback = function(){}) {
    window.eventLanguage = window.eventLanguage.filter(eItem => eItem.idEvent !== idEvent)
    window.eventLanguage.push({
        idEvent: idEvent,
        callback: callback
    })
}

function compileEventLanguage(_currentLang, action = "init") {
    window.eventLanguage.map(eItem => {
        if (typeof eItem.callback == 'function') {
            eItem.callback(_currentLang, action);
        }
    })
}

function createCookie(name, value, days) {
    let expires;
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    } else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            let c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function showCurrentErrors(lang){
    for(const errorCode of window.errorCodes){
        showError(errorCode, lang);
    }
}

function getLabelMessage(message_code, lang = currentLang) {
    if (window.i18n.hasOwnProperty(lang) &&
        window.i18n[lang]['labels'] &&
        window.i18n[lang]['labels'][message_code]
    ) {
        const messageLabel = window.i18n[lang]['labels'][message_code];
        return messageLabel || "";
    } else if (window.i18n.hasOwnProperty(lang) &&
        window.i18n[lang]['classs'] &&
        window.i18n[lang]['classs'][message_code]
    ) {
        const messageLabel = window.i18n[lang]['classs'][message_code];
        return messageLabel || "";
    } else {
        return "";
    }
}

function getLabelMessageError(message_code, lang = currentLang) {
    if (window.i18n.hasOwnProperty(lang) &&
        window.i18n[lang]['messages'] &&
        window.i18n[lang]['messages']['errors'] &&
        window.i18n[lang]['messages']['errors'][message_code]
    ) {
        const mappingErrors = window.i18n[lang]['messages']['errors'][message_code];
        const lastFeedbackMessage = mappingErrors['message'];
        return lastFeedbackMessage || message_code;
    } else {
        return message_code;
    }
}

function showi18nIdsDuplicate() {
    if (window.i18n.hasOwnProperty(lang) &&
        window.i18n[lang]['labels']
    ) {
        Object.keys(window.i18n[lang]['labels']).map(function (item_id_lbl) {
            const message = window.i18n[lang]['labels'][item_id_lbl];
            $(`[id=${item_id_lbl}]`).text(message || "");
        });
    }
}

function ktFormValidationPlugins() {
    return {
        // trigger: new FormValidation.plugins.Trigger(),
        bootstrap: new FormValidation.plugins.Bootstrap5({
            defaultMessageContainer: false,
            rowSelector: '.fv-row',
            eleInvalidClass: 'is-invalid',
            eleValidClass: ''
        }),
        message: new FormValidation.plugins.Message({
            clazz: 'd-block mt-0 fv-message-container invalid-feedback',
            container: function (field, ele) {
                if (!$(ele).closest('.fv-row').find('.fv-ms-container')[0]) {
                    $(ele).closest('.fv-row')
                        .append(`<div class="fv-ms-container invalid-feedback d-flex justify-content-end mt-0"></div>`);
                }
                $(ele).removeClass("is-invalid").addClass("is-invalid");
                $(ele).closest('.fv-row').find('.fv-ms-container').html("")
                return $(ele).closest('.fv-row').find('.fv-ms-container')[0];
            },
        })
    }
}

const defaultLang = "th";
const cookieLang = getCookie("current_language");
let currentLang = cookieLang != undefined && cookieLang.length > 0 ? cookieLang : defaultLang;
async function initLanguage() {
    try {
        if (window.i18nUrlCommon) {
            await i18nLoader(window.i18nUrlCommon, ["en", "th"]);
            await i18nLoader(window.i18nUrlCommon + "/dropzone", ["en", "th"]);
        }
        await i18nLoader(window.i18nUrl, ["en", "th"]);
        await bindDropdownLanguage(currentLang);
        return Promise.resolve({init: "initLanguage", success: true});
    } catch (error) {
        return Promise.resolve({init: "initLanguage", success: false});
    }
}

function resetSelect2Input(input_id = "") {
    if(input_id) {
        const element_select = $("#"+input_id);
        element_select.val(null).trigger('change');
        element_select.select2('destroy');
        element_select.html('');
        element_select.removeClass('is-invalid');
        element_select.removeClass('select2-hidden-accessible');
        element_select.append(`<option value=""></option>`);
    }
}

function isFileImage(file) {
    return file && file['type'].split('/')[0] === 'image';
}


function noRef(dataIn){
    const stringJson = JSON.stringify(dataIn)
    return JSON.parse(stringJson)
}


(function (window) {
    // initial loadding script
    window.loadingScreen = {
        show: () => { },
        hide: () => { },
    }
    window.onload = function () {
        if (window.jQuery) {
            // loading screen
            const loadingScreen = function () {
                const bodyKtApp = $(`body`);
                const showLoading = () => {
                    if (!bodyKtApp.find('.page-loader').length) {
                        bodyKtApp.append(`
                            <div class="page-loader flex-column">
                                <span class="spinner-border" role="status"></span>
                                <span class="text-muted fs-6 fw-bold mt-5">Loading...</span>
                            </div>
                        `);
                    }
                    bodyKtApp.addClass("page-loading");
                }
                const hideLoading = () => {
                    bodyKtApp.removeClass("page-loading");
                }
                return {
                    show: showLoading,
                    hide: hideLoading
                }
            }();
            window.loadingScreen = loadingScreen;


        } else {
            // jQuery is not loaded
            console.log("Doesn't Work")
        }
    }

    window.loadingScreen = {};
})(window);

// Utils
(function (window) {
    const data = {
        date_format: "DD/MM/YYYY",
        date_time_format: "DD/MM/YYYY HH:mm",
        time_format: "HH:mm",
        date_flatpickr_format: "d/m/Y",
        date_time_flatpickr_format: "d/m/Y H:i",
        time_flatpickr_format: "H:i",
    }
    const method = {
        utilsConvDate: function (value) {
            const self = this;
            if (!value) return "";
            return moment(value).format(self.date_format);
        },
        utilsConvDateTime: function (value) {
            const self = this;
            if (!value) return "";
            return moment(value).format(self.date_time_format);
        },
        utilsConvTime: function (value) {
            const self = this;
            if (!value) return "";
            return moment(value).format(self.time_format);
        },
        utilsConvLanguage: function (_objLang = {}) {
            const objLang = _.cloneDeep(_objLang);
            const _currentLang = window.currentLang;
            const priorityLang = ['th', 'en', 'cn'];
            Object.keys(objLang).forEach(key => {
                objLang[`${key}`.toLowerCase()] = objLang[key];
            });

            if (Object.keys(objLang).length) {
                let _val_label = objLang[_currentLang] || "";
                if (!_val_label) {
                    const priorityLang2 = priorityLang.filter(fitem => fitem !== _currentLang);
                    for (let _index = 0; _index < priorityLang2.length; _index++) {
                        const _key_lang = priorityLang2[_index];
                        if (objLang[_key_lang]) {
                            _val_label = objLang[_key_lang];
                            break;
                        }
                    }
                }
                return _val_label;
            }
            return "";
        },
        utilsIsNumber: function (evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();;
            } else {
                if (evt.target.value.includes(".") && charCode === 46) {
                    evt.preventDefault();
                    return false;
                }
                return true;
            }
        },
        utilsIsNumberInteger: function (evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
                evt.preventDefault();;
            } else {
                if (evt.target.value.includes(".") && charCode === 46) {
                    evt.preventDefault();
                    return false;
                }
                return true;
            }
        },
        utilsOnModalEvent: async function ({
            modal_key = "",
            onSave = () => {},
            onShown = () => {},
            onHidden = () => {},
        }) {
            if (!modal_key) return;
            const self = this;
            self[modal_key] = $(`#${modal_key}`).modal({ backdrop: 'static', keyboard: false });
            self[modal_key].find('[btn-action=btn_modal_save]').unbind().click(async function () {
                try {
                    onSave(self[modal_key], this);
                } catch (error) {
                    console.warn(error)
                } finally {
                }
            });
            self[modal_key].find('[btn-action=btn_modal_back]').unbind().click(function () {
                self[modal_key].modal('hide');
            });
            self[modal_key].unbind('shown.bs.modal').on('shown.bs.modal', async function (event) {
                onShown(self[modal_key]);
            })
            self[modal_key].unbind('hidden.bs.modal').on('hidden.bs.modal', async function (event) {
                onHidden(self[modal_key]);
            })
            return self[modal_key];
        },
        utilsModalConfirmDialog: function ({
            onSave = function () {}, 
            onClose = function () {},
            onShown = function () {},
            onHidden = function () {},
            title = "",
            content = "",
            content_replace_body = "",
            confirm_text = "",
            cancel_text = "",
        }) {
            const modal_id = "modal_confirm_dialog";
            const modal_content = content || `<span>คุณต้องการที่จะยืนยันใช่หรือไม่</span>`;
            const modal_content_body = content_replace_body || `<div class="w-100 modal-container text-center">
                ${modal_content}
            </div>`;
            let modal_confirm = $(`.modal#${modal_id}`);
            if (!modal_confirm.length) {
                $("body").append(`
                    <div class="modal fade" id="${modal_id}" data-backdrop="static" tabindex="-1" role="dialog"
                    aria-labelledby="staticBackdrop" aria-hidden="true">
                        <div class="modal-dialog modal-md" role="document">
                            <div class="modal-content">
                                <div class="modal-header d-flex justify-content-center">
                                    <h5 class="modal-title ${modal_id}_title_label">${title || "ยืนยัน"}</h5>
                                </div>
                                <div class="modal-body">
                                    ${modal_content_body}
                                </div>
                                <div class="modal-footer d-flex flex-center gap-5 pb-10">
                                    <button type="button" class="btn btn-sm shadow btn-superrich-secondary w-100px"
                                        btn-action="btn_modal_back">
                                        <span class="lbl_btn_modal_back">${cancel_text || "ยกเลิก"}</span>
                                    </button>
                                    <button type="button" class="btn btn-sm shadow btn-superrich-primary w-100px"
                                        btn-action="btn_modal_save">
                                        <span class="lbl_btn_modal_save">${confirm_text || "ยืนยัน"}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
                modal_confirm = $(`.modal#${modal_id}`);
            }
            modal_confirm.find('[btn-action="btn_modal_back"]').unbind('click.modal').on('click.modal', function (event) {
                modal_confirm.modal("hide");
                onClose && onClose(event, modal_confirm);
            })
            modal_confirm.find('[btn-action="btn_modal_save"]').unbind('click.modal').on('click.modal', function (event) {
                onSave && onSave(event, modal_confirm);
            });
            modal_confirm.unbind('shown.bs.modal').on('shown.bs.modal', async function (event) {
                onShown(modal_confirm);
            });
            modal_confirm.unbind('hidden.bs.modal').on('hidden.bs.modal', async function (event) {
                modal_confirm.remove();
                onHidden(modal_confirm);
            });
            return modal_confirm;
        },
        utilsGenerateFilename: function (str = "") {
            let filename = str
                .replace(/(?!^)(?=[A-Z])/g, '-')
                .replace(/\.\w+$/, '')
                .replace(/[^a-zA-Z0-9-_]/g, '')
                .toLowerCase();
            let _filetype = (/[.]/.exec(str)) ? /[^.]+$/.exec(str) : undefined;
            let filetype = _filetype?.[0] ? `.${_filetype[0]}` : "";
            filename = filename.substring(0, 20);
            return `${new Date().valueOf()}-${filename}${filetype}`;
        },
        utilsOnerrorImg(event) {
            if (event?.type === 'error') {
                $(event.target).css('opacity', 0);
            }
        },
    }
    const event = {
        UploadEvent: function (self, kt_upload_element) {
            try {
                const key_event_change = `kt.imageinput.change`;
                const key_event_cancel = `kt.imageinput.cancel`;
                const key_event_remove = `kt.imageinput.remove`;
                const imageInputElement = document.querySelector(kt_upload_element);
                if (!imageInputElement) throw Error(`${kt_upload_element} : ` + imageInputElement);
                const imageInput = new KTImageInput.getInstance(imageInputElement);

                imageInput["change"] = function (callback) {
                    imageInput.on(key_event_change, async function (...args) {
                        try {
                            await callback(...args);
                        } catch (error) {
                            console.warn(error);
                        } finally {
                            const inputElement = args?.[0].inputElement;
                            inputElement && (inputElement.value = "");
                        }
                    });
                }
                imageInput["cancel"] = function (callback) {
                    imageInput.on(key_event_cancel, function (...args) {
                        try {
                            callback(...args);
                        } catch (error) {
                            console.warn(error);
                        }
                    });
                }
                imageInput["remove"] = function (callback) {
                    imageInput.on(key_event_remove, function (...args) {
                        try {
                            callback(...args);
                        } catch (error) {
                            console.warn(error);
                        }
                    });
                }
                imageInput["setFile"] = function ({
                    src = ""
                } = {}) {
                    const el = imageInput.element;
                    if (src) {
                        $(el).removeClass("image-input-empty");
                        $(el).find(".image-input-wrapper").attr("style", `background-image: url(${src})`);
                    } else {
                        $(el).addClass("image-input-empty");
                        $(el).find(".image-input-wrapper").attr("style", `background-image: ''`);
                    }
                }
                return imageInput;
            } catch (error) {
                console.warn(error);
            }
        },
        FlatpickrClearable: function (self_flatpicker = {}, callback = function () { }) {
            console.log(`🌦️ ~ self_flatpicker:`, self_flatpicker?.config?.static);
            if (!self_flatpicker.element) return $(self_flatpicker.element);
            const $flatpickr_input_container = $(self_flatpicker.element).closest(".flatpickr-input-container:not([disabled])")
            const $ico_clearable = $flatpickr_input_container.find(".ico-flatpickr-clear");
            let timeoutHover;
            $flatpickr_input_container.unbind("mouseenter.custom mouseleave.custom").on("mouseenter.custom mouseleave.custom", function () {
                if (timeoutHover) clearTimeout(timeoutHover);
                timeoutHover = setTimeout(() => {
                    if (self_flatpicker?.selectedDates[0]) {
                        $ico_clearable.removeClass("d-none");
                    } else {
                        $ico_clearable.addClass("d-none");
                    }
                }, 50);
            });
            self_flatpicker.config.onChange.push(function (selectedDates) {
                if (timeoutHover) clearTimeout(timeoutHover);
                timeoutHover = setTimeout(() => {
                    if (selectedDates[0]) {
                        $ico_clearable.removeClass("d-none");
                    } else {
                        $ico_clearable.addClass("d-none");
                    }
                }, 0);
            });
            $ico_clearable.unbind("click.custom").on("click.custom", function () {
                self_flatpicker.clear();
                callback();
            });
            return $(self_flatpicker.element);
        }
    }
    window.webUtils = {
        data,
        method,
        event
    };
})(window);



function calculatePagesCount (pageSize, totalCount) {
    return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize);
};



document.addEventListener("DOMContentLoaded", () => {
    // const elementLogout = document.getElementById("btn_logout")
    // if(elementLogout){
    //     elementLogout.addEventListener("click", function(){
    //         window.isSelfLogout = true
    //         onLogout();
    //     });
    // }



});
var toggleSidebar = true
var clickMe = false
function openNav() {
    $(".app-sidebar").css("width","265px")
    $(".app-main").css("margin-left","265px")
    document.getElementById("logo-title").style.display = "block"
    document.getElementById("text-dashboard").style.display = "block"
    $(".menu-title").css("display","block")
    $("#kt_aside_toggle").css("width","auto")
    $(".app-header").css({
        "position":"absolute",
        "margin-left":"0"
    })
    $("#kt_app_wrapper").css({
        "position":"inherit",
        "margin-left":"0"
    })
  }
  
  function closeNav() {
    console.log("closeNav")
    $(".app-sidebar").css("width","50px")
    $(".app-main").css("margin-left","0")
    document.getElementById("logo-title").style.display = "none"
    document.getElementById("text-dashboard").style.display = "none"
    $(".menu-title").css("display","none")
    $("#kt_aside_toggle").css("width","100%")
    $("#kt_app_header").css({
        "position":"inherit",
        "margin-left":"50px"
    })
    $("#kt_app_wrapper").css({
        "position":"absolute",
        "margin-left":"50px"
    })
    
    
  }

  function onToggleSidebar(){
    toggleSidebar =  !toggleSidebar
    clickMe = true
    if (toggleSidebar) {
        $(".app-main").css("width","auto")
        openNav()
    } else {
        $(".app-main").css("width","auto")
        closeNav()
        
    }
  }

function showWidth() {
    if (window.innerWidth < 992) {
        document.getElementById("kt_app_main").style.marginLeft = "0"
        $(".app-main").css("width","100%")
        $("#kt_app_header").css({
            "position":"inherit",
            
        })
    }
    
    if (clickMe && window.innerWidth > 992) {
        $(".app-main").css("width","84%")
        $(".app-main").css("margin-left","265px")
    }
    
}


  

