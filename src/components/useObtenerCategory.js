import { useSelector } from "react-redux";

export const useObtenerCategory = () => {
  const categorias = useSelector((state) => state.categories);

  const getNombreCategoria = (categoryId) => {
    if (!categoryId) return "—";
    const categoria = categorias.find((c) => c.id === categoryId);
    return categoria?.name ?? "—";
  };

  const getCategoria = (categoryId) => {
    if (!categoryId) return null;
    return categorias.find((c) => c.id === categoryId) ?? null;
  };

  return { getNombreCategoria, getCategoria };
};