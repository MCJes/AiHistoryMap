// webP check
function testWebP(callback) {
  var webP = new Image()
  webP.onload = webP.onerror = function () {
    callback(webP.height == 2)
  }
  webP.src =
    'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
}

testWebP(function (support) {
  if (support == true) {
    document.querySelector('body').classList.add('webp')
  } else {
    document.querySelector('body').classList.add('no-webp')
  }
})

window.onload = () => {
  const mainContainer = document.querySelector('.main .container')
  let section

  section = createSection(
    {
      yearInterval: '1940-1950',
    },
    types.first,
  )

  mainContainer.append(section)

  section = createSection(
    {
      yearInterval: '1950-1960',
    },
    types.default,
  )
  mainContainer.append(section)

  section = createSection(
    {
      yearInterval: '1960-1970',
    },
    types.last,
  )
  mainContainer.append(section)
}

const types = {
  default: 'default',
  first: 'first',
  last: 'last',
}

function createSection(sectionInfo, type) {
  const section = document.createElement('section')
  section.classList.add('main__section')
  const sectionBody = document.createElement('div')
  sectionBody.classList.add('main__section-body')
  section.setAttribute('data-year', sectionInfo.yearInterval)
  const col = document.createElement('div')
  col.classList.add('main__section-col')
  const year = document.createElement('div')
  year.classList.add('main__section-year')
  year.innerText = sectionInfo.yearInterval.split('-')[0]

  const links = document.createElement('div')
  links.classList.add('main__section-links')
  // const link = document.createElement('p')
  // link.classList.add('main__section-link')
  sectionBody.append(col)

  if (type === types.first) {
    const author = document.createElement('div')
    author.classList.add('main__section-autor')
    const p1 = document.createElement('p')
    p1.innerText =
      'AIHistoryMap. Историческая карта искусственного интеллекта, v.1.5,'
    const p2 = document.createElement('p')
    p2.classList.add('left')
    p2.innerText = '© проф. Игорь Н. Глухих'
    author.append(p1)
    author.append(p2)
    sectionBody.append(author)
  }

  if (type === types.last) {
    const arrow = document.createElement('div')
    arrow.classList.add('triangle')
    const inArrow = document.createElement('div')
    inArrow.classList.add('inner-triangle')

    arrow.append(inArrow)
    sectionBody.append(arrow)
  }

  sectionBody.append(year)
  sectionBody.append(links)

  section.append(sectionBody)

  return section
}
