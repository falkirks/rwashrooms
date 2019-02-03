#!/usr/bin/env node
'use strict';

const cl = require('corelocation');
const ora = require('ora');
const request = require('request');
const Table = require('cli-table3');
const humanizeDistance = require('humanize-distance');
const terminalLink = require('terminal-link');
const API_ENDPOINT = "https://www.refugerestrooms.org/api/v1/restrooms/by_location.json";

const spinner = ora('Locating you').start();

let loc = cl.getLocation();

spinner.color = 'yellow';
spinner.text = 'Finding washrooms';

request(API_ENDPOINT + "?lat=" + loc[1] + "&lng=" + loc[0], { json: true }, (err, res, body) => {
  if (err) {
    spinner.fail("Error connecting to Refuge Washrooms");
    return;
  }
  spinner.succeed("Done");
  const table = new Table({
    head: ['name', 'street', 'A?', 'U?', 'distance'],
    style: { 'padding-left': 1},
    chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
      , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
      , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ' '
      , 'right': '' , 'right-mid': '' , 'middle': ' ' },
  });


  body.forEach((washroom) => {
    table.push([
      washroom.name,
      washroom.street,
      washroom.accessible ? "✅" : "❌",
      washroom.unisex ? "✅" : "❌",
      terminalLink(humanizeDistance(
        washroom,
        {latitude: loc[1], longitude: loc[0]},
        'en-US',
        'metric'), 'https://maps.google.com/?q=' + washroom.latitude + ',' + washroom.longitude)
    ]);

  });

  console.log(table.toString());

});



