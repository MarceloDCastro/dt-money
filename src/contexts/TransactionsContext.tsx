import { ReactNode, useEffect, useState, useCallback } from "react";
// import { api } from "../lib/axios";
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

const mockedTransactions: Transactions[] = [
    {
        id: 1,
        description: 'Desenvolvimento de site',
        type: 'income',
        category: 'Desenvolvimento',
        price: 8000,
        createdAt: new Date('2023-08-15')
    },
    {
        id: 2,
        description: 'Hamburguer',
        type: 'outcome',
        category: 'Alimentação',
        price: 45,
        createdAt: new Date('2023-08-15')
    },
    {
        id: 3,
        description: 'Desenvolvimento de aplicativo',
        type: 'income',
        category: 'Desenvolvimento',
        price: 7000,
        createdAt: new Date('2023-08-16')
    },
    {
        id: 4,
        description: 'Pizza',
        type: 'outcome',
        category: 'Alimentação',
        price: 53,
        createdAt: new Date('2023-08-16')
    }
];

export const TransactionsContext = createContext({} as TransactionContextType);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transactions[]>([]);
    const [transactionsTable, setTransactionsTable] = useState<Transactions[]>(mockedTransactions);

    const getTransactions = useCallback(async (query?: string) => {
        // const response = await api.get('transactions', {
        //     params: {
        //         _sort: 'createdAt',
        //         _order: 'desc',
        //         q: query
        //     }
        // })

        // setTransactions(response.data);

        const filteredTransactions = query
            ? transactionsTable.filter(({ description, category }) => 
                description.toLowerCase().includes(query.toLowerCase())
                || category.toLowerCase().includes(query.toLowerCase())
            )
            : transactionsTable;

        setTransactions(filteredTransactions);
    }, [transactionsTable])

    const createTransaction = useCallback(async (data: CreateTransactionParams) => {
        const newTransaction = {
            ...data,
            createdAt: new Date()
        };

        // const response = await api.post('transactions', newTransaction);

        // setTransactions(state => [response.data, ...state]);        

        setTransactionsTable(state => {
            const id = state[state.length - 1].id + 1;

            return [...state, {id, ...newTransaction}];
        });
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