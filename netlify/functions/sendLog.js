import fetch from 'node-fetch';

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { message, level = 'INFO' } = JSON.parse(event.body);
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Telegram credentials not configured');
    }

    const timestamp = new Date().toLocaleString('ru-RU');
    const formattedMessage = `🪵 [MINI-APP ${level}]\n⏰ ${timestamp}\n📝 ${message}`;
    const encodedText = encodeURIComponent(formattedMessage);
    
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodedText}`;

    const response = await fetch(telegramUrl);
    const data = await response.json();

    if (data.ok) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'success' }),
      };
    } else {
      throw new Error(data.description || 'Telegram API error');
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to send log' }),
    };
  }
};