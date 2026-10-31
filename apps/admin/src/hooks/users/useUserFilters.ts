import { useSearchParams } from "react-router-dom";
export function useUserFilters() {
  const [params, setParams] = useSearchParams();
  const rawPage = Number(params.get("page") ?? 1);
  const filters = {
    search: params.get("search") ?? "",
    page: Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1,
    pageSize: 5,
  };
  return {
    filters,
    setSearch: (search: string) =>
      setParams(
        { ...(search ? { search } : {}), page: "1" },
        { replace: true },
      ),
    setPage: (page: number) =>
      setParams({
        ...(filters.search ? { search: filters.search } : {}),
        page: String(page),
      }),
  };
}
