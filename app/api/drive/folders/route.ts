import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const queryName = searchParams.get('name') || 'Mini Highland Cows Product Images';

  try {
    // Search for folders matching the given name or general folders
    const q = `mimeType = 'application/vnd.google-apps.folder' and name contains '${queryName.replace(/'/g, "\\'")}' and trashed = false`;
    const driveUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,mimeType,createdTime,modifiedTime)&pageSize=10`;

    const res = await fetch(driveUrl, {
      headers: { Authorization: authHeader },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return NextResponse.json({ error: errData.error?.message || 'Google Drive API error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ folders: data.files || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to search Google Drive folders' }, { status: 500 });
  }
}
