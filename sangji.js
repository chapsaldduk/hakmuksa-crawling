const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

/** to separate menu and title */
async function getMenuTitle(string) {
  let result = {
    title: "",
    menu: "",
  };
  result.title = string.slice(0, string.indexOf("]") + 1);
  result.menu = string.slice(string.indexOf("]") + 2, string.length + 1);
  return result;
}

async function main() {
  let crawlingResult = {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
  };
  const result = {
    hak: {
      mon: {
        breakfast: {
          title: [],
          menu: [],
        },
        lunch: {
          title: [],
          menu: [],
        },
        dinner: {
          title: [],
          menu: [],
        },
      },
      tue: {
        breakfast: {
          title: [],
          menu: [],
        },
        lunch: {
          title: [],
          menu: [],
        },
        dinner: {
          title: [],
          menu: [],
        },
      },
      wed: {
        breakfast: {
          title: [],
          menu: [],
        },
        lunch: {
          title: [],
          menu: [],
        },
        dinner: {
          title: [],
          menu: [],
        },
      },
      thu: {
        breakfast: {
          title: [],
          menu: [],
        },
        lunch: {
          title: [],
          menu: [],
        },
        dinner: {
          title: [],
          menu: [],
        },
      },
      fri: {
        breakfast: {
          title: [],
          menu: [],
        },
        lunch: {
          title: [],
          menu: [],
        },
        dinner: {
          title: [],
          menu: [],
        },
      },
    },
  };
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(
      new chrome.Options()
        .headless()
        .addArguments("--disable-gpu", "window-size=1920x1080", "lang=ko_KR")
    ) // process in background
    .build();
  let userAgent = await driver.executeScript("return navigator.userAgent;");
  console.log("[UserAgent]", userAgent);
  try {
    await driver.get(
      "https://www.sangji.ac.kr/prog/carteGuidance/kor/sub07_10_03/CS/calendar.do" // 상지대학교 창조관 학생식당
    );
    await driver.wait(until.elementLocated(By.className("obj")));
    let searchInput = await driver.findElements(By.className(`obj`));
    if (searchInput === null) {
      return 1;
    } else {
      const keys = Object.keys(crawlingResult); // ['mon', 'tue', 'wed', 'thu', 'fri']
      let i = 0;
      let j = 0;
      while (1) {
        crawlingResult[keys[j]].push(await searchInput[i].getText());
        i++;
        j++;
        if (j > 4) {
          j = 0;
        }
        if (i >= 15) {
          break;
        }
      }
      console.log(crawlingResult);
      result_keys = Object.keys(result.hak); // [ 'mon', 'tue', 'wed', 'thu', 'fri' ]

      for (let i = 0; i < keys.length; i++) {
        // i -> select day
        for (let j = 0; j < crawlingResult[keys[i]].length; j++) {
          // j -> select time
          const result_keys_keys = Object.keys(result.hak[result_keys[i]]); // [ 'breakfast', 'lunch', 'dinner' ]
          if (crawlingResult[keys[i]][j] === "") {
            continue;
          }
          if (crawlingResult[keys[i]][j].indexOf("[", 1) !== -1) {
            // assume menu is below 2
            let secondMenu = crawlingResult[keys[i]][j].slice(
              crawlingResult[keys[i]][j].indexOf("[", 1)
            );
            let firstMenu = crawlingResult[keys[i]][j].substring(
              0,
              crawlingResult[keys[i]][j].indexOf("[", 1) - 1
            );
            crawlingResult[keys[i]][j] = firstMenu;

            // separate title and menu to json
            firstMenu = await getMenuTitle(firstMenu);
            secondMenu = await getMenuTitle(secondMenu);

            // add to result
            result.hak[result_keys[i]][result_keys_keys[j]].title.push(
              firstMenu.title,
              secondMenu.title
            );
            result.hak[result_keys[i]][result_keys_keys[j]].menu.push(
              firstMenu.menu,
              secondMenu.menu
            );
          } else {
            let Menu = crawlingResult[keys[i]][j];
            Menu = await getMenuTitle(Menu);
            result.hak[result_keys[i]][result_keys_keys[j]].title.push(
              Menu.title
            );
            result.hak[result_keys[i]][result_keys_keys[j]].menu.push(
              Menu.menu
            );
          }
        }
      }
      console.log("result test");
      console.log(result.hak.mon);
    }
  } finally {
    driver.quit();
  }
}

main();
