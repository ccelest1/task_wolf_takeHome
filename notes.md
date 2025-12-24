# notes
- Looking at the current ycombinator website, current articles are paginated by a `More` button
    * Articles are offset + 29 articles, first page (1-30) inclusive and then second page (31-60) inclusive and so on
    * To get to 100
        - 1-30
        - 31-60
        - 61-90
        - 91-120
        * Cutoff is 4 interactions with current pagination mechanic
    * Time range of articles is from 1 minute to x hours

## Approach
- is_older = True
    * iterate through each article i=0 -> 99, and ask is the Date() taken from the element date is older or equal to the previous date
        * if not, is_older return False -> exit 'found article out order'
        * return 'True: First 100 articles are sroted from newest to oldest'

## Run
`npx playwright test`

```
/ const locator = page.frameLocator('.age').getByRole('span')

  let [current, previous] = [1, 0]
  let page_counter = 0
  function check_and_navigate(previous_element, current_element, page_counter) {
    // if current_element mod 30 === 0, increment page_counter
    if (current_element % 30 === 0) {
      page_counter += 1
    }
    // if date of current_element is older than that of previous, return message
  }

  // check_and_navigate(current, previous, page_counter)
```
