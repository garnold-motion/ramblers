// src/config/sheets.js

const SHEET_ID = "2PACX-1vSTV2u2qZRaxVYdmuUljK4VG8ay4eECd6DFXB2fy0o0BIq65-XakEXTz7_GvxpCWpEctIW9FIiSVJ3l";

const GIDS = {
  beers: "0",
  food: "2077765450",
  specials: "1915634953",
  quiz: "2087075376",
  wine: "2095902202",
};

const buildURL = (gid) =>
  `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?gid=${gid}&single=true&output=csv`;

export const SHEET_URLS = {
  beers: buildURL(GIDS.beers),
  food: buildURL(GIDS.food),
  specials: buildURL(GIDS.specials),
  quiz: buildURL(GIDS.quiz),
  wine: buildURL(GIDS.wine),
};
