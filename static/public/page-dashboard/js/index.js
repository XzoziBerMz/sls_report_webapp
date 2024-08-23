(function($, window, Vue, axios) {
    'use strict';
    
   

    const app = Vue.createApp({
        data: function() {
            return{
               user:window.user || "",
               currentPage: window.currentPage,
               authstatus:window.authstatus,
               datas:[],
               inventoryDetail:[],
               search:"",
               filtered:[],

                                  
            }
        },
        computed: {
         
      


        },
        methods: {
            async init() {
                let self = this
                             
            },

            getPokemon:async function (){
              const self = this;
              try {
                  showLoading();
                  const response = await services.getPokemon({})
                  if (response){
                      console.log(response)
                      closeLoading();

                  }
  
              }catch(err){
                  closeLoading();
                  Msg("errorMsg",'error');
                 
              }finally{
  
              }
            }

        },

        mounted: function () {
           let self = this
        //    self.getPokemon()
           console.log("ok")
        }

        
    });
    
const vue = app.mount("#kt_app_root");
})(jQuery, window, Vue, axios);
