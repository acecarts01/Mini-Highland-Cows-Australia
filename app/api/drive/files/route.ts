import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const folderId = searchParams.get('folderId');

  try {
    let q = "trashed = false and (mimeType contains 'image/' or mimeType = 'application/octet-stream')";
    if (folderId) {
      q = `'${folderId.replace(/'/g, "\\'")}' in parents and ${q}`;
    }

    const fields = 'files(id,name,mimeType,size,thumbnailLink,webContentLink,createdTime)';
    const driveUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=${encodeURIComponent(fields)}&pageSize=50`;

    const res = await fetch(driveUrl, {
      headers: { Authorization: authHeader },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return NextResponse.json({ error: errData.error?.message || 'Failed to list Google Drive files' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ files: data.files || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to list Google Drive files' }, { status: 500 });
  }
}
