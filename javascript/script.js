///////////////////
// TAB COMPONENT //
///////////////////

const tabChoose = (element) => {
  const choice = element.dataset.choice
  const tab_container = element.closest('.tab_component')
  const tab_control = element.parentNode

  tab_control.querySelectorAll('p').forEach((el) => {
    if (el == element) {
      el.classList.add('active')
    } else {
      el.classList.remove('active')
    }
  })

  tab_container.querySelector('.tab_display').querySelectorAll(".tab_child").forEach((el) => {
    if (el.dataset.choice == choice) {
      el.classList.remove('hidden')
    } else {
      el.classList.add('hidden')
    }
  })


}


///////////////////
// IMAGE PREVIEW //
///////////////////


const previewImage = (input, mode) => {
  if (mode == 'file') {
    const [file] = input.files
    if (file) {
      imgPrev.src = imgPrev_mobile.src = URL.createObjectURL(file)
    }
  } else {
    imgPrev.src = imgPrev_mobile.src = input.value
  }
}


/////////////////
// FILE SUBMIT //
/////////////////

function checkVisible(elm, threshold = 0, mode = 'visible') {
  threshold = threshold || 0;
  mode = mode || 'visible';

  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  var above = rect.bottom - threshold < 0;
  var below = rect.top - viewHeight + threshold >= 0;

  return mode === 'above' ? above : (mode === 'below' ? below : !above && !below);
}

const enableButton = () => {
  console.log('start')
  container = document.getElementById('main_display')
  button = document.getElementById('submit_button')
  input = container.querySelector('input:not(.hidden)')
  console.log(input.value)
  console.log(button)
  if (input.value != '') {
    button.disabled = false
    button.classList.remove('disabled')
  } else {
    button.disabled = true
    button.classList.add('disabled')
  }
}

const sendData = () => {
  if (!checkVisible(document.querySelector('.text_input'))) {
    changeParams = {
      top: 100,
      behavior: "smooth",
    }

    document.getElementById('main_container').scroll(changeParams);
  }


  page = 'analyze'

  loadingResult(true)

  input = document.querySelector('input:not(.hidden)')
  formData = new FormData()

  if (input.type == 'file') {
    formData.append("file", input.files[0]);
  } else {
    formData.append("url", input.value);
  }

  upload(formData)
}

async function upload(formData) {
  try {
    const response = await fetch("https://testing-fwbq4znlpq-od.a.run.app", {
      method: "POST",
      body: formData,
      mode: 'cors'
    });

    const result = await response.json();
    console.log("Success:", result);

    result['Prediction'] == 1 ? displayResult('real picture') : displayResult('fake')
  } catch (error) {
    console.error("Error:", error);
  }
}


////////////////////
// RESULT DISPLAY //
////////////////////

var page = 'analyze'

const loadingResult = (bool) => {
  button = document.getElementById('submit_button')

  if (bool) {
    document.getElementById(`main_result_display_${page}`).innerHTML = ""
    button.innerHTML = '<div id="spinner" class="spinner-sm spinner-border" role="status"><span class="sr-only">Loading...</span></div>'
  } else {
    button.innerHTML = 'Submit'
  }
}

const displayResult = (result) => {
  txt = `This image is a ${result}`

  setTimeout(() => {
    loadingResult(false)
    typeWriter()
  }, 1000);
}


////////////////
// TYPEWRITER //
////////////////

var i = 0;
var txt = '';
var speed = 50;

function typeWriter() {
  if (i < txt.length) {
    document.getElementById(`main_result_display_${page}`).innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  } else {
    i = 0
  }
}

////////////////////
// RANDOM PICTURE //
////////////////////

random_list = [1,2,3,4,5]

const getRandom = () => {
  page = 'random'
  document.getElementById(`main_result_display_${page}`).innerHTML = ""

  document.querySelectorAll('.random_content').forEach(el=>el.classList.add('hidden'));
  loader = document.getElementById('random_content_loader')

  loader.classList.remove('hidden')

  if (Math.random() >= 0.66) {
    ind = Math.floor(Math.random() * random_list.length)
    target = document.querySelector(`[data-randint="${random_list[ind]}"]`)
    delete random_list[ind];
    txt = `This is an amazing teacher`
  } else {
    target = document.getElementById('default_random_content')
    target_image = target.querySelector('img')
    target_image.src = "https://thispersondoesnotexist.com?" + new Date().getTime();
    txt = `This image is a fake`
  }

  if (target == null) {
    getRandom()
  }

  setTimeout(() => {
    loader.classList.add('hidden')
    target.classList.remove('hidden')
    typeWriter()
  }, 1000);

}

//////////
// MISC //
//////////

const closeHamburger = () => {
  document.getElementById('navbar_checkbox').checked = false
}
