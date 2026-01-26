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

  // 🔍 DEBUG - göndərilən datanı göstər
  console.log('📥 Incoming form data:', req.body);
  console.log('📊 Parsed values:', { name, email, phone, message });

  // ✅ Validation - ən azı bir field dolu olmalıdır
  if (!name && !email && !phone && !message) {
    console.log('❌ Validation failed: All fields empty');
    return res.status(400).json({ 
      success: false, 
      message: 'Ən azı bir sahə doldurulmalıdır' 
    });
  }

  try {
    // ✅ Bitrix üçün data hazırlayırıq
    const bitrixData = {
      fields: {
        TITLE: `Treva Website Contact - ${name || email || 'Anonim'}`,
        SOURCE_ID: 'WEB',
        COMMENTS: message || ''
      }
    };

    // ✅ Yalnız dolu fieldləri əlavə et
    if (name && name.trim()) {
      bitrixData.fields.NAME = name.trim();
    }

    if (email && email.trim()) {
      bitrixData.fields.EMAIL = [{ VALUE: email.trim(), VALUE_TYPE: 'WORK' }];
    }

    if (phone && phone.trim()) {
      bitrixData.fields.PHONE = [{ VALUE: phone.trim(), VALUE_TYPE: 'WORK' }];
    }

    console.log('📤 Sending to Bitrix:', JSON.stringify(bitrixData, null, 2));

    const response = await axios.post(
      `${process.env.BITRIX_WEBHOOK_URL}/crm.lead.add`,
      bitrixData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 saniyə timeout
      }
    );

    console.log('✅ Bitrix success:', response.data);
    
    // ✅ Uğurlu response
    res.status(200).json({ 
      success: true, 
      message: 'Lead uğurla yaradıldı',
      leadId: response.data.result 
    });

  } catch (err) {
    // ✅ Detallı error logging
    console.error('❌ Bitrix error:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      config: err.config?.url
    });

    // ✅ User-friendly error response
    res.status(500).json({ 
      success: false, 
      message: 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint tapılmadı' 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app; 