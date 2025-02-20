import React, { useState, useEffect } from 'react';

function App() {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description || !amount) return;

    if (editingId !== null) {
      setTransactions(
        transactions.map((transaction) =>
          transaction.id === editingId
            ? {
                ...transaction,
                description,
                amount: parseFloat(amount),
                type,
              }
            : transaction
        )
      );
      setEditingId(null);
    } else {
      const newTransaction = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        type,
        date: new Date().toISOString(),
      };
      setTransactions([newTransaction, ...transactions]);
    }

    setDescription('');
    setAmount('');
    setType('expense');
  };

  const handleEdit = (transaction) => {
    setDescription(transaction.description);
    setAmount(transaction.amount.toString());
    setType(transaction.type);
    setEditingId(transaction.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      setTransactions(transactions.filter((transaction) => transaction.id !== id));
    }
  };

  const totalBalance = transactions.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  // Prevent non-numeric input
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: '24px',
          marginBottom: '10px',
          fontWeight: 'bold',
        }}
      >
        Pencatatan Keuangan
      </h1>

      <div
        style={{
          fontSize: '20px',
          marginBottom: '20px',
        }}
      >
        Saldo: Rp {totalBalance.toLocaleString()}
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          <input
            type="text"
            placeholder="Deskripsi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              flex: '1',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              width: '60%',
            }}
          />
          <input
            inputMode="numeric"
            pattern="\d*"
            placeholder="Jumlah"
            value={amount}
            onChange={handleAmountChange}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              width: '40%',
              maxWidth: '120px',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            gap: '8px',
          }}
        >
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              flex: '1',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              backgroundColor: 'white',
            }}
          >
            <option value="expense">Pengeluaran</option>
            <option value="income">Pemasukan</option>
          </select>
          <button
            type="submit"
            style={{
              flex: '1',
              padding: '8px 12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          >
            {editingId !== null ? 'Update' : 'Tambah'}
          </button>
        </div>
      </form>

      <h2
        style={{
          fontSize: '20px',
          marginBottom: '15px',
          fontWeight: 'bold',
        }}
      >
        Riwayat Transaksi
      </h2>

      <div style={{ marginTop: '10px' }}>
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            style={{
              marginBottom: '15px',
              borderBottom: '1px solid #eee',
              paddingBottom: '15px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '5px',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '4px' }}>{transaction.description}</div>
                <div
                  style={{
                    fontSize: '14px',
                    color: transaction.type === 'income' ? 'green' : 'red',
                  }}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  Rp {transaction.amount.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#666',
                    marginTop: '4px',
                  }}
                >
                  {new Date(transaction.date).toLocaleDateString()}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start',
                }}
              >
                <button
                  onClick={() => handleEdit(transaction)}
                  style={{
                    padding: '4px 12px',
                    backgroundColor: '#ffc107',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  style={{
                    padding: '4px 12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
