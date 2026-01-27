// import express from 'express';
// import axios from 'axios';
// import cors from 'cors';
// import 'dotenv/config';

// const app = express();

// // ✅ CORS əlavə et
// app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // ✅ Health check
// app.get('/', (req, res) => {
//   res.json({ status: 'OK', message: 'Server işləyir' });
// });

// app.post('/api/webflow-lead', async (req, res) => {
//   const { name, email, phone, message } = req.body;

//   console.log('Incoming form data:', req.body);

//   try {
//     const response = await axios.post(
//       `${process.env.BITRIX_WEBHOOK_URL}/crm.lead.add`,
//       {
//         fields: {
//           TITLE: `Treva Website Contact - ${name || 'No name'}`,
//           NAME: name,
//           EMAIL: email ? [{ VALUE: email, VALUE_TYPE: 'WORK' }] : [],
//           PHONE: phone ? [{ VALUE: phone, VALUE_TYPE: 'WORK' }] : [],
//           COMMENTS: message,
//           SOURCE_ID: 'WEB'
//         }
//       }
//     );

//     console.log('Bitrix success:', response.data);
//     // ✅ JSON response
//     res.status(200).json({ success: true, message: 'Lead yaradıldı' });
//   } catch (err) {
//     console.error('Bitrix error:', err.response?.data || err.message);
//     // ✅ JSON error response
//     res.status(500).json({ success: false, message: 'Xəta baş verdi' });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// export default app; // ✅ Vercel üçün lazımdır
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// ✅ CORS for Webflow
app.use(cors({
 origin: ['https://www.treva.realestate', 'https://treva-2025.webflow.io', 'https://www.aranches'],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Health check
// app.get('/', (req, res) => res.json({ status: 'OK', message: 'Server işləyir' }));

// // OPTIONS preflight explicitly (optional)
// app.options('/api/webflow-lead', (req, res) => res.sendStatus(200));

// // POST form
// app.post('/api/webflow-lead', async (req, res) => {
//   const { name, email, phone, message } = req.body;
//   console.log('📥 Incoming form data:', req.body);

//   if (!name && !email && !phone && !message) {
//     return res.status(400).json({ success: false, message: 'Ən azı bir sahə doldurulmalıdır' });
//   }

//   try {
//     const bitrixData = {
//       fields: {
//         TITLE: `Treva Website Contact - ${name || email || 'Anonim'}`,
//         SOURCE_ID: 'WEB',
//         COMMENTS: message || ''
//       }
//     };

//     if (name) bitrixData.fields.NAME = name.trim();
//     if (email) bitrixData.fields.EMAIL = [{ VALUE: email.trim(), VALUE_TYPE: 'WORK' }];
//     if (phone) bitrixData.fields.PHONE = [{ VALUE: phone.trim(), VALUE_TYPE: 'WORK' }];

//     const response = await axios.post(
//       `${process.env.BITRIX_WEBHOOK_URL}/crm.lead.add`,
//       bitrixData,
//       { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
//     );

//     res.status(200).json({ success: true, message: 'Lead yaradıldı', leadId: response.data.result });

//   } catch (err) {
//     console.error('❌ Bitrix error:', err.response?.data || err.message);
//     res.status(500).json({ success: false, message: 'Xəta baş verdi' });
//   }
// });

// app.post('/api/webflow-registration', async (req, res) => {
//   const { name, email, phone, city } = req.body;

//   if (!name || !email || !phone) {
//     return res.status(400).json({ success: false, message: 'Name, email və phone mütləqdir' });
//   }

//   try {
//     // Bitrix-ə göndərmə
//     const bitrixData = {
//       fields: {
//         TITLE: `Treva Registration - ${name}`,
//         NAME: name,
//         EMAIL: [{ VALUE: email, VALUE_TYPE: 'WORK' }],
//         PHONE: [{ VALUE: phone, VALUE_TYPE: 'WORK' }],
//         COMMENTS: `Şəhər: ${city || ''}`,
//         SOURCE_ID: 'WEB'
//       }
//     };

//     const response = await axios.post(`${process.env.BITRIX_WEBHOOK_URL}/crm.lead.add`, bitrixData);

//     res.status(200).json({ success: true, leadId: response.data.result });

//   } catch (err) {
//     console.error('❌ Registration Bitrix error:', err.response?.data || err.message);
//     res.status(500).json({ success: false, message: 'Xəta baş verdi' });
//   }
// });


// // 404 handler
// app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint tapılmadı' }));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// export default app;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({ status: 'OK', message: 'Server işləyir' }));

// OPTIONS preflight explicitly (optional)
app.options('/api/webflow-lead', (req, res) => res.sendStatus(200));
app.options('/api/webflow-registration', (req, res) => res.sendStatus(200));
app.options('/api/webflow-broker', (req, res) => res.sendStatus(200));

// POST form - Original contact form
app.post('/api/webflow-lead', async (req, res) => {
  const { name, email, phone, message } = req.body;
  console.log('📥 Incoming form data:', req.body);

  if (!name && !email && !phone && !message) {
    return res.status(400).json({ success: false, message: 'Ən azı bir sahə doldurulmalıdır' });
  }

  try {
    const bitrixData = {
      fields: {
        TITLE: `Treva Website Contact - ${name || email || 'Anonim'}`,
        SOURCE_ID: 'WEB',
        COMMENTS: message || ''
      }
    };

    if (name) bitrixData.fields.NAME = name.trim();
    if (email) bitrixData.fields.EMAIL = [{ VALUE: email.trim(), VALUE_TYPE: 'WORK' }];
    if (phone) bitrixData.fields.PHONE = [{ VALUE: phone.trim(), VALUE_TYPE: 'WORK' }];

    const response = await axios.post(
      `${process.env.BITRIX_WEBHOOK_URL}/crm.lead.add`,
      bitrixData,
      { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
    );

    res.status(200).json({ success: true, message: 'Lead yaradıldı', leadId: response.data.result });

  } catch (err) {
    console.error('❌ Bitrix error:', err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'Xəta baş verdi' });
  }
});

// POST registration form
app.post('/api/webflow-registration', async (req, res) => {
  const { name, email, phone, city } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, message: 'Name, email və phone mütləqdir' });
  }

  try {
    const bitrixData = {
      fields: {
        TITLE: `Treva Registration - ${name}`,
        NAME: name,
        EMAIL: [{ VALUE: email, VALUE_TYPE: 'WORK' }],
        PHONE: [{ VALUE: phone, VALUE_TYPE: 'WORK' }],
        COMMENTS: `Şəhər: ${city || ''}`,
        SOURCE_ID: 'WEB'
      }
    };

    const response = await axios.post(`${process.env.BITRIX_WEBHOOK_URL}/crm.lead.add`, bitrixData);

    res.status(200).json({ success: true, leadId: response.data.result });

  } catch (err) {
    console.error('❌ Registration Bitrix error:', err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'Xəta baş verdi' });
  }
});

