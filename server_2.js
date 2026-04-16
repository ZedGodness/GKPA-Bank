// server.js 
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Примерна база (mock)
const accounts = [
  { iban: 'BG11AAAA11111111111111', balance: 5000, bankCode: 'AAAA' },
  { iban: 'BG22AAAA22222222222222', balance: 3000, bankCode: 'AAAA' }
];

const DAILY_LIMIT = 2000;

// Помощни функции
function getBankCodeFromIBAN(iban) {
  return iban.substring(4, 8);
}

function findAccount(iban) {
  return accounts.find(acc => acc.iban === iban);
}

// POST маршрут
app.post('/bankAPI/transactions/', async (req, res) => {
  try {
    const { IBAN_sender, IBAN_receiver, amount, currency, reason } = req.body;

    const senderAccount = findAccount(IBAN_sender);

    if (!senderAccount) {
      return res.status(404).json({ code: 602, message: 'Sender not found' });
    }

    //  Проверка за лимит (604)
    if (amount > DAILY_LIMIT) {
      return res.status(400).json({
        code: 604,
        message: 'Daily transfer limit exceeded'
      });
    }

    //  Проверка за наличност (601)
    if (senderAccount.balance < amount) {
      return res.status(400).json({
        code: 601,
        message: 'Insufficient funds'
      });
    }

    const senderBankCode = getBankCodeFromIBAN(IBAN_sender);
    const receiverBankCode = getBankCodeFromIBAN(IBAN_receiver);

    // =========================
    // ВЪТРЕШЕН ПРЕВОД (605)
    // =========================
    if (senderBankCode === receiverBankCode) {
      const receiverAccount = findAccount(IBAN_receiver);

      if (!receiverAccount) {
        return res.status(404).json({
          code: 602,
          message: 'Receiver not found'
        });
      }

      // трансфер
      senderAccount.balance -= amount;
      receiverAccount.balance += amount;

      return res.status(200).json({
        code: 605,
        message: 'Internal transfer successful',
        data: {
          from: IBAN_sender,
          to: IBAN_receiver,
          amount,
          currency
        }
      });
    }

    // =========================
    //  ВЪНШЕН ПРЕВОД
    // =========================

    try {
      // 📡 Взимане на банка от регистъра
      const registryResponse = await axios.get(
        `http://localhost:4000/bankRegister/bank/${receiverBankCode}`
      );

      const externalBank = registryResponse.data;

      if (!externalBank || !externalBank.apiUrl) {
        return res.status(404).json({
          code: 602,
          message: 'Receiver bank not found in registry'
        });
      }

      // 📡 Изпращане към външна банка
      const externalResponse = await axios.post(
        `${externalBank.apiUrl}/bankAPI/transactions/`,
        {
          IBAN_sender,
          IBAN_receiver,
          amount,
          currency,
          reason
        }
      );

      // 🧾 Обработка на отговор
      const { code } = externalResponse.data;

      // Успешен превод
      if (code === 605) {
        senderAccount.balance -= amount;

        return res.status(200).json({
          code: 701,
          message: 'External transfer successful',
          data: externalResponse.data
        });
      }

      // Отказ от външна банка
      return res.status(400).json({
        code: 651,
        message: 'External bank rejected transaction',
        details: externalResponse.data
      });

    } catch (err) {
      return res.status(500).json({
        code: 602,
        message: 'Error communicating with registry or external bank',
        error: err.message
      });
    }

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// старт
app.listen(3000, () => {
  console.log('Bank API running on port 3000');
});
