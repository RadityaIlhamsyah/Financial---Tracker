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
      setTransactions(transactions.map(transaction => 
        transaction.id === editingId 
          ? {
              ...transaction,
              description,
              amount: parseFloat(amount),
              type
            }
          : transaction
      ));
      setEditingId(null);
    } else {
      const newTransaction = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        type,
        date: new Date().toISOString()
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
      setTransactions(transactions.filter(transaction => transaction.id !== id));
    }
  };

  const totalBalance = transactions.reduce((acc, curr) => {
    return curr.type === 'income' 
      ? acc + curr.amount 
      : acc - curr.amount;
  }, 0);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h1 style={{ marginBottom: '20px' }}>Pencatatan Keuangan</h1>
        
        <div style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '20px'
        }}>
          Saldo: Rp {totalBalance.toLocaleString()}
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Deskripsi"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ 
                flex: 1,
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
            <input
              type="number"
              placeholder="Jumlah"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ 
                width: '150px',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ 
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            >
              <option value="expense">Pengeluaran</option>
              <option value="income">Pemasukan</option>
            </select>
            <button
              type="submit"
              style={{ 
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {editingId !== null ? 'Update' : 'Tambah'}
            </button>
          </div>
        </form>

        <h2 style={{ marginBottom: '15px' }}>Riwayat Transaksi</h2>
        <div>
          {transactions.map(transaction => (
            <div
              key={transaction.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                borderBottom: '1px solid #eee',
                marginBottom: '10px'
              }}
            >
              <div>
                <div style={{ fontWeight: '500' }}>{transaction.description}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {new Date(transaction.date).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ 
                  fontWeight: 'bold',
                  color: transaction.type === 'income' ? 'green' : 'red'
                }}>
                  {transaction.type === 'income' ? '+' : '-'}
                  Rp {transaction.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => handleEdit(transaction)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#ffc107',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;