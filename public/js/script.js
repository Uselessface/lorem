//* Navigation toggle
const navButton = document.querySelector('.nav__button')
const nav = document.querySelector('.nav')
const navHashAnchors = nav.querySelectorAll('a[href^="#"]')

navButton.onclick = () => {
  const ariaExpanded = navButton.getAttribute('aria-expanded')

  if (ariaExpanded === 'false') openNav()
  else if (ariaExpanded === 'true') closeNav()
}

//** If clicked on hash anchor (e.g. <a href="#order" ...)
Array.from(navHashAnchors).forEach((anchor) => {
  anchor.onclick = closeNav
})

function openNav() {
  navButton.classList.add('opening')
  document.body.style.overflow = 'hidden'

  nav.ontransitionend = (event) => {
    if (event.target !== nav) return

    navButton.setAttribute('aria-expanded', 'true')

    navButton.classList.remove('opening')
  }
}

function closeNav() {
  navButton.classList.add('closing')
  document.body.style.overflow = ''

  nav.ontransitionend = (event) => {
    if (event.target !== nav) return

    navButton.setAttribute('aria-expanded', 'false')

    navButton.classList.remove('closing')
  }
}

//* Custom selects
const selects = document.querySelectorAll('.select')

Array.from(selects).forEach((select) => {
  //* Creating custom select body
  const container = document.createElement('div')

  //** Button-like appearance
  container.setAttribute('role', 'button')

  onClickAndKeyboard(container, (event) => {
    event.stopPropagation()

    function handleWindowKeydown(event) {
      if (event.code === 'Escape') {
        container.classList.remove('open')
        window.removeEventListener('keydown', handleWindowKeydown)
      }
    }

    if (container.classList.contains('open')) container.classList.remove('open')
    else {
      container.classList.add('open')

      window.addEventListener(
        'click',
        () => container.classList.remove('open'),
        { once: true },
      )

      window.addEventListener('keydown', handleWindowKeydown)
    }
  })

  //** Text from selected option
  const selected = document.createElement('span')
  selected.innerText = select.selectedOptions[0].text
  container.appendChild(selected)

  //** Copying select classes
  select.classList.forEach((cls) => container.classList.add(cls))

  //** Inserting instead original select
  select.parentNode.insertBefore(container, select)
  select.style.display = 'none'

  //* Creating custom list of options
  const list = document.createElement('ul')

  //* Creating custom options
  Array.from(select.options).forEach((option) => {
    //* Ignoring hidden options
    if (option.hasAttribute('hidden')) return

    //* Creating custom option
    const item = document.createElement('li')

    //** Store value attribute to dataset
    if (option.hasAttribute('value')) item.dataset.value = option.value
    else item.dataset.value = option.text

    //** Providing disabled behavior
    if (option.hasAttribute('disabled')) item.classList.add('disabled')

    //** Text from option
    item.innerText = option.text

    onClickAndKeyboard(item, (event) => {
      event.stopPropagation()

      select.selectedIndex = option.index
      selected.innerText = option.text

      container.classList.remove('open')
      setTimeout(() => container.focus())
    })

    item.onclick = list.appendChild(item)
  })

  container.appendChild(list)
})

function onClickAndKeyboard(element, onClickHandler) {
  element.setAttribute('tabindex', '0')

  element.addEventListener('click', onClickHandler)

  element.addEventListener('keydown', (event) => {
    const activeElement = document.activeElement
    if (activeElement !== element) return

    if (event.code === 'Enter' || event.code === 'Space') {
      event.preventDefault()
      onClickHandler(event)
    }
  })
}

//* Output for range input percentage
const orderForm = document.getElementById('order-form')
orderForm.oninput = () => {
  orderForm.percentageOutput.value = orderForm.percentage.value + ' %'
}

//* Custom file inputs
const fileInputs = document.getElementsByClassName('file-input')

Array.from(fileInputs).forEach((input) => {
  const customButton = document.querySelector(`[aria-controls=${input.id}]`)
  customButton.onclick = () => input.click()
})
