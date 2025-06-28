import { useState, useCallback } from "react";
import { toast } from "sonner";

// Generic async function type
type AsyncCallback<TArgs extends unknown[], TResponse> = (...args: TArgs) => Promise<TResponse>;

// Return type for the useFetch hook
interface FetchResult<TResponse, TArgs extends unknown[]> {
        data: TResponse | undefined;
        loading: boolean;
        error: Error | null;
        fn: (...args: TArgs) => Promise<TResponse | undefined>;
        setData: React.Dispatch<React.SetStateAction<TResponse | undefined>>;
}

function useFetch<TArgs extends unknown[], TResponse>(
        cb: AsyncCallback<TArgs, TResponse>
): FetchResult<TResponse, TArgs> {
        const [data, setData] = useState<TResponse | undefined>(undefined);
        const [loading, setLoading] = useState<boolean>(false);
        const [error, setError] = useState<Error | null>(null);

        const fn = useCallback(
                async (...args: TArgs): Promise<TResponse | undefined> => {
                        setLoading(true);
                        setError(null);

                        try {
                                const response = await cb(...args);
                                setData(response);
                                return response;
                        } catch (err) {
                                const error = err instanceof Error ? err : new Error("Unknown error");
                                setError(error);
                                toast.error(error.message);
                                return undefined;
                        } finally {
                                setLoading(false);
                        }
                },
                [cb]
        );

        return { data, loading, error, fn, setData };
}

export default useFetch;