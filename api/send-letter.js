module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY not set');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const { email } = req.body || {};
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const letterHtml = `
<div style="max-width:600px;margin:0 auto;font-family:Georgia,serif;color:#3a2010;background:#fdf6ef;padding:40px 36px;border-radius:12px;">
  <p style="font-size:12px;letter-spacing:2px;color:#9a6a40;text-transform:uppercase;margin-bottom:32px;">a little something for you 🎀</p>
  <p style="font-size:18px;font-style:italic;margin-bottom:28px;">Dear Liliana,</p>
  <p style="font-size:15px;line-height:1.9;margin-bottom:18px;">It's really, really nice to be your best friend.</p>
  <p style="font-size:15px;line-height:1.9;margin-bottom:18px;">First of all, I miss you so much. I honestly can't believe how fast time has passed. It feels like yesterday that I met you for the first time outside the bathroom, and somehow from that moment, you became such an important person in my life.</p>
  <p style="font-size:15px;line-height:1.9;margin-bottom:18px;">I know it's not always easy to maintain a friendship when we're long distance, living different lives in different places, but I hope you always know that I'm here for you. No matter how much time passes, no matter where we are, I'll always be cheering for you and loving you from wherever I am.</p>
  <p style="font-size:15px;line-height:1.9;margin-bottom:18px;">I wanted to send you this voice note for your birthday because I just really wanted you to hear my voice and know how much I love you. This might be a long message, so I'll also write everything down for you to read haha.</p>
  <p style="font-size:15px;line-height:1.9;margin-bottom:18px;">Anyway, I just want to say this: I really, really love you, and I truly cherish you as a friend. You make my life ten times better. I honestly can't imagine my life without you. When I was in New York, you were one of the people who made it feel like home, and even now, I still consider you one of my best friends.</p>
  <p style="font-size:15px;line-height:1.9;margin-bottom:18px;">I want you to be at my wedding. I want you to be one of my bridesmaids. I want you to be part of every important chapter in my life because you mean that much to me.</p>
  <p style="font-size:15px;line-height:1.9;margin-bottom:18px;">I'm getting emotional saying all of this, but I just really miss you. I think you are someone who truly takes care of the people around you. You protect the people you love, you stand up for them, and you show up for them no matter what. I adore that about you so much.</p>
  <p style="font-size:15px;line-height:1.9;margin-bottom:18px;">You have the brightest personality. You are so sweet, so funny, and so full of life, but at the same time, you are also so strong. You're building your life, buying a house, doing all these amazing things, and I'm just so, so proud of you. I'm proud of the person you are, and I'm proud to call you one of my best friends.</p>
  <p style="font-size:15px;line-height:1.9;margin-bottom:18px;">I really hope this next year brings you everything you've been wishing for. I hope life is kind to you. I hope you feel loved, supported, protected, and celebrated — not just today, but every day.</p>
  <p style="font-size:15px;line-height:1.9;margin-bottom:18px;">Also, please never stop updating me on your crazy stories and your life in New York. Hearing about your life makes me feel closer to you, and it reminds me that even though we're far away, our friendship is still so special to me.</p>
  <p style="font-size:17px;font-style:italic;line-height:1.9;margin-top:32px;color:#6a3a18;">Happy birthday, my love. I love you so much, and I'm so lucky to have you in my life. 🎀</p>
  <p style="font-size:13px;color:#c0a080;margin-top:36px;border-top:1px solid #e8d0b0;padding-top:18px;">with love, Tingting</p>
</div>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Tingting <onboarding@resend.dev>',
        to: [email],
        subject: '🎀 Happy Birthday Liliana — a letter from Tingting',
        html: letterHtml,
      }),
    });

    const data = await response.json();
    console.log('Resend response:', response.status, JSON.stringify(data));

    if (!response.ok) {
      return res.status(500).json({ error: data.message || 'Send failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Send error:', e.message);
    return res.status(500).json({ error: e.message });
  }
};
