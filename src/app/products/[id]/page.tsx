import notFound from "@/app/not-found";
import PriceTag from "@/components/PriceTag";
import { prisma } from "@/lib/db/prisma";
import { Metadata } from "next";
import Image from "next/image";
import { cache } from "react";
import AddToCartButton from "./AddToCartButton";
import incrementProductQuantity from "./actions";

interface ProductPageProps {
  params: {
    id: string;
  };
}

const getProduct = cache(async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (!product) notFound();
  return product;
});

export async function generateMetadata({
  params: { id },
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(id);
  if (!product) {
    return {
      title: "Product Not Found - Next Store",
      description: "The requested product could not be found.",
    };
  }
  return {
    title: product.name + " - Next Store",
    description: product.decrription,
    openGraph: {
      images: [{ url: product.imageUrl }],
    },
  };
}

async function ProductPage({ params: { id } }: ProductPageProps) {
  const product = await getProduct(id);

  if (!product) {
    return notFound();
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={500}
        height={500}
        className="rounded-lg"
        priority
      />
      <div className="">
        <h1 className="text-5xl font-bold">{product.name}</h1>
        <PriceTag price={product.price} className="mt-4" />
        <p className="py-6">{product.decrription}</p>

        <AddToCartButton
          productId={product.id}
          incrementProductQuantity={incrementProductQuantity}
        />
      </div>
    </div>
  );
}

export default ProductPage;
