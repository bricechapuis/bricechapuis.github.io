//////////////////////
// GLOBAL VARIABLES //
//////////////////////

var page = 'faces';
var txt = '';

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
  container = input.closest('.main_page')
  preview = container.querySelector('#imgPrev')
  preview_mobile = container.querySelector('#imgPrev_mobile')

  if (mode == 'file') {
    const [file] = input.files
    if (file) {
      preview.src = preview_mobile.src = URL.createObjectURL(file)
    }
  } else {
    preview.src = preview_mobile.src = input.value
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

const enableButton = (el) => {
  container = el.closest('.main_page')
  button = container.querySelector('#submit_button')
  input = container.querySelector('input:not(.hidden)')

  if (input.value != '') {
    button.disabled = false
    button.classList.remove('disabled')
  } else {
    button.disabled = true
    button.classList.add('disabled')
  }
}

const sendData = (el) => {
  container = el.closest('.main_page')
  page = container.id.split('_')[1]

  // if (!checkVisible(container.querySelector('.text_input'), 100)) {
  //   changeParams = {
  //     top: 200,
  //     behavior: "smooth",
  //   }

  //   document.getElementById('main_container').scroll(changeParams);
  // }

  loadingResult(true)

  input = container.querySelector('.tab_display').querySelector('input:not(.hidden)')
  formData = new FormData()

  if (input.type == 'file') {
    formData.append("file", input.files[0])
  } else {
    formData.append("url", input.value)
  }

  console.log(page)
  upload(formData, page)
}

async function upload(formData, page) {
  try {
    const response = await fetch(`https://testing-fwbq4znlpq-od.a.run.app/api/${page}`, {
      method: "POST",
      body: formData,
      mode: 'cors'
    })

    const result = await response.json()
    console.log("Success:", result)

    if (result['Score']) {
      displayResult(result['Score'] * 100 < 1 ? Math.ceil(result['Score'] * 100) : Math.floor(result['Score'] * 100))
    } else {
      displayResult('error')
    }

  } catch (error) {
    console.error("Error:", error)
  }
}


////////////////////
// RESULT DISPLAY //
////////////////////

const loadingResult = (bool) => {
  display = document.getElementById(`main_result_display_${page}`)
  scoreBar = document.getElementById(`score_container_${page}`).querySelector('.score')
  button = display.closest('#main_submit').querySelector('#submit_button')

  if (bool) {
    scoreBar.style.maxWidth = '0'
    display.innerHTML = "<span class='text_input'></span>"
    button.innerHTML = '<div id="spinner" class="spinner-sm spinner-border" role="status"><span class="sr-only">Loading...</span></div>'
    wait = true
  } else {
    button.innerHTML = 'Submit'
    wait = false
  }
}

const displayResult = (result) => {
  // txt = result == 'error' ? 'An error has occured, please check the provided data' : `This image is a ${result}`
  txt = result == 'error' ? 'An error has occured, please check the provided data' : `Probability of this image being real is ${result}%`

  scoreBar = document.getElementById(`score_container_${page}`).querySelector('.score')
  scoreBar.style.maxWidth = Math.round(result).toString() + '%'

  if (result <= 25) {
    scoreBar.style.backgroundColor = '#FF0000'
  } else if (result <= 50) {
    scoreBar.style.backgroundColor = '#FF8000'
  } else if (result <= 75) {
    scoreBar.style.backgroundColor = '#80FF00'
  } else {
    scoreBar.style.backgroundColor = '#00CC00'
  }

  setTimeout(() => {
    loadingResult(false)
    typeWriter()
  }, 1000);
}


////////////////
// TYPEWRITER //
////////////////

function typeWriter() {
  var i = 0;
  var paragText = "";

  var interval = setInterval(function () {
      var parag = document.getElementById(`main_result_display_${page}`);
      paragText += txt[i];
      parag.innerHTML = paragText + "<span class='text_input'></span>";
      i++;
      if (txt.length == i)
          clearInterval(interval);
  }, 50)
}

////////////////////
// RANDOM PICTURE //
////////////////////

random_list = [1,2,3,4,5]

const getRandom = (el) => {
  if (!wait) {
    page = 'random'
    wait = true
    document.getElementById(`main_result_display_${page}`).innerHTML = ""
    el.innerHTML = '<div id="spinner" class="spinner-sm spinner-border" role="status"><span class="sr-only">Loading...</span></div>'

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
      getRandom(el)
    } else {
      setTimeout(() => {
        loader.classList.add('hidden')
        target.classList.remove('hidden')
        typeWriter()
        el.innerHTML = 'Get random image'
        wait = false
      }, 1000);
    }
  }
}

//////////
// MISC //
//////////

const closeHamburger = () => {
  document.getElementById('navbar_checkbox').checked = false
}
