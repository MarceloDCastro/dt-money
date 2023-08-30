import { ReactNode, createContext, useEffect, useState } from "react";
import { api } from "../lib/axios";

interface TransactionContextType {
    transactions: Transactions[];
    getTransactions: (query?: string) => Promise<void>;
    createTransaction: (data: CreateTransactionParams) => Promise<void>;
}

interface Transactions {
    id: number;
    description: string;
    type: 'income' | 'outcome';
    category: string;
    price: number;
    createdAt: Date;
}

type CreateTransactionParams = Omit<Transactions, 'id' | 'createdAt'>;

interface TransactionsProviderProps {
    children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionContextType);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transactions[]>([]);

    async function getTransactions(query?: string) {
        const response = await api.get('transactions', {
            params: {
                _sort: 'createdAt',
                _order: 'desc',
                q: query
            }
        })

        setTransactions(response.data);
    }

    async function createTransaction(data: CreateTransactionParams) {
        const response = await api.post('transactions', {
            ...data,
            createdAt: new Date()
        });

        setTransactions(state => [response.data, ...state])
    }

    useEffect(() => {
        getTransactions()
    } , []);

    return (
        <TransactionsContext.Provider value={{ transactions, getTransactions, createTransaction }}>
            {children}
        </TransactionsContext.Provider>
    )
}