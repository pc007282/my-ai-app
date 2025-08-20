export async function UploadFile({ file }) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('https://image-background-remover.onrender.com/api/upload', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('檔案上傳失敗');
  return await response.json();
}

export async function RemoveImageBackground({ image_url }) {
  const response = await fetch('https://my-ai-app-935f.onrender.com/api/remove-background', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url }),
  });
  if (!response.ok) throw new Error('背景移除失敗');
  return await response.json();
}
