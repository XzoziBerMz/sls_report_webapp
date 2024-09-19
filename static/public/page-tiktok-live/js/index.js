(function ($, window, Vue, axios) {
  "use strict";

  const token_header = getCookie("token");

  const app = Vue.createApp({
    data: function () {
      return {
        ...(window.webUtils.data || {}),
        user: window.user || "",
        currentPage: "tiktok_live",
        authstatus: window.authstatus,
        datas: [],
        inventoryDetail: [],
        search: "",
        filtered: [],
        dataProduct: [],
        dataShop: [],
        dataAds: [],
        token_header: token_header || "",
        form: {
          shop_name: "",
          total_cost: "",
          total_income: "",
          note: "",
          date: "",
        },
        errors: {},
        start_date_time: null,
        end_date_time: null,
        selectedDate: "",
        flatpickr_dp_from_date: null,
      };
    },
    computed: {},
    methods: {
      ...(window.webUtils.method || {}),
      async init() {
        let self = this;

        await self.loadData();

        self.flatpickr_dp_from_date = $("#kt_td_picker_start_input").flatpickr({
          static: true,
          enableTime: false,
          disableMobile: "true",
          dateFormat: "Y-m-d",
          altFormat: "d/m/Y",
          altInput: true,
          maxDate: "today",
          onChange: function (selectedDates) {
            if (selectedDates.length) {
              const selectedDate = selectedDates[0];
              const year = selectedDate.getFullYear();
              const month = String(selectedDate.getMonth() + 1).padStart(
                2,
                "0"
              );
              const day = String(selectedDate.getDate()).padStart(2, "0");
              const hours = String(new Date().getHours()).padStart(2, "0"); // ใช้เวลาปัจจุบัน
              const minutes = String(new Date().getMinutes()).padStart(2, "0"); // ใช้เวลาปัจจุบัน
              const seconds = String(new Date().getSeconds()).padStart(2, "0"); // ใช้เวลาปัจจุบัน
              self.selectedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
              console.log("🚀 ~ Updated selectedDate:", self.selectedDate);
              self.errors.date = null;
            } else {
              self.selectedDate = null;
            }
          },
        });
      },

      handleInputNumber(value) {
        let formattedValue = `${value}`.replace(/[^0-9.]/g, ""); // ลบอักขระที่ไม่ใช่ตัวเลข
        const decimalParts = formattedValue.split(".");

        // ตรวจสอบว่าไม่มีมากกว่า 1 จุดทศนิยม
        if (decimalParts.length > 2) {
          formattedValue =
            decimalParts[0] + "." + decimalParts.slice(1).join("");
        }

        // ถ้าเป็นค่าว่างหรือไม่ใช่ตัวเลข ให้คืนค่า 0.0
        let floatValue = parseFloat(formattedValue);
        return isNaN(floatValue) ? 0.0 : floatValue; // แปลงเป็น float64
      },

      handleInputN(value, index, field) {
        let formattedValue = `${value}`.replace(/[^0-9.]/g, ""); // ลบอักขระที่ไม่ต้องการ
        const decimalParts = formattedValue.split(".");
        if (decimalParts.length > 2) {
          formattedValue =
            decimalParts[0] + "." + decimalParts.slice(1).join("");
        }
        this.dataAds[index][field] = formattedValue;
      },

      formatNumber(number) {
        if (typeof number === "number") {
          return number.toLocaleString();
        }
        return number;
      },
      async loadData() {
        const self = this;
        try {
          showLoading();
          let data = {
            channel_id: "CHANNEL_TIKTOK",
          };
          const req = await services.getChannel(data, self.token_header);
          if (req.data.code === 200) {
            closeLoading();
            self.errors = {};
            self.dataAds = req.data.data || [];
            console.log("🚀 ~ loadData ~ self.dataAds:", self.dataAds);
          }
        } catch (error) {
          closeLoading();
          console.log("🚀 ~ loadData ~ error:", error);
        }
      },

      validateForm() {
        const self = this;
        self.errors = {};
        let isValid = true;
        console.log("🚀 ~ self.dataAds.forEach ~  self.dataAds:", self.dataAds);
        self.dataAds.forEach((item, index) => {
          let error = {};
          if (item.new_ads) {
            if (!item.shop_name) {
              error.shop_name = true;
              isValid = false;
            }
          }
          // ตรวจสอบว่าค่า total_cost ถูกกรอก (0 ก็ถือว่าถูกต้อง)
          if (item.total_cost === "" || isNaN(item.total_cost)) {
            error.total_cost = true;
            isValid = false;
          }
          // ตรวจสอบว่า total_income ถูกกรอก (0 ก็ถือว่าถูกต้อง)
          if (item.total_income === "" || isNaN(item.total_income)) {
            error.total_income = true;
            isValid = false;
          }
          self.errors[index] = error;
        });

        if (!self.selectedDate) {
          self.errors.date = "กรุณาเลือกวันที่";
          isValid = false;
        }

        return isValid;
      },
      addAds() {
        const self = this;
        let totalCost = parseFloat(self.total_cost);
        let totalIncome = parseFloat(self.total_income);
        if (isNaN(totalCost)) totalCost = 0;
        if (isNaN(totalIncome)) totalIncome = 0;

        let data = {
          new_ads: true,
          shop_name: self.shop_name,
          total_cost: totalCost,
          total_income: totalIncome,
          // "commission": 10.0,
          note: self.note,
          p_timestamp: self.selectedDate,
        };
        self.dataAds.push(data);
      },
      focusNext(column, nextIndex) {
        const nextInput = this.$refs[column + "_" + nextIndex];
        if (nextInput && nextInput.length) {
          // ตรวจสอบว่าถ้าเป็น array
          nextInput[0].focus(); // เข้าถึง element จริงถ้าเป็น array
        } else if (nextInput) {
          nextInput.focus(); // ถ้าเป็น element เดียว
        }
      },
      async savePage() {
        const self = this;
        try {
          if (self.validateForm()) {
            showLoading();
            if (self.dataAds.length > 0) {
              self.dataAds.forEach((ad) => {
                ad.p_timestamp = self.selectedDate;
              });
            }

            let dataAds = {
              data: self.dataAds || [],
            };
            await services.getInsertMultiple(dataAds, self.token_header);
            Msg("บันทึกสำเร็จ", "success");
            setTimeout(function () {
              window.location.reload();
            }, 2000);
          }
        } catch (error) {
          console.log("🚀 ~ savePage ~ error:", error);
        } finally {
          closeLoading();
        }
      },
    },
    watch: {
      "form.total_cost"(newValue) {
        let formattedValue = `${newValue}`.replace(/[^0-9.]/g, "");
        const decimalParts = formattedValue.split(".");
        if (decimalParts.length > 2) {
          formattedValue =
            decimalParts[0] + "." + decimalParts.slice(1).join("");
        }
        this.form.total_cost = formattedValue;
      },
      "form.total_income"(newValue) {
        let formattedValue = `${newValue}`.replace(/[^0-9.]/g, "");
        const decimalParts = formattedValue.split(".");
        if (decimalParts.length > 2) {
          formattedValue =
            decimalParts[0] + "." + decimalParts.slice(1).join("");
        }
        this.form.total_income = formattedValue;
      },
    },
    mounted: async function () {
      let self = this;
      await self.init();
      console.log("ok");
    },
  });
  const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
