import * as fs from 'fs';
import * as dns from 'dns';

/**
 * Stretch goal - Validate all the emails in this files and output the report
 *
 * @param {string[]} inputPath An array of csv files to read
 * @param {string} outputFile The path where to output the report
 */
function validateEmailAddresses(inputPath: string[], outputFile: string) {
  for (const path of inputPath) {
    const readStream = fs.createReadStream(path, 'utf8');
    const writeStream = fs.createWriteStream(outputFile);
    const logStream = fs.createWriteStream(outputFile);
    readStream.on('data', (file: string) => {
      let fileArr = file.trim().split('\n');
      // console.log(fileArr);
      const emailWord = fileArr.shift();
      // console.log(emailWord);
      fileArr = [...new Set(fileArr)];

      for (const email of fileArr) {
        const domains = email.split('@').splice(1).join('');
        dns.resolveMx(domains, (err, data) => {
          if (data !== undefined) {
            logStream.write(email + '\n'); //writing the emails joining them with newline
          }
        });
      }
      writeStream.write(emailWord + '\n'); //first writing the word Emails
    });
    readStream.on('error', (err) => {
      if (err) throw new Error(err);
    });
  }
}
validateEmailAddresses(
  ['./fixtures/inputs/small-sample.csv'],
  './fixtures/outputs/test.csv',
);
export default validateEmailAddresses;
