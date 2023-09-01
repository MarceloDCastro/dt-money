import { ReactNode, useEffect, useState, useCallback } from "react";
import { api } from "../lib/axios";
import { createContext } from "use-context-selector";

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

    const getTransactions = useCallback(async (query?: string) => {
        const response = await api.get('transactions', {
            params: {
                _sort: 'createdAt',
                _order: 'desc',
                q: query
            }
        })

        setTransactions(response.data);
    }, [])

    const createTransaction = useCallback(async (data: CreateTransactionParams) => {
        const response = await api.post('transactions', {
            ...data,
            createdAt: new Date()
        });

        setTransactions(state => [response.data, ...state])
    }, [])

    useEffect(() => {
        getTransactions()
    } , [getTransactions]);

    return (
        <TransactionsContext.Provider value={{ transactions, getTransactions, createTransaction }}>
            {children}
        </TransactionsContext.Provider>
    )
}