// 🆕 POST broker form - NEW ENDPOINT
app.post('/api/webflow-broker', async (req, res) => {
  const { fullName, phone, email, message } = req.body;
  console.log('📥 Incoming broker form data:', req.body);

  if (!fullName && !phone && !email && !message) {
    return res.status(400).json({ success: false, message: 'Ən azı bir sahə doldurulmalıdır' });
  }

  try {
    const bitrixData = {
      fields: {
        TITLE: `Treva Broker Request - ${fullName || email || 'Anonim'}`,
        SOURCE_ID: 'WEB',
        COMMENTS: `Broker sorğusu: ${message || 'Mesaj yoxdur'}`
      }
    };

    if (fullName) bitrixData.fields.NAME = fullName.trim();
    if (email) bitrixData.fields.EMAIL = [{ VALUE: email.trim(), VALUE_TYPE: 'WORK' }];
    if (phone) bitrixData.fields.PHONE = [{ VALUE: phone.trim(), VALUE_TYPE: 'WORK' }];

    const response = await axios.post(
      `${process.env.BITRIX_WEBHOOK_URL}/crm.lead.add`,
      bitrixData,
      { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Broker sorğunuz qeydə alındı', 
      leadId: response.data.result 
    });

  } catch (err) {
    console.error('❌ Broker Bitrix error:', err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'Xəta baş verdi' });
  }
});

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint tapılmadı' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;