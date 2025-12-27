import path from "path";
import { fileURLToPath } from "url";



async function openFrontendHtml(context) {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const filePath = path.join(__dirname, 'index.html')

    const page_ui = await context.newPage();
    await page_ui.goto(`file://${filePath}`)


    await page_ui.evaluate(() => {
        function initialize_ui() {
            const pastDiv = document.querySelector('.mainDiv_pastDates')
            const pastHeading = document.createElement('h2')
            pastHeading.textContent = 'Past Comparisons'
            const pastList = document.createElement('ul')
            pastList.classList.add('pastListUl')
            pastDiv.appendChild(pastHeading)
            pastDiv.appendChild(pastList)

            const currentDiv = document.querySelector('.mainDiv_currentDates')
            const currentHeading = document.createElement('h2')
            currentHeading.textContent = 'Current Comparison'
            const currentListDiv = document.createElement('div')
            currentListDiv.classList.add('currentListDiv')
            currentDiv.appendChild(currentHeading)
            currentDiv.appendChild(currentListDiv)
        }
        initialize_ui()
    })
    return page_ui;
}

async function dataIngest(page, evalTitles, newDate) {
    await page.evaluate(({ data, newDate }) => {
        const pastList = document.querySelector('.pastListUl')
        for (let title of data) {
            let pastListElem = document.createElement('li')
            pastList.classList.add('pastListElem')
            if (document.querySelector('.pastListElem')) {
                pastList.replaceChildren(pastListElem)
                pastListElem.textContent = `${title} + ${data.length - 1} other dates`
            } else {
                pastListElem.textContent = `${title}`
                pastList.appendChild(pastListElem)
            }
        }
        const currentListDiv = document.querySelector('.currentListDiv')
        let length = data.length

        if (length === 0) {
            let noCompDiv = document.createElement('div')
            noCompDiv.innerText = 'No Comparisons as of yet'
            noCompDiv.classList.add('noCompDiv')
            currentListDiv.appendChild(noCompDiv)
        }
        if (length > 0) {
            currentListDiv.replaceChildren()
            let lastAddedTitle = data[length - 1]
            let currentListElem = document.createElement('div')
            let pastListElem = document.createElement('div')
            console.log(newDate)
            currentListElem.innerText = `The next date is : ${newDate}`
            currentListDiv.append(currentListElem)
            let vs = document.createElement('div')
            vs.innerText = ' VS '
            currentListDiv.append(vs)
            console.log(lastAddedTitle)
            pastListElem.innerText = `The last added date : ${lastAddedTitle}`
            currentListDiv.append(pastListElem)
            let difference = lastAddedTitle - newDate
            let diffElem = document.createElement('div')
            const minutes_cov = 1000 * 60
            diffElem.innerText = `The next date is ${difference / minutes_cov} minutes ahead of the previously added date `
            currentListDiv.append(diffElem)
        }

    }, { data: evalTitles, newDate: newDate })
}

async function finished(uiPage) {
    await uiPage.evaluate(() => {
        const doneDiv = document.querySelector('.divDone')
        const finished_div = document.createElement('div')
        finished_div.innerText = 'All 100 recent dates are in newest to oldest order'
        finished_div.style.color = 'green'
        doneDiv.append(finished_div)
    })
}
async function return_done(uiPage) {
    await uiPage.bringToFront()
    const result = await uiPage.evaluate(() => {
        return new Promise((resolve) => {
            const button = document.querySelector('button')
            button.addEventListener('click', () => {
                resolve(true)
            })
        })
    })
    return result
}
export { openFrontendHtml, dataIngest, return_done, finished };
