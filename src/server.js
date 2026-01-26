import express from 'express';
import axios from 'axios';
import 'dotenv/config';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




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
          EMAIL: email
            ? [{ VALUE: email, VALUE_TYPE: 'WORK' }]
            : [],
          PHONE: phone
            ? [{ VALUE: phone, VALUE_TYPE: 'WORK' }]
            : [],
          COMMENTS: message,
          SOURCE_ID: 'WEB'
        }
      }
    );

    console.log('Bitrix success:', response.data);
    res.status(200).send('OK');
  } catch (err) {
    console.error(
      'Bitrix error:',
      err.response?.data || err.message
    );
    res.status(500).send('Bitrix error');
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
