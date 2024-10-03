"use client"; 

import { useState } from "react"; 
import Image from "next/image";
import Container from "./components/Container";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NextLogo from './../../public/next.svg';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Graph from "./components/Grah";


export default function Home() {
    const { data: session } = useSession();
    if (!session) redirect("/login");
    
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('income'); 
    const [note, setNote] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [total, setTotal] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (amount <= 0) {
            alert("Amount must be greater than zero.");
            return;
        }
    
        const transaction = { amount, date, type, note };
    
        console.log('Submitting transaction:', transaction);  // Log transaction before submission
        
        const res = await fetch('/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction),
        });

        if (res.ok) {
            const newTransaction = await res.json();
            console.log('New transaction received:', newTransaction);  // Log the transaction received from the server
    
            setTransactions([...transactions, newTransaction]);
    
            const newTotal = type === 'income' ? total + parseFloat(amount) : total - parseFloat(amount);
            setTotal(newTotal);
    
            setAmount('');
            setDate('');
            setType('income');
            setNote('');
        } else {
            console.error('Failed to add transaction');
        }
    };

    return (
        <main>
            <Container>
                <Navbar session={session} />
                <div className="flex-grow text-center p-10">
                    <h3 className="text-5xl">Welcome, {session?.user?.name}</h3>
                    <p className="text-2xl mt-3">Your email address: {session?.user?.email}</p>
                    <p className="text-2xl mt-3">Your user role: {session?.user?.role}</p>

                    {/* Form สำหรับบันทึกรายรับรายจ่าย */}
                    <form onSubmit={handleSubmit} className="mt-5">
                        <input 
                            type="number" 
                            placeholder="Amount" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            required 
                        />
                        <input 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                            required 
                        />
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder="Note" 
                            value={note} 
                            onChange={(e) => setNote(e.target.value)} 
                        />
                        <button type="submit">Add Transaction</button>
                    </form>

                    {/* แสดงรายการรายรับรายจ่าย */}
                    <ul>
                        {transactions.map((transaction, index) => (
                            <li key={index} className="mt-3">
                                <div>
                                    <strong>Amount:</strong> {transaction.amount ? parseFloat(transaction.amount).toLocaleString() : 'N/A'}
                                </div>
                                <div>
                                    <strong>Date:</strong> {transaction.date || 'N/A'}
                                </div>
                                <div>
                                    <strong>Type:</strong> {transaction.type ? transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1) : 'N/A'}
                                </div>
                                <div>
                                    <strong>Note:</strong> {transaction.note || 'N/A'}
                                </div>
                            </li>
                        ))}
                    </ul>
                    
                    {/* แสดงยอดรวม */}
                    <h4 className="mt-5">Total: {total.toLocaleString()}</h4>
                    
                </div>
                <Graph transactions={transactions}/>
                <Footer />
            </Container>
        </main>
    );
}
