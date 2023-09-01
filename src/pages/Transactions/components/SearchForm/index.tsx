import { MagnifyingGlass } from "phosphor-react";
import { SearchFormContainer } from "./styles";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionsContext } from "../../../../contexts/TransactionsContext";
import { useContextSelector } from "use-context-selector";
import { memo } from "react";

const searchFormSchema = z.object({
    query: z.string()
})

type SearchForm = z.infer<typeof searchFormSchema>;

function SearchFormComponent() {
    const getTransactions = useContextSelector(TransactionsContext, (context) => context.getTransactions);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<SearchForm>({
        resolver: zodResolver(searchFormSchema)
    });

    async function handleSearchTransactions({ query }: SearchForm) {
        await getTransactions(query);
    }

    return (
        <SearchFormContainer onSubmit={handleSubmit(handleSearchTransactions)}>
            <input
                type="text"
                placeholder="Busque por transações"
                {...register('query')}
            />

            <button type="submit" disabled={isSubmitting}>
                <MagnifyingGlass size={20} />
                Buscar
            </button>
        </SearchFormContainer>
    )
}

export const SearchForm = memo(SearchFormComponent);