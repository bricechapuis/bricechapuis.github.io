currentPage = 0
currentVerticalPage = 0
wait = false

const updateMainContainerHeight = () => {
  main_container = document.getElementById('main_container')
  current_page = document.querySelector(`.h_page${currentPage}`)

  main_container.style.height = `${current_page.offsetHeight}px`
  main_container.style.maxHeight = `${current_page.offsetHeight}px`
}

const checkKey = (e) => {
  e = e || window.event;
  if (wait) {return}

  if (e.keyCode == '38') {
    // up arrow
    if (currentVerticalPage > 0) {
      changePageVertical(currentVerticalPage - 1)
    }
  }
  else if (e.keyCode == '40') {
    // down arrow
    if (currentVerticalPage < 1) {
      changePageVertical(currentVerticalPage + 1)
    }
  }
  else if (e.keyCode == '37') {
    // left arrow
    if (currentPage > 0 && currentVerticalPage == 0) {
      changePage(currentPage - 1)
    }
  }
  else if (e.keyCode == '39') {
    // right arrow
    if (currentPage < 3 && currentVerticalPage == 0) {
      changePage(currentPage + 1)
    }
  }
}

const changePage = (pageNum) => {
  if (!wait) {
    wait = true
    links = document.querySelector('.header-links').querySelectorAll('p')
    links.forEach(button => button.classList.remove('active', 'from_left', 'from_right'))

    if (pageNum >= currentPage) {
      links.forEach(button => button.classList.add('from_left'))
    } else {
      links.forEach(button => button.classList.add('from_right'))
    }
    links[pageNum].classList.add('active')

    main_container = document.getElementById('main_container')
    body = document.getElementsByTagName('body')[0]

    changeParams = {
      left: body.clientWidth * pageNum,
      behavior: "smooth",
    }

    currentPage = pageNum
    main_container.style.overflowX = 'scroll'
    main_container.scroll(changeParams);
    updateMainContainerHeight();

    setTimeout(() => {
      main_container.style.overflowX = 'hidden'
      wait = false
    }, 500);
  }
}

const changePageVertical = (pageNum) => {
  if (!wait && currentPage == 2) {
    wait = true

    main_container = document.getElementById('main_container')
    body = document.getElementsByTagName('body')[0]

    changeParams = {
      top: body.clientHeight * pageNum,
      behavior: "smooth",
    }

    currentVerticalPage = pageNum
    main_container.scroll(changeParams);

    setTimeout(() => {
      wait = false
    }, 400);
  }
}

const scrollInfoPage = (direction) => {
  if (direction == 'down' && currentVerticalPage < 1) {
    changePageVertical(currentVerticalPage + 1)
  } else if (currentVerticalPage > 0) {
    changePageVertical(currentVerticalPage - 1)
  }
}

/////////////
// ON LOAD //
/////////////

updateMainContainerHeight();
document.onkeydown = checkKey;

document.addEventListener('wheel', function(e){
  wDelta = e.wheelDelta < 0 ? 'down' : 'up';
  e.preventDefault()

  scrollWait = true
  scrollInfoPage(wDelta)
});
