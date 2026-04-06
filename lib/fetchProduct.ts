export async function fetchProduct(productName: string) {
  try {
    const res = await fetch(`/api/product?name=${productName}`);

    return await res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
