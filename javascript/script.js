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
      imgPrev.src = URL.createObjectURL(file)
    }
  } else {
    imgPrev.src = input.value
  }
}


/////////////////
// FILE SUBMIT //
/////////////////

async function upload(formData) {
  try {
    const response = await fetch("http://127.0.0.1:8000/", {
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

const sendData = () => {
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
