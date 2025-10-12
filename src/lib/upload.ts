export async function uploadPlaceholder(file: File): Promise<{ url: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { url: URL.createObjectURL(file) };
}