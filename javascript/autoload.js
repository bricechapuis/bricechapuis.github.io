const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const url1 = urlParams.get('url1')
const url2 = urlParams.get('url2')
const input1 = document.getElementById('page_faces').querySelector('#imgInp_url')
const input2 = document.getElementById('page_general').querySelector('#imgInp_url')

input1.value = url1
input2.value = url2

previewImage(input1, 'url')
previewImage(input2, 'url')

tabChoose(input1.closest('.tab_component').querySelector('.tab_choice:not(.active)'))
tabChoose(input2.closest('.tab_component').querySelector('.tab_choice:not(.active)'))
enableButton(input1)
enableButton(input2)
