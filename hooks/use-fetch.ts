// hooks/use-fetch.ts
import { useState } from "react";
import { toast } from "sonner";

// Generic async function type
type AsyncCallback<TArgs extends unknown[], TResponse> = (...args: TArgs) => Promise<TResponse>;

function useFetch<TArgs extends unknown[], TResponse>(
        cb: AsyncCallback<TArgs, TResponse>
) {
        const [data, setData] = useState<TResponse | undefined>(undefined);
        const [loading, setLoading] = useState<boolean>(false);
        const [error, setError] = useState<Error | null>(null);

        const fn = async (...args: TArgs): Promise<TResponse | void> => {
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
                } finally {
                        setLoading(false);
                }
        };

        return { data, loading, error, fn, setData };
}

export default useFetch;
