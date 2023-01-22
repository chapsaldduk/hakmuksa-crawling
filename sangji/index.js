import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import resultInterface from "./resultInterface.js";
import fs from "fs";

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

async function crawling() {
  let crawlingResult = {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
  };
  const result = resultInterface;
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

  await driver.get(
    "https://www.sangji.ac.kr/prog/carteGuidance/kor/sub07_10_03/CS/calendar.do" // 상지대학교 창조관 학생식당
  );
  await driver.wait(until.elementLocated(By.className("obj")));
  let searchInput = await driver.findElements(By.className(`obj`));
  let crawlingDate = await driver.findElement(By.id("calTitle")).getText();
  result.date = crawlingDate.slice(0, crawlingDate.indexOf("일", 9) + 1);

  const days = [];
  for (let n = 2; n < 7; n++) {
    const day = `/html/body/div[5]/div/div/div[2]/div/div[2]/div[1]/table/thead/tr/th[${n}]/div/em`;
    let mealDay = await driver.findElement(By.xpath(day)).getText();
    mealDay = mealDay.slice(1, mealDay.length - 1);
    days.push(mealDay);
  }
  console.log(days);

  if (searchInput === null) {
    return 1;
  } else {
    const keys = Object.keys(crawlingResult); // ['mon', 'tue', 'wed', 'thu', 'fri']
    let i = 0;
    let j = 0;

    // Todo: loop?
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

    /** [ 'mon', 'tue', 'wed', 'thu', 'fri' ] */
    const result_keys = Object.keys(result.hak);

    for (let i = 0; i < keys.length; i++) {
      // i -> select day
      for (let j = 0; j < crawlingResult[keys[i]].length; j++) {
        // j -> select time

        /**  [ 'breakfast', 'lunch', 'dinner', 'date' ] */
        const result_keys_keys = Object.keys(result.hak[result_keys[i]]);
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
          result.hak[result_keys[i]][result_keys_keys[j]].menu.push(Menu.menu);
        }
      }
    }

    for (let i = 0; i < result_keys.length; i++) {
      result.hak[result_keys[i]].date = days[i];
    }

    // print result
    console.log("result print");
    const result_hak_keys = Object.keys(result.hak);
    for (let i = 0; i < result_hak_keys.length; i++) {
      console.log("\n" + result_hak_keys[i]);
      console.log(result.hak[result_hak_keys[i]]);
    }
    return result;
  }
}

async function main() {
  const result = await crawling();
  const jsonData = JSON.stringify(result);
  fs.writeFile(
    `./sangji/hak/상지대학교 ${result.date} 학식.json`,
    jsonData,
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
}

main();
