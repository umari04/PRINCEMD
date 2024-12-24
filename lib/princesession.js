// PRINCE PROPERTY DON'T TOUCH IT OTHERWISE YOU WILL BE FAMOUS IN THE DEPLOYERS AS A CODE THEIF AND JUNIOR DEVELOPER






import { fileURLToPath } from 'url';
import path from 'path';
import { writeFileSync } from 'fs';
import * as mega from 'megajs';

async function processTxtAndSaveCredentials(txt) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  let decodedData;

  // Check if the input is Base64 or a Mega URL
  const isBase64 = /^[a-zA-Z0-9+/]+={0,2}$/.test(txt);
  const isMega = txt.startsWith('Prince~');

  if (isBase64) {
    // Handle Base64 input
    decodedData = Buffer.from(txt, 'base64').toString('utf-8');
  } else if (isMega) {
    // Handle Mega.nz input
    const megaCode = txt.replace('Prince~', '');
    const megaUrl = `https://mega.nz/file/${megaCode}`;
    console.log('Mega URL:', megaUrl);

    const file = mega.File.fromURL(megaUrl);

    try {
      // Download file from Mega
      const stream = file.download();
      let data = '';
      for await (const chunk of stream) {
        data += chunk.toString();
      }
      // Convert downloaded data to JSON
      decodedData = data;
      console.log('Downloaded Mega Data:', decodedData);
    } catch (error) {
      console.error('Error downloading from Mega.nz:', error);
      return;
    }
  } else {
    console.error('Invalid input: Neither Base64 nor Mega URL.');
    return;
  }

  // Validate and Save the credentials
  try {
    const credsPath = path.join(__dirname, '..', 'sessions', 'creds.json');

    // Check if the decoded data is valid JSON
    let parsedData;
    try {
      parsedData = JSON.parse(decodedData);
    } catch (error) {
      console.error('Invalid JSON format in decoded data:', error);
      return;
    }

    // Save valid JSON data to creds.json
    writeFileSync(credsPath, JSON.stringify(parsedData, null, 2));
    console.log('Credentials saved to creds.json');
  } catch (error) {
    console.error('Error saving credentials:', error);
  }
}

export default processTxtAndSaveCredentials;
