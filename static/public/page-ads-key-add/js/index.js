(function ($, window, Vue, axios) {
  "use strict";
  const token_header = getCookie("token");
  const app = Vue.createApp({
    data: function () {
      return {
        ...(window.webUtils.data || {}),
        user: window.user || "",
        // currentPage: window.currentPage,
        currentPage: "key-ads",
        authstatus: window.authstatus,
        datas: [],
        inventoryDetail: [],
        search: "",
        filtered: [],
        data_channel: [],
        token_header: token_header || "",
        form: {
          product: "",
          shop_name: "",
          add_fee: "",
          added_income: "",
        },
        dataEditStars: [],
        flatpickr_dp_from_date: null,
        errors: [],
        dateDefault: null,
        valueDate_time: null,
        start_date_time: null,
        end_date_time: null,
      };
    },
    computed: {
      AddFee() {
        const sum = this.data_channel.reduce(
          (sum, item) => sum + parseFloat(item.ads_fee || 0),
          0
        );
        // return sum.toFixed(2);
        return sum;
      },
      AddIncome() {
        const sum = this.data_channel.reduce(
          (sum, item) => sum + parseFloat(item.ads_income || 0),
          0
        );
        return sum;
      },
      AddTotal() {
        const sum = this.data_channel.reduce(
          (sum, item) => sum + parseFloat(item.ads_total_income || 0),
          0
        );
        return sum;
      },
    },
    methods: {
      ...(window.webUtils.method || {}),
      async init() {
        let self = this;
      },

      formatNumber(number) {
        if (typeof number === "number") {
          return number.toLocaleString(); // Format number with commas
        }
        return number; // Return as is if not a number
      },

      formatPercentage(addFee, totalIncome) {
        if (
          addFee == null ||
          totalIncome == null ||
          isNaN(addFee) ||
          isNaN(totalIncome) ||
          totalIncome === 0
        ) {
          return "0.00%";
        }
        const percentage = (addFee / totalIncome) * 100;
        // ตรวจสอบอีกครั้งหลังจากคำนวณ
        if (isNaN(percentage) || !isFinite(percentage)) {
          return "0.00%";
        }
        return `${percentage.toFixed(2)}%`;
      },

      async DefaultData() {
        const self = this;

        self.dateDefault = new Date();
        try {
          let data = {
            "search": "",
            // "start_at": "2023-01-01",
            // "end_at": "2024-08-15",
            "start_at": self.start_date_time,
            "end_at": self.end_date_time,
            "page": 1,
            "per_page": 10,
            "order": "shop_name",
            "order_by": "desc"
          };
          const req = await services.getShop(data, self.token_header);
          if (req.data.code === 200) {
            self.data_channel = req.data.data;
            self.data_channel = req.data.data.map((item) => ({
              ...item,
              timestamp:
                self.dateDefault.toISOString().split("T")[0] +
                " " +
                self.dateDefault.getHours() +
                ":" +
                self.dateDefault.getMinutes() +
                ":" +
                self.dateDefault.getSeconds(), // แปลง date ให้เป็นรูปแบบ 'YYYY-MM-DD HH:MM:SS'
            }));
            $("#kt_td_picker_date_input").flatpickr({
              altInput: true,
              altFormat: "d/m/Y",
              dateFormat: "Y-m-d",
              onChange: async function (selectedDates, dateStr, instance) {

                self.data_channel.forEach((item, index) => {
                  const selectedDate = selectedDates[0];
                  const currentTime = new Date();

                  const year = instance.formatDate(selectedDate, "Y");
                  const month = instance.formatDate(selectedDate, "m");
                  const day = instance.formatDate(selectedDate, "d");

                  const hours = currentTime.getHours().toString().padStart(2, '0');
                  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
                  const seconds = currentTime.getSeconds().toString().padStart(2, '0');

                  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                  item.timestamp = formattedDateTime;
                  item.date = formattedDateTime;
                  self.valueDate_time = formattedDateTime
                });

                console.log("🚀 ~ self.dataAds.forEach ~ self.valueDate_time:", self.valueDate_time)
              }
            });
            this.$nextTick(() => {
              // self.data_channel.forEach((item, index) => {
              //   const selectorPayment = "#kt_td_picker_start_input_" + index;

              //   self.set_date_time = $(
              //     "#kt_td_picker_start_input_" + index
              //   ).flatpickr({
              //     altInput: true,
              //     altFormat: "d/m/Y",
              //     dateFormat: "Y-m-d",
              //     onChange: async function (selectedDates, dateStr, instance) {
              //       item.timestamp = instance.formatDate(
              //         selectedDates[0],
              //         "Y-m-d"
              //       ); // Update date in form data
              //     },
              //   });
              //   self.set_date_time.setDate(item.date);
              // });
            });
          }
        } catch (error) {
          console.log("🚀 ~ DefaultData ~ error:", error);
        }
      },
      focusNext(column, nextIndex) {
        const nextInput = this.$refs[column + "_" + nextIndex];
        if (nextInput && nextInput[0]) {
          // ตรวจสอบว่าถ้าเป็น array
          nextInput[0].focus(); // เข้าถึง element จริงถ้าเป็น array
        } else if (nextInput) {
          nextInput.focus(); // ถ้าเป็น element เดียว
        }
      },
      handleInputN(value, index, field) {
        let formattedValue = `${value}`.replace(/[^0-9.]/g, ""); // ลบอักขระที่ไม่ต้องการ

        // แยกทศนิยมออก
        const decimalParts = formattedValue.split('.');

        // ตรวจสอบว่าแยกได้มากกว่าสองส่วนหรือไม่ (มากกว่า 1 จุดทศนิยม)
        if (decimalParts.length > 2) {
          formattedValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
        }

        // กำหนดค่าที่ถูกต้องกลับไปที่ฟิลด์
        this.data_channel[index][field] = formattedValue;
      },
      addAds() {
        const self = this;
        let data = {
          new_data: true,
          shop_name: "",
          ads_fee: "",
          ads_income: "",
          ads_total_income: "",
          date: self.valueDate_time || "",
          timestamp: self.valueDate_time || "",
        };

        self.data_channel.push(data);
        this.$nextTick(() => {
          self.data_channel.forEach((item, index) => {
            const selectorPayment = "#select_channel_" + index;
            if (!$(selectorPayment).data("select2")) {
              $(selectorPayment).select2({
                placeholder: "Select Payment Method",
                width: "100%",
                data: self.data_channel.map((item) => ({
                  id: item.shop_name,
                  text: item.shop_name,
                })),
              });
            }
            $(selectorPayment).on("change.custom", async function () {
              const selectedValue = $(this).val(); // Get the selected value
              item.shop_name = selectedValue || 10;
            });

            const selectorDate = "#kt_td_picker_start_input_" + index;
            $(selectorDate).flatpickr({
              altInput: true,
              altFormat: "d/m/Y",
              dateFormat: "Y-m-d",
              onChange: async function (selectedDates, dateStr, instance) {
                item.timestamp = instance.formatDate(selectedDates[0], "Y-m-d"); // Update date in form data
              },
            });
          });
        });
      },
      deleteAds(index) {
        this.data_channel.splice(index, 1);
      },
      formatDate(date) {
        const day = String(date.getDate()).padStart(2, "0"); // วัน, เติม 0 ข้างหน้าให้เป็นสองหลัก
        const month = String(date.getMonth() + 1).padStart(2, "0"); // เดือน (getMonth() ให้ค่าตั้งแต่ 0-11), เติม 0 ข้างหน้า
        const year = date.getFullYear(); // ปี

        return `${day}/${month}/${year}`;
      },

      validateFields() {
        this.errors = [];
        this.errors_date = {};
        let isValid = true;

        this.data_channel.forEach((item, index) => {
          let error = {};
          let error_date = {};

          if (item.ads_fee === "") {
            error.ads_fee = true;
            isValid = false;
          }

          if (item.ads_income === "") {
            error.ads_income = true;
            isValid = false;
          }

          if (item.ads_total_income === "") {
            error.ads_total_income = true;
            isValid = false;
          }

          if (item.new_data) {
            if (!item.shop_name) {
              error.shop_name = "กรุณาเลือก ร้าน";
              isValid = false;
            }
          }
          if (!this.valueDate_time) {
            error_date.date = "กรุณาเลือก วันที่";
            isValid = false;
          } 

          this.errors[index] = error;
          this.errors_date = error_date;
        });
        console.log(
          "🚀 ~ this.dataEditStars.forEach ~ this.errors:",
          this.errors
        );

        return isValid;
      },
      getCurrentDateFormatted() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // เดือนเริ่มจาก 0
        const day = String(now.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      },

      async handleSubmit(event) {
        if (this.validateFields() === false) {
          const toastElement = document.getElementById("kt_docs_toast_toggle");
          const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
          toast.show();
          return;
        }
        try {
          showLoading();
          let data = {
            data: this.data_channel,
          };
          console.log("🚀 ~ handleSubmit ~ data:", data);
          data.data.forEach((item, index) => {
            delete item.id;
            item.timestamp = this.getCurrentDateFormatted();
            item.ads_fee = parseFloat(item.ads_fee);
            item.ads_income = parseFloat(item.ads_income);
            item.ads_total_income = parseFloat(item.ads_total_income);
          });
          const response = await services.getInsertAsd(data, this.token_header);
          if (response.data.code === 200) {
            closeLoading();

            Msg("บันทึกสำเร็จ", "success");
            setTimeout(function () {
              window.location.reload();
            }, 2000);
          }
        } catch (error) {
          console.warn("Error loading data:", error);
          closeLoading();
        }
      },

      restrictToNumbers(index, field) {
        this.data_channel[index][field] = this.data_channel[index][
          field
        ].replace(/[^0-9]/g, "");
        this.validateFields();
      },
      clearError(index, field) {
        // Clear the error for the specified field
        console.log("🚀 ~ clearError ~ this.errors:", this.errors);
        this.errors[index][field] = null;
      },
     
      handleInput(index, field) {
        if (this.errors[index]) {
          this.errors[index][field] = ""; // Clear the error for the specific item and field
        }
      },
      created() {
        // Set start_at to one day before the current date
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        const formattedDate = currentDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
        this.start_date_time = formattedDate + ' 00:00:00';
        this.end_date_time = formattedDate + ' 23:59:59';
        console.log("🚀 ~ created ~ this.searchData.start_at:", this.start_date_time)
      },
     
    },

    mounted: function () {
      let self = this;
      self.created();
      self.DefaultData();
      console.log("ok");
    },
  });

  const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
