import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db/prisma";

interface SearchPageProps {
  searchParams: { query: string };
}

export function generateMetadata({ searchParams: { query } }: SearchPageProps) {
  return {
    title: `Search: ${query} - Next Store`,
  };
}

async function SearchPage({ searchParams: { query } }: SearchPageProps) {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { decrription: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { id: "desc" },
  });

  if (products.length === 0) {
    return <div className="text-center">No products found</div>;
  }

  return (
    <div>
      <div className="text-start my-5 flex flex-col gap-4">
        Results for: {query}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
