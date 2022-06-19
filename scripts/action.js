const SUBMISSION_URL_INDEX = 1; // "A"
const SUB_TRACK_INDEX = 11; // "L"
const SCORE_RANGE = 52; // "AZ" 
const TAS_URL = "http://7d15-23-27-44-176.ngrok.io"; // "https://tas-staging.herokuapp.com";

// TODO: exit early if url invalid.
const validURL = (url) => {
  if (/^http/gi.test(url)) return url;
  return null
}

/**
 * subTrackOptiossMaps maps the subtract to the language choice.
 */
const subTrackOptionsMaps = {
  "Front end - (HTML, CSS, JS)": "javascript",
  "Back end ( Javascript )": "javascript",
  "Back end  (PHP)": "php",
  "Back end  (Python)": "python",
}

/**
 * subTrackOptionsFallback 
 */
const subTrackOptionsFallback = (selection) => {
  const choices = Object.values(subTrackOptionsMaps);
  const subTrack = String(selection).toLowerCase();
  if (subTrack.includes('js')) return choices[0];
  if (subTrack.includes('javascript')) return choices[1];
  if (subTrack.includes('php')) return choices[2];
  if (subTrack.includes('python')) return choices[3];
  return null;
}

/**
 * fetch
 */
const fetch = (url, payload) => {
  let options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
    headers: {
      "Keep-Alive": "timeout=30, max=1000",
    },
  };
  return UrlFetchApp.fetch(url, options);
}

function MarkAll() {
  const spreadsheets = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheets.getActiveSheet();
  const table = sheet.getDataRange();

  // sort by range number
  const payload = table.getValues().reduce((acc, values, index) => {
    // skip header
    if (index === 0) return acc
    const url = validURL(values[SUBMISSION_URL_INDEX]);
    const language = subTrackOptionsFallback(values[SUB_TRACK_INDEX]);
    
    if (language === null) return acc; // skip unsupported languages
    return {
      ...acc,
      [index]: { url, language }
    }
  }, {})

  // fetch score data from server.
  const response = fetch(`${TAS_URL}/data/many`, payload)
  Logger.log(response)
  JSON.parse(response).map((v) => {
    sheet.getRange(v.index, SCORE_RANGE).setValue(v.score)
  })
}

function MarkOne() {
  const spreadsheets = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheets.getActiveSheet();

  // get the selected/highlighted range and values.
  const range = sheet.getActiveRange();
  const values = range.getValues()[0];

  const url = validURL(values[SUBMISSION_URL_INDEX]);
  const language = subTrackOptionsFallback(values[SUB_TRACK_INDEX]);

  Logger.log(url.toString());
  Logger.log(language.toString());

  // fetch score data from server.
  const response = fetch(`${TAS_URL}/data/one`, { url, language });
  Logger.log(response);

  const scoreCell = sheet.getRange(range.getRowIndex(), SCORE_RANGE);
  scoreCell.setValue(response);
  Logger.log(scoreCell.getValue());
}

function onOpen() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu("TAS ACTION")
    .addItem("Test Selected Range", "MarkOne")
    .addItem("Test All", "MarkAll")
    .addToUi();
}