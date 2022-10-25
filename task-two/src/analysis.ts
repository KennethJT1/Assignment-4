import * as fs from 'fs';
import * as EmailValidator from 'email-validator';
//const fs = require('fs');

/**
 * First task - Read the csv files in the inputPath and analyse them
 *
 * @param {string[]} inputPaths An array of csv files to read
 * @param {string} outputPath The path to output the analysis
 */

interface Categories {
  [key: string]: number;
}

function analyseFiles(inputPaths: string[], outputPath: string) {
  //iterating through the array of inputPaths
  for (const path of inputPaths) {
    // console.log(path);
    const readStream = fs.createReadStream(path, 'utf8');
    const writeStream = fs.createWriteStream(outputPath);
    readStream.on('data', (file: string) => {
      // console.log(file);
      //trimming white spaces, splitting by new line
      let fileArr = file.trim().split('\n');
      // console.log(fileArr);

      //removing the 'Emails' heading and getting unique arr
      const emailWord = fileArr.shift();
      // console.log(fileArr);

      fileArr = [...new Set(fileArr)];
      // console.log(fileArr);

      const totalEmailsParsed: number = fileArr.length;
      // console.log(totalEmailsParsed);

      //filtering to get only valid emails
      const validEmails = fileArr.filter((value: string) =>
        EmailValidator.validate(value),
      );
      // console.log(validEmails)
      const validEmailsLength: number = validEmails.length;

      const validDomainsArr: string[] = [];
      const categories: Categories = {};

      //going through the valid emails splitting by '@' to get just their domains
      for (const email of validEmails) {
        const domains = email.split('@').splice(1).join('');
        // console.log(domains);

        // categories[domains] ? categories[domains]++ : (categories[domains] = 1);
        if (!categories[domains]) {
          categories[domains] = 1;
        } else {
          categories[domains]++;
        }
        // console.log(domains);
        //pushing only unique domains
        if (validDomainsArr.includes(domains)) {
          continue;
        } else {
          validDomainsArr.push(domains);
        }
      }

      const result: Record<string, unknown> = {};
      result['valid-domains'] = validDomainsArr;
      result['totalEmailsParsed'] = totalEmailsParsed;
      result['totalValidEmails'] = validEmailsLength;
      result['categories'] = categories;
      // console.log(result);
      
      //writing into another file
      writeStream.write(JSON.stringify(result, null, 2));
    });
    readStream.on('error', (err) => {
      if (err) throw new Error(err);
    });
  }
}
analyseFiles(
  ['../fixtures/inputs/small-sample.csv'],
  '../fixtures/outputs/test.json',
);
export default analyseFiles;