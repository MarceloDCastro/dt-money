import { CloseButton, Content, Overlay, TransactionType, TransactionTypeButton } from './styles'
import { ArrowCircleDown, ArrowCircleUp, X } from 'phosphor-react'
import * as Dialog from '@radix-ui/react-dialog'
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TransactionsContext } from '../../contexts/TransactionsContext';
import { useContextSelector } from 'use-context-selector';

const newTransactionModalSchema = z.object({
    description: z.string(),
    price: z.number().positive(),
    category: z.string(),
    type: z.enum(['income', 'outcome'])
});

type NewTransactionModalForm = z.infer<typeof newTransactionModalSchema>;

export function NewTransactionModal() {
    const createTransaction = useContextSelector(TransactionsContext, (context) => context.createTransaction);

    const {
        control,
        register,
        handleSubmit,
        formState: { isSubmitting },
        reset
    } = useForm<NewTransactionModalForm>({
        resolver: zodResolver(newTransactionModalSchema),
        defaultValues: {
            type: 'income'
        }
    });

    async function handleCreateNewTransaction(data: NewTransactionModalForm) {
        await createTransaction(data);

        reset();
    }

    return (
        <Dialog.Portal>
            <Overlay />

            <Content>
                <Dialog.Title>Nova transação</Dialog.Title>

                <CloseButton><X size={24} /></CloseButton>
                
                <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
                    <input
                        type="text"
                        placeholder='Descrição'
                        required
                        {...register('description')}
                        autoFocus
                    />
                    <input
                        type="text"
                        placeholder='Preço'
                        required
                        {...register('price', { valueAsNumber: true })}
                    />
                    <input
                        type="text"
                        placeholder='Categoria'
                        required
                        {...register('category')}
                    />

                    <Controller
                        control={control}
                        name="type"
                        render={({ field }) => {
                            return (
                                <TransactionType value={field.value} onValueChange={field.onChange}>
                                    <TransactionTypeButton variant='income' value="income">
                                        <ArrowCircleUp size={24} />
                                        Entrada
                                    </TransactionTypeButton>

                                    <TransactionTypeButton variant='outcome' value="outcome">
                                        <ArrowCircleDown size={24} />
                                        Saída
                                    </TransactionTypeButton>
                                </TransactionType>
                            )
                        }}
                    />

                    <button type="submit" disabled={isSubmitting}>Cadastrar</button>
                </form>
            </Content>
        </Dialog.Portal>
    )
}