import express from 'express';
import axios from 'axios';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// ✅ CORS əlavə et
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Health check
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Server işləyir' });
});

app.post('/api/webflow-lead', async (req, res) => {
  const { name, email, phone, message } = req.body;

  console.log('Incoming form data:', req.body);

  try {
    const response = await axios.post(
      `${process.env.BITRIX_WEBHOOK_URL}/crm.lead.add`,
      {
        fields: {
          TITLE: `Webflow Lead - ${name || 'No name'}`,
          NAME: name,
          EMAIL: email ? [{ VALUE: email, VALUE_TYPE: 'WORK' }] : [],
          PHONE: phone ? [{ VALUE: phone, VALUE_TYPE: 'WORK' }] : [],
          COMMENTS: message,
          SOURCE_ID: 'WEB'
        }
      }
    );

    console.log('Bitrix success:', response.data);
    // ✅ JSON response
    res.status(200).json({ success: true, message: 'Lead yaradıldı' });
  } catch (err) {
    console.error('Bitrix error:', err.response?.data || err.message);
    // ✅ JSON error response
    res.status(500).json({ success: false, message: 'Xəta baş verdi' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; // ✅ Vercel üçün lazımdır