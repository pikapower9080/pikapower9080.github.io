// define([], function(){
//   'use strict';

//   var STORAGE_KEY_TABS_DATA = "local";

//   var _tab_data_to_set = {};

//   function default_tabs_data(){
//     return {
//       tabs: {}
//     };
//   }

//   function load_tabs(callback){
//     localStorage.getItem(STORAGE_KEY_TABS_DATA, function(items){
//       var _tabs = items[STORAGE_KEY_TABS_DATA];
//       if(_tabs === undefined)
//         _tabs = default_tabs_data();
//       callback(_tabs);
//     });
//   }

//   function add_tabs_listener(callback){
//     // chrome.storage.onChanged.addListener(function(changes, area_name){
     
//     // });
//     window.addEventListener("storage", function () {
//       var _tab_data = /*changes[STORAGE_KEY_TABS_DATA];*/localStorage.getItem("local")
//       if (_tab_data !== undefined)
//         callback(_tab_data.newValue ? _tab_data.newValue : default_tabs_data());
//     }, false);
//   }

//   function set_tab_data(id, data, callback){
//     var _perform_load = $.isEmptyObject(_tab_data_to_set);
//     _tab_data_to_set[id] = data;
//     if(_perform_load){
//       load_tabs(function(tabs){
//         $.each(_tab_data_to_set, function(id, data){
//           tabs.tabs[id] = data;
//         });
//         var _data = {};
//         _data[STORAGE_KEY_TABS_DATA] = tabs;
//         localStorage.setItem("local", _data);
//         _tab_data_to_set = {};
//       });
//     }
//   }

//   function clear(){
//     localStorage.setItem("local", null)
//   }

//   return {
//     load_tabs: load_tabs,
//     add_tabs_listener: add_tabs_listener,
//     set_tab_data: set_tab_data,
//     clear: clear
//   };

// });
