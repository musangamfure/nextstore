import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import FormSubmitButton from "@/components/formSubmitButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/pages/api/auth/[...nextauth]";

export const metadata = {
  title: "Add Product - Next Store",
};

async function addProduct(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }
  const name = formData.get("name")?.toString();
  const decrription = formData.get("decrription")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const price = Number(formData.get("price") || 0);

  if (!name || !decrription || !imageUrl || !price) {
    throw Error("Missing required fields");
  }

  await prisma.product.create({
    data: { name, decrription, imageUrl, price },
  });
  redirect("/");
}

export default async function AddProductPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }
  return (
    <div>
      <h1 className="mb-3 text-lg">Add Product</h1>
      <form action={addProduct}>
        <input
          required
          className="input-bordered input mb-3 w-full"
          name="name"
          type="text"
          placeholder="Name"
        />
        <textarea
          required
          className="textarea-bordered textarea mb-3 w-full"
          name="decrription"
          placeholder="Description"
        />
        <input
          required
          className="input-bordered input mb-3 w-full"
          name="imageUrl"
          type="url"
          placeholder="Image URL"
        />
        <input
          required
          className="input-bordered input mb-3 w-full"
          name="price"
          type="number"
          placeholder="Price"
        />
        <FormSubmitButton className="btn-block">Add Product</FormSubmitButton>
      </form>
    </div>
  );
}
